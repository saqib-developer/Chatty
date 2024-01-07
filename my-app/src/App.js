import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { AuthErrorCodes, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref as databaseRef, get, set, serverTimestamp } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import Home from "./components/Home";
import Chat from "./components/Chat";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVi80UaxC9bUKtlPRz933_Kuhc_o-ZHuw",
  authDomain: "chatty-5434b.firebaseapp.com",
  projectId: "chatty-5434b",
  storageBucket: "chatty-5434b.appspot.com",
  messagingSenderId: "279267249399",
  appId: "1:279267249399:web:09c486eeddd944703dd7f2",
  measurementId: "G-80TVEP6ZJZ",
};

function App() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);
  const storage = getStorage(app);
  const [logedIn, setLogedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState(null);
  const [savedContacts, setSavedContacts] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [contactsData, setContactsData] = useState([]);
  const [activeId, setActiveId] = useState();
  const showError = (borderId, spanId, error) => {
    document.getElementById(borderId).style.border = "1.5px solid red";
    document.getElementById(spanId).textContent = error;
    setTimeout(() => {
      document.getElementById(borderId).style.border = "1.5px solid grey";
      document.getElementById(spanId).textContent = "";
    }, 3000);
  };

  const loginEmailPassword = async (event) => {
    event.preventDefault();
    setIsButtonDisabled(true);

    const signinEmail = document.getElementById("loginemail").value;
    const signinPassword = document.getElementById("loginpassword").value;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, signinEmail, signinPassword);
      console.log(userCredential.user);
      window.location.href = "/";
    } catch (error) {
      setIsButtonDisabled(false);
      console.log(error);
      if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
        showError("loginpassword", "showError", error.code);
      } else {
        showError("loginemail", "showError", error.code);
      }
    }
  };

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
  const createAccount = async (event) => {
    event.preventDefault();
    setIsButtonDisabled(true);

    // Get form values
    const profileImgInput = document.getElementById("select-file");
    const profileImg = profileImgInput.files[0];
    const signinName = document.getElementById("loginname").value;
    const signinEmail = document.getElementById("loginemail").value;
    const signinPassword = document.getElementById("loginpassword").value;

    try {
      if (!signinName || !signinEmail || !signinPassword) {
        throw new Error("Please fill in all required fields.");
      }

      let downloadURL = "/img/default-profile-img.png"; // Default image URL
      const userCredential = await createUserWithEmailAndPassword(auth, signinEmail, signinPassword);

      if (profileImg) {
        const metadata = { contentType: profileImg.type };
        const imgRef = storageRef(storage, `Profile Images/${userCredential.user.uid}/${profileImg.name}`);
        await uploadBytesResumable(imgRef, profileImg, metadata);
        downloadURL = await getDownloadURL(imgRef);
      }

      await set(databaseRef(db, "users/" + userCredential.user.uid), {
        name: signinName,
        profileImg: downloadURL,
        email: signinEmail,
        Id: userCredential.user.uid,
      });

      const data = { bvHxA1Tl0fYIstX9R1yVfgqF6MP2: true };
      await set(databaseRef(db, `users/${userCredential.user.uid}/contacts`), data);

      const existingContactsSnapshot = await get(databaseRef(db, `users/bvHxA1Tl0fYIstX9R1yVfgqF6MP2/contacts`));
      const existingContacts = existingContactsSnapshot.val() || {};

      const updatedContacts = { ...existingContacts, [userCredential.user.uid]: true };

      await set(databaseRef(db, `users/bvHxA1Tl0fYIstX9R1yVfgqF6MP2/contacts`), updatedContacts);

      // Sender
      await set(databaseRef(db, `users/bvHxA1Tl0fYIstX9R1yVfgqF6MP2/messages/${userCredential.user.uid}/${Date.now()}`), {
        message: "Aoa",
        sentby: "bvHxA1Tl0fYIstX9R1yVfgqF6MP2",
        timestamp: serverTimestamp(),
      });

      // Receiver
      await set(databaseRef(db, `users/${userCredential.user.uid}/messages/bvHxA1Tl0fYIstX9R1yVfgqF6MP2/${Date.now()}`), {
        message: "Aoa",
        sentby: "bvHxA1Tl0fYIstX9R1yVfgqF6MP2",
        timestamp: serverTimestamp(),
      });

      // Sender
      await set(databaseRef(db, `users/bvHxA1Tl0fYIstX9R1yVfgqF6MP2/messages/${userCredential.user.uid}/${Date.now()}`), {
        message: "If you have any queries or questions regarding the website you can ask me",
        sentby: "bvHxA1Tl0fYIstX9R1yVfgqF6MP2",
        timestamp: serverTimestamp(),
      });

      // Receiver
      await set(databaseRef(db, `users/${userCredential.user.uid}/messages/bvHxA1Tl0fYIstX9R1yVfgqF6MP2/${Date.now()}`), {
        message: "If you have any queries or questions regarding the website you can ask me",
        sentby: "bvHxA1Tl0fYIstX9R1yVfgqF6MP2",
        timestamp: serverTimestamp(),
      });

      console.log("User data successfully saved");
      window.location.href = "/";
    } catch (error) {
      setIsButtonDisabled(false);
      console.error(error);
      showError("loginemail", "showError", error.message || "An error occurred.");
    }
  };

  const monitorAuthState = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        handleAuthenticatedUser(user);
      } else {
        handleUnauthenticatedUser();
      }
    });
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const fetchedContacts = [];

        for (const userId of savedContacts) {
          const snapshot = await get(databaseRef(db, "users/" + userId));
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
      if (savedContacts.length > 0) {
        fetchContacts(); // Fetch contacts when savedContacts change
      }
    } catch (error) {
      console.error("Error: " + error);
    }
  }, [db, savedContacts]);

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

  const sendMsg = async (receiverId, msg) => {
    // Sender
    await set(databaseRef(db, `users/${userId}/messages/${receiverId}/${Date.now()}`), {
      message: msg,
      sentby: userId,
      timestamp: serverTimestamp(),
    });

    // Receiver
    await set(databaseRef(db, `users/${receiverId}/messages/${userId}/${Date.now()}`), {
      message: msg,
      sentby: userId,
      timestamp: serverTimestamp(),
    });
  };

  const handleAuthenticatedUser = async (user) => {
    setUserId(user.uid);
    setLogedIn(true);

    try {
      const snapshot = await get(databaseRef(db, "users/" + user.uid));
      const userVal = snapshot.val();

      if (userVal) {
        setProfilePic(userVal.profileImg);
        setName(userVal.name);
        setSavedContacts(Object.keys(userVal.contacts));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnauthenticatedUser = () => {
    setUserId(null);
    setName(null);
    setLogedIn(false);
    console.log("You are not logged in.");
  };

  useEffect(() => {
    monitorAuthState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            exact
            path={device ? "/*" : "/"}
            element={
              <Home
                db={db}
                showError={showError}
                logedIn={logedIn}
                savedContacts={savedContacts}
                userId={userId}
                name={name}
                profilePic={profilePic}
                logout={logout}
                contactsData={contactsData}
                sendMsg={sendMsg}
                setActiveId={setActiveId}
                device={device}
              />
            }
          />
          {device ? null : (
            <>
              {contactsData &&
                contactsData.map((data, index) => (
                  <React.Fragment key={index}>
                    <Route
                      exact
                      path={data.Id}
                      element={
                        <div className="chats">
                          {/* <Header signIn={logedIn} logout={logout} profilePic={profilePic} /> */}
                          <Chat
                            db={db}
                            senderId={userId}
                            receiverId={data.Id}
                            profilePic={data.profileImg}
                            name={data.name}
                            sendMsg={sendMsg}
                            setActiveId={setActiveId}
                            logedIn={logedIn}
                          />
                        </div>
                      }
                    />
                  </React.Fragment>
                ))}
            </>
          )}
          <Route exact path="/signIn" element={<SignIn isButtonDisabled={isButtonDisabled} purpose={"Sign in"} account={loginEmailPassword} />} />
          <Route exact path="/signUp" element={<SignIn isButtonDisabled={isButtonDisabled} purpose={"Sign up"} account={createAccount} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
