import React, { useState, useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Header from './components/Header';
import SignIn from './components/SignIn';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  AuthErrorCodes,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import {
  getDatabase,
  ref as databaseRef,
  get,
  set,
  serverTimestamp
} from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytesResumable
} from "firebase/storage";
import DialogueBox from './components/DialogueBox';
import Contact from './components/Contact';
import ShareContact from './components/ShareContact';
import Chat from './components/Chat';

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
  measurementId: "G-80TVEP6ZJZ"
};

function App() {

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getDatabase(app);
  const storage = getStorage(app);
  const [signIn, setSignIn] = useState(false);
  const [userId, setUserId] = useState(null)
  const [profilePic, setProfilePic] = useState(null)
  const [name, setName] = useState(null)
  const [about, setAbout] = useState(null)
  const [savedContacts, setSavedContacts] = useState([])
  const [contactsData, setContactsData] = useState([])
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  const showLoginError = (error) => {
    document.getElementById('loginpassword').style.border = '1.5px solid red'
    if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
      document.getElementById('showError').innerHTML = 'Wrong Password. Try again'
    } else {
      document.getElementById('showError').innerHTML = `Error: ${error.message}`
    }
    setTimeout(() => {
      document.getElementById('showError').innerHTML = '';
      document.getElementById('loginpassword').style.border = '1.5px solid grey'
    }, 6000);
  }

  const loginEmailPassword = async (event) => {
    event.preventDefault();
    const signinEmail = document.getElementById('loginemail').value
    const signinPassword = document.getElementById('loginpassword').value
    try {
      const userCredential = await signInWithEmailAndPassword(auth, signinEmail, signinPassword)
      console.log(userCredential.user)
      window.location.href = '/';
    } catch (error) {
      console.log(error);
      showLoginError(error);
    }
  }

  if (isButtonDisabled) {
    document.getElementById('submitbtn').style.background = 'grey'
    document.getElementById('submitbtn').style.cursor = 'no-drop'

  }

  const createAccount = async (event) => {
    event.preventDefault();
    setIsButtonDisabled(true)

    // Get form values
    const profileImg = document.getElementById('select-file').files[0];
    const signinName = document.getElementById('loginname').value;
    const about = document.getElementById('about').value;
    const signinEmail = document.getElementById('loginemail').value;
    const signinPassword = document.getElementById('loginpassword').value;

    try {
      if (!profileImg || !signinName || !signinEmail || !signinPassword) {
        throw new Error("Please fill in all required fields.");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, signinEmail, signinPassword);

      const metadata = { contentType: profileImg.type };
      const imgRef = storageRef(storage, `Profile Images/${userCredential.user.uid}/${profileImg.name}`);
      const downloadURL = await uploadBytesResumable(imgRef, profileImg, metadata).then(() => getDownloadURL(imgRef));

      await set(databaseRef(db, 'users/' + userCredential.user.uid), {
        name: signinName,
        about: about,
        profileImg: downloadURL,
        email: signinEmail,
        Id: userCredential.user.uid
      });

      console.log('User data successfully saved');
      window.location.href = '/';
    } catch (error) {
      setIsButtonDisabled(false)
      console.error(error);
      showLoginError(error.message || "An error occurred.");
    }
  };

  const monitorAuthState = async () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        handleAuthenticatedUser(user);
      } else {
        handleUnauthenticatedUser();
      }
    });
  };

  const handleAuthenticatedUser = async (user) => {
    setUserId(user.uid);
    setSignIn(true);

    try {
      const snapshot = await get(databaseRef(db, 'users/' + user.uid));
      const userVal = snapshot.val();

      if (userVal) {
        setProfilePic(userVal.profileImg);
        setName(userVal.name);
        setAbout(userVal.about);
        setSavedContacts(userVal.contacts.userId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnauthenticatedUser = () => {
    setUserId(null);
    setName(null);
    setSignIn(false);
    console.log('You are not logged in.');
  };

  useEffect(() => {
    monitorAuthState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const fetchedContacts = [];

        for (const userId of savedContacts) {
          const snapshot = await get(databaseRef(db, 'users/' + userId));
          if (snapshot.exists()) {
            const userData = snapshot.val();
            fetchedContacts.push(userData); // Add the user data to the array
          }
        }

        setContactsData(fetchedContacts); // Set the fetched contacts to the state
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    if (savedContacts.length > 0) {
      fetchContacts(); // Fetch contacts when savedContacts change
    }
  }, [db, savedContacts]);

  const logout = async () => {
    await signOut(auth);
    window.location.href = '/';
  }

  const addContact = async (event) => {
    event.preventDefault();
    const newContact = document.getElementById('addUserId').value;

    try {
      const snapshot = await get(databaseRef(db, 'users/' + newContact));
      if (snapshot.exists()) {
        console.log('Data exists at the specified path.');
        // Update the state with the new contact

        console.log(newContact); // Logging the new contact

        // Now update the database with the new contact list
        const updatedContacts = [...savedContacts, newContact]; // Use the updated savedContacts array
        set(databaseRef(db, 'users/' + userId + '/contacts'), {
          userId: updatedContacts
        });
        window.location.href = '/';

      } else {
        console.log('Data does not exist at the specified path.');
        document.getElementById('addUserId').style.border = '1.5px solid red'
        setTimeout(() => {
          document.getElementById('addUserId').style.border = '1.5px solid #404040'
        }, 3000);
      }
    } catch (error) {
      console.error('Error while checking data existence:', error);
    }
  };

  const sendMsg = async (receiverId, msg) => {
    set(databaseRef(db, `users/${userId}/messages/${receiverId}/${Date.now()}`), {
      message: msg,
      sentby: userId,
      timestamp: serverTimestamp() // You can still use serverTimestamp() here
    });

    set(databaseRef(db, `users/${receiverId}/messages/${userId}/${Date.now()}`), {
      message: msg,
      sentby: userId,
      timestamp: serverTimestamp()
    });
  };


  return (
    <Router>
      <Header signIn={signIn} logout={logout} profilePic={profilePic} />
      <Routes>
        <Route exact path="/" element={
          <div className='app'>
            {contactsData.length > 0 ?
              contactsData && contactsData.map((data, index) => (
                <React.Fragment key={index}>
                  <Link to={data.Id}><Contact profilePic={data.profileImg} name={data.name} about={data.about} /></Link>
                </React.Fragment>
              ))
              : <div style={{
                textAlign: 'center',
                fontSize: 'xx-large',
                margin: '29px 0'
              }}>
                <Link style={{color: '#4242d3'}} to={'/addUser'}>Add Contacts</Link> to view them here
              </div>
            }
          </div>
        } />
        <Route exact path="/signIn" element={
          <SignIn isButtonDisabled={isButtonDisabled} purpose={'Sign in'} account={loginEmailPassword} />
        } />
        <Route exact path="/signUp" element={
          <SignIn isButtonDisabled={isButtonDisabled} purpose={'Sign up'} account={createAccount} />
        } />
        <Route exact path="/addUser" element={
          <DialogueBox addContact={addContact} />
        } />
        <Route exact path="/sharecontact" element={
          <ShareContact userId={userId} />
        } />

        {contactsData && contactsData.map((data, index) => (
          <React.Fragment key={index}>
            <Route exact path={data.Id} element={
              <Chat db={db} senderId={userId} receiverId={data.Id} profilePic={data.profileImg} name={data.name} about={data.about} sendMsg={sendMsg} />
            } />
          </React.Fragment>
        ))}

      </Routes>
    </Router>
  );
}

export default App;
