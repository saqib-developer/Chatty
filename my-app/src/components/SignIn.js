import React from 'react'
import './SignIn.css'
import { Link } from "react-router-dom";

export default function SignIn(props) {
    return (
        <form onSubmit={props.account} id='login'>
            <div className="signin">
                <h1>{props.purpose}</h1>

                {
                    props.purpose === 'Sign in' ?
                        <></>
                        :
                        <>
                            <b><label htmlFor="name">Name:</label></b>
                            <input id='loginname' required type="text" />
                            <br />
                        </>
                }

                <b><label htmlFor="email">Email:</label></b>
                <input id='loginemail' required autoComplete='username' type="email" />
                <br />

                <b><label htmlFor="password">Password:</label></b>
                <input id='loginpassword' required autoComplete='current-password' type="password" />

                <span style={{ color: 'red' }} id="showError"></span>

                <button type='submit'>Continue</button>
            </div>
            {
                props.purpose === 'Sign in' ?
                    <Link className='create-button' to="/signup">Create your Chatty account</Link> :
                    <Link className='create-button' to="/signin">Already have an account! Sign in</Link>
            }
        </form>
    )
}
