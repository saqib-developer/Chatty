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

function App() {
  const [signIn, setSignIn] = useState(false);

  return (
    <Router>
      <Header signIn={signIn} />
      <Routes>
        <Route exact path="/" element={
          <div className='app'>
            {
              signIn ? <ContactsList /> : <span>Please Sign In to view your Contacts and Messages</span>
            }

          </div>
        } />
        <Route exact path="/signIn" element={
          <SignIn />
        } />
      </Routes>
    </Router>
  );
}

export default App;
