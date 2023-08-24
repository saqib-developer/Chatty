import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

export default function Header(props) {
  return (
    <div className="header">
      <img className='chatty-logo' src="img/logo/chatty-logo-nobg-round.jpg" alt="" />
      <div className='per-logo-container'>
        <Link to={'/addUser'}>Add Contact</Link>
        <button>Share</button>
        {props.signIn ? <span><button onClick={props.logout}>Log out</button></span> : <Link to={'/signIn'}>Sign In</Link>}
        {props.signIn && props.profilePic ? <img className='per-logo' src={props.profilePic} alt="" /> : <img className='per-logo' src="img/default-profile-img.png" alt="" />}
      </div>

      <div className='anim'></div>
    </div>
  )
}