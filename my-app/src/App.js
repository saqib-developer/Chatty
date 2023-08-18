import ContactsList from './components/ContactsList';
import { useState } from 'react';
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
  const [userUid, setUserUid] = useState(null)
  const monitorAuthState = async () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUserUid(user.uid)
        // console.log(user)
        setSignIn(true);
        get(databaseRef(db, 'users/' + user.uid)).then((snapshot) => {
        }).catch((error) => {

          console.error(error);
        });
      } else {
        setUserUid(null)
        setSignIn(false);

        console.log('You are not Logged in.')
      }
    })
  }
  monitorAuthState();

  const logout = async () => {
    await signOut(auth);
  }

  return (
    <Router>
      <Header signIn={signIn} logout={logout} />
      <Routes>
        <Route exact path="/" element={
          <div className='app'>
            {
              signIn ? <ContactsList /> : <span>Please Sign In to view your Contacts and Messages</span>
            }

          </div>
        } />
        <Route exact path="/signIn" element={
          <SignIn purpose={'Sign in'} account={loginEmailPassword} />
        } />
        <Route exact path="/signUp" element={
          <SignIn purpose={'Sign up'} account={createAccount} />
        } />
      </Routes>
    </Router>
  );
}

export default App;
