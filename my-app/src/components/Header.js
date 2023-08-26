import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

export default function Header(props) {
  return (
    <div className="header">
      <button className='chatty-logo-container' onClick={() => { window.location.href = '/'; }}>
        <img src="img/logo/chatty-logo-nobg-round.jpg" alt="" />
      </button>
      <div className='header-link-container'>
        <Link to={'/editdetails'}><span>Edit your<br />Details</span></Link>
        <Link to={'/addUser'}><span>Add Contact</span></Link>
        <Link to={'/sharecontact'}><span>Share your<br />Contact</span></Link>
        {props.signIn ? <button style={{ color: 'red', borderColor: 'red' }} onClick={props.logout}><span>Log out</span></button> : <Link to={'/signIn'}><span>Sign In</span ></Link>}
        <div className="per-logo">
          {props.signIn && props.profilePic ?
            <img
              src={props.profilePic}
              alt=""
              style={{cursor: 'pointer'}}
              title={`Name: ${props.name}\nAbout: ${props.about}`}
            />
            :
            <img src="img/default-profile-img.png" alt="" />}
        </div>
      </div>

      <div className='anim'></div>
    </div>
  )
}