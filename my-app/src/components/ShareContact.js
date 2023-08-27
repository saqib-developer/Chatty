import React from 'react';
// import QRCode from 'qrcode.react';
import './ShareContact.css'
import {Link} from 'react-router-dom'

export default function ShareContact(props) {
    console.log(props.userId)
    return (
        <div className='share-contact' >
            {props.signIn?
            <div className="box" title='Copy the Id and paste in the Add Contact page to add that contact'>
                <h2>Your Id</h2>
                <br />
                {/* <QRCode value={props.userId} /> */}
                <p>{props.userId}</p>
            </div>
            :
            <div className='simple-watermark'>
                  <span><Link style={{ color: '#4242d3' }} to={'/signIn'}>Sign In </Link>to Share your Contact</span>
                </div>
            }
        </div>
    )
}