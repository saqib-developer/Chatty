import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignIn from "./components/SignIn";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { AuthErrorCodes, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref as databaseRef, get, set, serverTimestamp } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import Home from "./components/Home";

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

  const createAccount = async (event) => {
    event.preventDefault();
    setIsButtonDisabled(true);

    // Get form values
    const profileImg = document.getElementById("select-file").files[0];
    const signinName = document.getElementById("loginname").value;
    const signinEmail = document.getElementById("loginemail").value;
    const signinPassword = document.getElementById("loginpassword").value;

    try {
      if (!profileImg || !signinName || !signinEmail || !signinPassword) {
        throw new Error("Please fill in all required fields.");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, signinEmail, signinPassword);

      const metadata = { contentType: profileImg.type };
      const imgRef = storageRef(storage, `Profile Images/${userCredential.user.uid}/${profileImg.name}`);
      const downloadURL = await uploadBytesResumable(imgRef, profileImg, metadata).then(() => getDownloadURL(imgRef));

      await set(databaseRef(db, "users/" + userCredential.user.uid), {
        name: signinName,
        profileImg: downloadURL,
        email: signinEmail,
        Id: userCredential.user.uid,
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
            path="/*"
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
              />
            }
          />
          <Route exact path="/signIn" element={<SignIn isButtonDisabled={isButtonDisabled} purpose={"Sign in"} account={loginEmailPassword} />} />
          <Route exact path="/signUp" element={<SignIn isButtonDisabled={isButtonDisabled} purpose={"Sign up"} account={createAccount} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
