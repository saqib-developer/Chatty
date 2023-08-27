import React, { useState, useEffect } from 'react';
import './Chat.css';
import { ref as databaseRef, onValue } from 'firebase/database';

export default function Chat(props) {
    const [messages, setMessages] = useState([]);
    const chatsRef = React.useRef(null); // Create a ref to hold the chats container

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
        }
    }, [messages]);

    const manageMsg = async (event) => {
        const msg = document.getElementById('msg').value;
        document.getElementById('msg').value = '';
        event.preventDefault();
        await props.sendMsg(props.receiverId, msg);
    };

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    }

    const arrange = (sentby) => (props.senderId === sentby) ? 'mine' : 'other';

    return (
        <div className='info-msg-container'>
            <div className="contact-info">
                <div className="reciever-profilePic"><img src={props.profilePic} alt="" /></div>
                <span className='reciever-name'>{props.name}</span>
                <hr />
                <div className='about-container'>
                    <span>About: {props.about}</span>
                </div>
            </div>
            <div className="chats">
                <div ref={chatsRef} className="chat-container">
                    {messages.length !== 0 ?
                        messages.map((data, index) => (
                            <div key={index} className={arrange(data.sentby)}>
                                <span>
                                    {data.message}
                                    <span className="timestamp">
                                        {formatTimestamp(data.timestamp)}
                                    </span>
                                </span>

                            </div>
                        )) : <div className='watermark'><span>Break The Ice</span></div>}
                </div>
                <form onSubmit={manageMsg} className="chat-input">
                    <input required type="text" id='msg' autocomplete="off"/>
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
}
