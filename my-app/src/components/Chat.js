import React, { useState, useEffect } from "react";
import "./Chat.css";
import { ref as databaseRef, onValue } from "firebase/database";
import { FaP, FaPaperPlane } from "react-icons/fa6";
import Header from "./Header";

export default function Chat(props) {
  const [messages, setMessages] = useState([]);
  const chatsRef = React.useRef(null); // Create a ref to hold the chats container
  props.setActiveId(props.receiverId);

  useEffect(() => {
    const updateMessages = (snapshot) => {
      const updatedMessages = [];
      snapshot.forEach((childSnapshot) => {
        const messageData = childSnapshot.val();
        updatedMessages.push({
          sentby: messageData.sentby,
          message: messageData.message,
          timestamp: messageData.timestamp,
        });
      });

      setMessages(updatedMessages);
    };

    const unsubscribe = onValue(databaseRef(props.db, `users/${props.senderId}/messages/${props.receiverId}`), updateMessages);

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [props.db, props.receiverId, props.senderId]);

  useEffect(() => {
    // Scroll to the bottom when messages update
    if (chatsRef.current) {
      chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
      window.scrollTo(0, document.documentElement.scrollHeight);
    }
  }, [messages]);

  const manageMsg = async (event) => {
    const msg = document.getElementById("msg").value;
    document.getElementById("msg").value = "";
    event.preventDefault();
    await props.sendMsg(props.receiverId, msg);
  };

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function formatTimestampforMonth(timestamp) {
    const date = new Date(timestamp);
    const options = { year: "numeric", month: "short", day: "numeric" };

    return date.toLocaleDateString(undefined, options);
  }

  const arrange = (sentby) => (props.senderId === sentby ? "mine" : "other");

  return (
    <>
      <div ref={chatsRef} className="chat-container">
        {messages.length !== 0
          ? messages.map((data, index) => (
              <React.Fragment key={index}>
                {index === 0 ? (
                  <div className="month-change">
                    <span>{formatTimestampforMonth(data.timestamp)}</span>
                  </div>
                ) : null}
                {index > 0 && formatTimestampforMonth(messages[index - 1].timestamp) !== formatTimestampforMonth(data.timestamp) ? (
                  <div className="month-change">
                    <span>{formatTimestampforMonth(data.timestamp)}</span>
                  </div>
                ) : null}
                <div className={arrange(data.sentby)}>
                  <span>
                    {data.message}
                    <span className="timestamp">{formatTimestamp(data.timestamp)}</span>
                  </span>
                </div>
              </React.Fragment>
            ))
          : null}
      </div>
      <form onSubmit={manageMsg} className="chat-input">
        <div className="form-msg-container">
          <input placeholder="Type Your Message Here..." required type="text" id="msg" autoComplete="off" />
          <button type="submit">
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </>
  );
}
