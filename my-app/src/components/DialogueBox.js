import React from 'react'
import './DialogueBox.css'
import {Link} from 'react-router-dom'

export default function DialogueBox(props) {
  return (
    <div className='dialogueBox'>
      {props.signIn ?
        <form onSubmit={props.addContact} className="box">
          <input placeholder='Enter the User Id' id='addUserId' type="text" /><br />
          <div>
            <button type='submit' id='addUserIdOkbtn' disabled={props.addContactButtonDisabled}>OK</button>
            <button>Cancel</button>
          </div>
        </form>
        :
        <div className='simple-watermark'>
          <span><Link style={{ color: '#4242d3' }} to={'/signIn'}>Sign In </Link>to View your Contacts here</span>
        </div>
      }
    </div>
  )
}