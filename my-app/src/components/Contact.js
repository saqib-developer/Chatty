import React from 'react'
import './Contact.css'

export default function Contact(props) {
  return (
    <div className='contact'>
      <img src={props.profilePic} alt='' />
      <div className="contact-detail">
        <span className='name-text'>{props.name}</span>
        <br />
        <span className='about-text'>{props.about}</span>
        <hr />
      </div>
    </div>
  )
}
