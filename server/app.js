import express from "express";
import { createServer } from 'http';
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const port = 3004;
const app = express();
const server = createServer(app);

const secretKeyJWT = "jgfhjhhjggfffghjfghjgfj"

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }));



app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.get("/login", (req, res) => {

    const token = jwt.sign({ _id: "asfdasdfasdfsad" }, secretKeyJWT)

    res
        .cookie("token", token, { httpOnly: false, secure: true, sameSite: "none" })
        .json({
            message: "Login Success",
        })
})


const user = false;

io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {

        if (err) return next(err)

        const token = socket.request.cookies.token;

        if (!token) return next(new Error("Authentication Error"))

        const decoded = jwt.verify(token, secretKeyJWT);

        next()
    })
})

io.on("connection", (socket) => {

    console.log("User Connected", socket.id);

    socket.on("message", ({ room, message }) => {
        console.log({ room, message });
        // io.emit("receive-message", message)
        // socket.broadcast.emit("receive-message", message)
        socket.to(room).emit("receive-message", message)

    })

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User joined room : ${room}`)
    })

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    })
    // socket.emit("Welcome", ` Welcome to the server `)
    // socket.broadcast.emit("Welcome", ` ${socket.id} joined the server.`)
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
}

)