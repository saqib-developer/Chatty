import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

export default function Header(props) {
  return (
    <div className="header">
      <img className='chatty-logo' src="img/logo/chatty-logo-nobg-round.jpg" alt="" />
      <div className='per-logo-container'>
        <button>Add User</button>
        <button>Share</button>
        {props.signIn ? <span><button onClick={props.logout}>Log out</button></span> : <Link to={'/signIn'}>Sign In</Link>}
        <img className='per-logo' src="img/saqib.jpg" alt="" />
      </div>

      <div className='anim'></div>
    </div>
  )
}