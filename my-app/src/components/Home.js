import React, { useState, useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { getDatabase, ref as databaseRef, get, set, serverTimestamp } from "firebase/database";
import "./Home.css";
import Chat from "./Chat";
import { FaCircleQuestion, FaCopy, FaPlus, FaXmark } from "react-icons/fa6";
import Header from "./Header";

export default function Home(props) {
  const [contactsData, setContactsData] = useState([]);
  const [showChatsOf, setShowChatsOf] = useState();
  const [activeId, setActiveId] = useState();
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [addUserButtonDisabled, setAddUserButtonDisabled] = useState(false);
  const [newContact, setNewContact] = useState();

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [device, setDevice] = useState(true); //true === large screen && false === small screen

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setDevice(screenWidth <= 770 ? false : true);
  }, [screenWidth]);

  console.log(screenWidth);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const fetchedContacts = [];

        for (const userId of props.savedContacts) {
          const snapshot = await get(databaseRef(props.db, "users/" + userId));
          if (snapshot.exists()) {
            const userData = snapshot.val();
            fetchedContacts.push(userData); // Add the user data to the array
          }
        }

        setContactsData(fetchedContacts); // Set the fetched contacts to the state
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    try {
      if (props.savedContacts.length > 0) {
        fetchContacts(); // Fetch contacts when props.savedContacts change
      }
    } catch (error) {
      console.error("Error: " + error);
    }
  }, [props.db, props.savedContacts]);

  const sendMsg = async (receiverId, msg) => {
    // Sender
    await set(databaseRef(props.db, `users/${props.userId}/messages/${receiverId}/${Date.now()}`), {
      message: msg,
      sentby: props.userId,
      timestamp: serverTimestamp(),
    });

    // Receiver
    await set(databaseRef(props.db, `users/${receiverId}/messages/${props.userId}/${Date.now()}`), {
      message: msg,
      sentby: props.userId,
      timestamp: serverTimestamp(),
    });
  };

  function getGreeting() {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning!";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good Afternoon!";
    } else {
      return "Good Night!";
    }
  }

  function formatTimestamp(timestamp) {
    const currentTimestamp = Date.now();
    const messageTimestamp = timestamp;

    const timeDifferenceInHours = (currentTimestamp - messageTimestamp) / (1000 * 60 * 60);

    if (timeDifferenceInHours < 24) {
      // Display time if within 24 hours
      return new Date(messageTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (timeDifferenceInHours < 48) {
      // Display 'yesterday' if within 48 hours
      return "Yesterday";
    } else {
      // Display date if more than 48 hours
      return new Date(messageTimestamp).toLocaleDateString();
    }
  }

  useEffect(() => {
    // Remove 'active' class from all elements with class 'contact'
    const contactElements = document.getElementsByClassName("contact");
    for (const element of contactElements) {
      element.classList.remove("active");
    }

    // Add 'active' class to the element with the specified ID
    const activeElement = document.getElementById(activeId);
    if (activeElement) {
      activeElement.classList.add("active");
    }
  }, [activeId]);
  useEffect(() => {
    try {
      if (props.addUserButtonDisabled) {
        document.getElementById("addUserIdOkbtn").style.background = "grey";
        document.getElementById("addUserIdOkbtn").style.cursor = "no-drop";
      } else {
        document.getElementById("addUserIdOkbtn").style.background = "blue";
        document.getElementById("addUserIdOkbtn").style.cursor = "pointer";
      }
    } catch (error) {
      console.error(error);
    }
  }, [props.addUserButtonDisabled]);
  const addContact = async (event) => {
    event.preventDefault();
    setAddUserButtonDisabled(true);

    try {
      const snapshot = await get(databaseRef(props.db, `users/${newContact}`));

      if (newContact === props.userId) {
        props.showError("addUserId", "error-display", "You cannot add your own contact.");
        setAddUserButtonDisabled(false);
        throw new Error("You cannot add yourself as a contact.");
      }

      if (snapshot.exists()) {
        const existingContactsSnapshot = await get(databaseRef(props.db, `users/${props.userId}/contacts`));
        const existingContacts = existingContactsSnapshot.val() || {};

        if (Object.keys(existingContacts).includes(newContact)) {
          props.showError("addUserId", "error-display", "Contact already exists in your list.");
          setAddUserButtonDisabled(false);
          throw new Error("Contact already exists in your list.");
        }

        // Update the database with the new contact list
        const updatedContacts = { ...existingContacts, [newContact]: true };
        await set(databaseRef(props.db, `users/${props.userId}/contacts`), updatedContacts);

        console.log("Contact added successfully");
        setShowAddContactModal(false);
      } else {
        props.showError("addUserId", "error-display", "There is no contact with that ID.");
        setAddUserButtonDisabled(false);
        console.log("There is no contact with that ID");
        document.getElementById("addUserId").style.border = "1.5px solid red";
        setTimeout(() => {
          document.getElementById("addUserId").style.border = "1.5px solid #404040";
        }, 3000);
      }
    } catch (error) {
      setAddUserButtonDisabled(false);
      console.error("Error while adding contact:", error);
    }
  };

  return (
    <div className="home">
      <div className="contacts">
        <div className="contact">
          <div className="profile-img-container">
            <img src={props.logedIn && props.profilePic ? props.profilePic : "/img/default-profile-img.png"} alt="" style={{ cursor: "pointer" }} />
          </div>
          <div className="contact-detail">
            <p className="greeting-text">{getGreeting()}</p>
            <p className="name-text">{props.name}</p>
          </div>
          <button onClick={() => setShowAddContactModal(!showAddContactModal)} className="icons">
            <FaPlus title="Add Contact" />
          </button>
        </div>
        <hr />
        {contactsData.length > 0 ? (
          contactsData &&
          contactsData.map((data, index) => (
            <React.Fragment key={index}>
              <Link className="contact" id={data.Id} to={data.Id}>
                <div className="profile-img-container">
                  <img src={data.profileImg} alt="" />
                </div>
                <div className="contact-detail">
                  <p className="name-text">{data.name}</p>
                  <p style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8em", color: "#bbbbbb" }}>
                    <span>
                      {data.messages ? data.messages[props.userId][Math.max(...Object.keys(data.messages[props.userId]).map(Number))].message : null}
                    </span>
                    <span>{data.messages ? formatTimestamp(Math.max(...Object.keys(data.messages[props.userId]).map(Number))) : null}</span>
                  </p>
                </div>
              </Link>
            </React.Fragment>
          ))
        ) : props.logedIn ? null : (
          <div className="simple-watermark">
            <span>
              <Link style={{ color: "#4242d3" }} to={"/signIn"}>
                Sign in
              </Link>
              to View your Contacts here
            </span>
          </div>
        )}
      </div>

      <div className="chats">
        <Header signIn={props.logedIn} logout={props.logout} profilePic={props.profilePic} />
        <Routes>
          {contactsData &&
            contactsData.map((data, index) => (
              <React.Fragment key={index}>
                <Route
                  exact
                  path={data.Id}
                  element={
                    <Chat
                      db={props.db}
                      senderId={props.userId}
                      receiverId={data.Id}
                      profilePic={data.profileImg}
                      name={data.name}
                      sendMsg={sendMsg}
                      setActiveId={setActiveId}
                      logedIn={props.logedIn}
                    />
                  }
                />
              </React.Fragment>
            ))}
        </Routes>
      </div>
      {showAddContactModal ? (
        <div className="modal-container">
          <form onSubmit={addContact} className="modal">
            <div className="question-mark-icon">
              <FaCircleQuestion title={`Ask your Friend for his id and paste it in \n the input field to add him to your contacts`} />
              <FaXmark
                onClick={() => {
                  setShowAddContactModal(false);
                }}
              />
            </div>
            <input
              value={newContact}
              onChange={(event) => setNewContact(event.target.value)}
              required
              autoComplete="off"
              placeholder="Enter the User Id"
              id="addUserId"
              type="text"
            />
            <p id="error-display" className="error-display"></p>
            <h2>Your Id</h2>
            <div className="copyId">
              <span>{props.userId}</span>
              <div
                title="Copy Id"
                role="button"
                tabIndex={0}
                onClick={() => navigator.clipboard.writeText(props.userId).catch((err) => console.error("Unable to copy text", err))}
              >
                <FaCopy />
              </div>
            </div>
            <div>
              <button className="primary" type="submit" id="addUserIdOkbtn" disabled={addUserButtonDisabled}>
                OK
              </button>
              <button
                className="secondary"
                onClick={() => {
                  setShowAddContactModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
