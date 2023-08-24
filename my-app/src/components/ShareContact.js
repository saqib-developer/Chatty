import React from 'react';
import QRCode from 'qrcode.react';
import './ShareContact.css'

export default function ShareContact(props) {
    console.log(props.userId)
    return (
        <div className='shareContact'>
            <div className="qr-container">
                <h2>Scan the QR code</h2>
                <QRCode value={props.userId} />
                <p>Your Id: {props.userId}</p>
            </div>
        </div>
    )
}