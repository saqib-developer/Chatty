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

    try {

        if (props.isButtonDisabled) {
            document.getElementById('submitbtn').style.background = 'grey';
            document.getElementById('submitbtn').style.cursor = 'no-drop';
        } else {
            document.getElementById('submitbtn').style.background = '#7dd9c2';
            document.getElementById('submitbtn').style.cursor = 'pointer';
        }
    } catch (error) {
        console.error(error)
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
                            <input required onChange={selectImage} type="file" accept='image/*' id='select-file' />
                            <span>
                                <b><label htmlFor="loginname">Name:</label></b>
                                <br />
                                <input id='loginname' required type="text" autoComplete='name' />
                            </span>
                            <br />
                            <span>
                                <b><label htmlFor="about">About:</label></b>
                                <br />
                                <input autoComplete='none' id='about' required type="text" />
                            </span>
                            <br />
                        </>
                }
                <span>

                    <b><label htmlFor="email">Email:</label></b>
                    <br />
                    <input id='loginemail' required autoComplete='username' type="email" />
                </span>
                <br />
                <span>
                    <b><label htmlFor="password">Password:</label></b>
                    <br />
                    <input id='loginpassword' required autoComplete='current-password' type="password" />
                </span>
                <span style={{ color: 'red' }} id="showError" className='error-display'></span>

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
