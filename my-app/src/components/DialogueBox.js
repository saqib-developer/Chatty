import React from 'react'
import './DialogueBox.css'

export default function DialogueBox(props) {
  return (
    <div className='dialogueBox'>
      <form onSubmit={props.addContact} className="box">
        <input placeholder='Enter the User Id' id='addUserId' type="text" /><br />
        <div>
          <button type='submit' id='addUserIdOkbtn'>OK</button>
          <button>Cancel</button>
        </div>
      </form>
    </div>
  )
}