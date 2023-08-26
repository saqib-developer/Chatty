import React, { useState } from 'react'
import './SignIn.css'
import { Link } from "react-router-dom";

export default function SignIn(props) {
    const [imgSrc, setImgSrc] = useState()

    const selectImage = (event) => {

        const file = event.target.files[0];
        const reader = new FileReader();
        if (file) {
            reader.onload = (event) => {
                setImgSrc(event.target.result);
            };

            reader.readAsDataURL(file);
        }
    }
    return (
        <form onSubmit={props.account} id='login'>
            <div className="signin">
                <h1>{props.purpose}</h1>

                {
                    props.purpose === 'Sign in' ?
                        <></>
                        :
                        <>
                            <label htmlFor="select-file" className='file'>
                                {imgSrc ? <img src={imgSrc} alt="" /> : <img src="img/default-profile-img.png" alt="" />}
                            </label>
                            <input onChange={selectImage} type="file" accept='image/*' id='select-file' />
                            <b><label htmlFor="loginname">Name:</label></b>
                            <input id='loginname' required type="text" />
                            <br />
                            <b><label htmlFor="about">About:</label></b>
                            <input id='about' required type="text" />
                            <br />
                        </>
                }

                <b><label htmlFor="email">Email:</label></b>
                <input id='loginemail' required autoComplete='username' type="email" />
                <br />

                <b><label htmlFor="password">Password:</label></b>
                <input id='loginpassword' required autoComplete='current-password' type="password" />

                <span style={{ color: 'red' }} id="showError"></span>

                <button id='submitbtn' disabled={props.isButtonDisabled} type='submit'>Continue</button>
            </div>
            {
                props.purpose === 'Sign in' ?
                    <Link className='create-button' to="/signup">Create your Chatty account</Link> :
                    <Link className='create-button' to="/signin">Already have an account! Sign in</Link>
            }
        </form>
    )
}
