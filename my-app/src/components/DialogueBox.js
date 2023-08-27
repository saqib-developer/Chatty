import React from 'react'
import './DialogueBox.css'
import { Link } from 'react-router-dom'

export default function DialogueBox(props) {
  try {

    if (props.addUserButtonDisabled) {
      document.getElementById('addUserIdOkbtn').style.background = 'grey';
      document.getElementById('addUserIdOkbtn').style.cursor = 'no-drop';
    } else {
      document.getElementById('addUserIdOkbtn').style.background = 'blue';
      document.getElementById('addUserIdOkbtn').style.cursor = 'pointer';
    }
  } catch (error) {
    console.error(error)
  }
  return (
    <div className='dialogueBox'>
      {props.signIn ?
        <form onSubmit={props.addContact} className="box">
          <input required placeholder='Enter the User Id' id='addUserId' type="text" /><br />
          <span id="error-display" className='error-display'> </span>
          <div>
            <button type='submit' id='addUserIdOkbtn' disabled={props.addUserButtonDisabled}>OK</button>
            <Link to={'/'}>Cancel</Link>
          </div>
        </form>
        :
        <div className='simple-watermark'>
          <span><Link style={{ color: '#4242d3' }} to={'/signIn'}>Sign In </Link>to Add new Contacts</span>
        </div>
      }
    </div>
  )
}