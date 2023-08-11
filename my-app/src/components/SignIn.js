import React from 'react'
import './SignIn.css'

export default function SignIn() {
    const signIn = (event) => {
        event.preventDefault();
        console.log(document.getElementById('phoneNo').value)
    }
    return (
        <div className="form-container centercenter">
            <form onSubmit={signIn} className='signIn'>
                <label htmlFor="Phone Number">Phone Number</label>
                <input required pattern='^[0-9\+]+$' type="tel" name="phoneNo" id="phoneNo" placeholder='+92 ----------' />
                <button id='sign-in-button' type="submit">Sign In</button>
            </form>
        </div>
    )
}
