import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client"

const App = () => {
  const socket = useMemo(() => io("http://localhost:3004", {
    withCredentials: true
  }), [])

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");



  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("")
  }

  const joinRoomHandler = (e)=>{
    e.preventDefault();
    socket.emit("join-room", roomName)
    setRoomName("")
  }

  useEffect(() => {
    socket.on("connect", (data) => {
      setSocketId(socket.id)
      console.log("Connected", socket.id)
    })

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data])
    })

    socket.on("Welcome", (s) => { console.log(s) });

    return () => {
      socket.disconnect();
    }
  }, [])



  return <Container maxWidth="sm">
    {/* <Box sx={{height: 100}}/> */}


    <Typography variant="h6" component="div" gutterBottom>
      {socketID}
    </Typography>

    <form onSubmit={joinRoomHandler}>
      <h5>Join Room</h5>
      <TextField value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        id="outlined-basic"
        label="Room Name"
        variant="outlined" />

      <Button type="submit" variant="contained" color="primary">Join</Button>

    </form>

    <form onSubmit={handleSubmit}>
      <TextField value={message}
        onChange={(e) => setMessage(e.target.value)}
        id="outlined-basic"
        label="Message"
        variant="outlined" />

      <TextField value={room}
        onChange={(e) => setRoom(e.target.value)}
        id="outlined-basic"
        label="Room"
        variant="outlined" />
      <Button type="submit" variant="contained" color="primary">Send</Button>
    </form>

    <Stack>
      {
        messages.map((message, index) => (
          <Typography key={index} variant="body2" color="text.secondary">
            {message}
          </Typography>
        ))
      }
    </Stack>
  </Container>
};

export default App;