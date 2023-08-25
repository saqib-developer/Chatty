import React, { useState, useEffect } from 'react';
import './Chat.css';

export default function Chat(props) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Fetch messages when the component mounts
        props.retrieveMsg(props.receiverId).then((fetchedMessages) => {
            setMessages(fetchedMessages);
        });
    }, [props, props.receiverId, props.retrieveMsg]);

    const manageMsg = (event) => {
        event.preventDefault();
        const msgInput = document.getElementById('msg');
        props.sendMsg(props.receiverId, msgInput.value);
        msgInput.value = ''; // Clear the input field
    };

    const arrange = (sentby) => {
        if (props.senderId === sentby) {
            return 'mine';
        } else {
            return 'other';
        }
    };

    return (
        <div className='chat'>
            <div className="contact-info">
                <img src={props.profilePic} alt="" />
                <span>{props.name}</span>
                <div className='about-container'>
                    <span>About: {props.about}</span>
                    <hr />
                </div>
            </div>
            <div className="chats">
                <div className="chat-container">
                    {messages.map((data, index) => (
                        <div key={index} className={arrange(data.sentby)}>
                            <span>{data.message}</span>
                        </div>
                    ))}
                </div>
                <form onSubmit={manageMsg} className="chat-input">
                    <input type="text" id='msg' />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
}
