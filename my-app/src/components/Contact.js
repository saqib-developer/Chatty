import React from 'react'
import './Contact.css'

export default function Contact(props) {
  return (
    <div className='contact'>
      <img src={props.contact.profilePic} alt='' />
      <div className="contact-detail">
        <span className='name-text'>{props.contact.name}</span>
        <br />
        <span className='about-text'>{props.contact.about}</span>
        <hr />
      </div>
    </div>
  )
}
