import React from "react";
import "./Chat.css";
import ChatHeader from "./ChatHeader";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import GifIcon from "@mui/icons-material/Gif";
import Message from "./Message";

import { useSelector } from "react-redux";
import { selectChannelId, selectChannelName } from "./features/appSlice";
import { selectUser } from "./features/userSlice";
import { useState } from "react";
import { useEffect } from "react";
import db from "./firebase";
import firebase from "firebase/compat/app";

function Chat() {
  const channelId = useSelector(selectChannelId);
  const channelName = useSelector(selectChannelName);
  const user = useSelector(selectUser);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (channelId) {
      db.collection("channels")
        .doc(channelId)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [channelId]);

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("channels").doc(channelId).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user,
    });
    setInput("");
    console.log(input);
  };

  return (
    <div className="chat">
      <ChatHeader channelName={channelName} />

      <div className="chat__messages">
        {messages.map((message) => (
          // console.log(message)
          <Message
            timestamp={message.timestamp}
            message={message.message}
            name={message.user.displayName}
            image={message.user.photo}
          />
        ))}
      </div>

      <div className="chat__input">
        <AddCircleIcon />
        <form action="">
          <input
            value={input}
            disabled={!channelId}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${channelName}`}
          />
          <button
            className="chat__inputButton"
            type="Submit"
            onClick={sendMessage}
          >
            Send Message
          </button>
        </form>

        <div className="chat__inputIcons">
          <CardGiftcardIcon fontSize="large" />
          <GifIcon fontSize="large" />
          <EmojiEmotionsIcon fontSize="large" />
        </div>
      </div>
    </div>
  );
}

export default Chat;
