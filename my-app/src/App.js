import React, { useState, useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
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
  set
} from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytesResumable
} from "firebase/storage";
import DialogueBox from './components/DialogueBox';
import Contact from './components/Contact';

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
  const [signIn, setSignIn] = useState(false);

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getDatabase(app);
  const storage = getStorage(app);
  const [userId, setUserId] = useState(null)
  const [name, setName] = useState(null)
  const [savedContacts, setSavedContacts] = useState([])
  const [contactsData, setContactsData] = useState([])

  console.log(contactsData)
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

  const createAccount = async (event) => {
    event.preventDefault();
    const signinName = document.getElementById('loginname').value
    const signinEmail = document.getElementById('loginemail').value
    const signinPassword = document.getElementById('loginpassword').value
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signinEmail, signinPassword)
      set(databaseRef(db, 'users/' + userCredential.user.uid), {
        name: signinName,
        email: signinEmail
      })
        .then(() => {
          console.log('User data successfully saved')
        })
        .catch((error) => {
          console.log('error: ' + error)
        });

      window.location.href = '/';
    } catch (error) {
      console.log(error);
      showLoginError(error);
    }
  }
  const monitorAuthState = async () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid)
        setSignIn(true);
        console.log('hellow')
        get(databaseRef(db, 'users/' + user.uid)).then((snapshot) => {
          setName(snapshot.val().name)
          setSavedContacts(snapshot.val().contacts.userId)
        }).catch((error) => {
          console.error(error);
        });

      } else {
        setUserId(null)
        setName(null)
        setSignIn(false)

        console.log('You are not Logged in.')
      }
    })
  }

  useEffect(() => {
    monitorAuthState();
  }, []); // Empty dependency array ensures this effect runs once when the component mounts

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
  }, [db, savedContacts]); // Empty dependency array ensures this effect runs once when the component mounts

  const logout = async () => {
    await signOut(auth);
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


  return (
    <Router>
      <Header signIn={signIn} logout={logout} />
      <Routes>
        <Route exact path="/" element={
          <div className='app'>
            {contactsData && contactsData.map((data, index) => (
                <React.Fragment key={index}>
                  <Contact name={data.name} />
                </React.Fragment>
              ))}

          </div>
        } />
        <Route exact path="/signIn" element={
          <SignIn purpose={'Sign in'} account={loginEmailPassword} />
        } />
        <Route exact path="/signUp" element={
          <SignIn purpose={'Sign up'} account={createAccount} />
        } />
        <Route exact path="/addUser" element={
          <DialogueBox addContact={addContact} />
        } />
      </Routes>
    </Router>
  );
}

export default App;
