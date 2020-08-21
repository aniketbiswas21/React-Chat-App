import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import Infobar from "../InfoBar/Infobar";
import Input from "../Input/Input";
import "./Chat.css";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const ENDPOINT = "localhost:5000";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);
    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
    console.log(socket);
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, [messages]);

  // function for sending messages
  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <>
      {console.log(message, messages)}
      <div className="outerContainer">
        <div className="container">
          <Infobar room={room} />
          <Input
            message={messages}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;
