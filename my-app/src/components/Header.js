import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

export default function Header(props) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [show, setShow] = useState(false)

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const showOptions = () => {
    if (show) {
      setShow(false)
    } else {
      setShow(true)
    }
  }

  // if (screenWidth < 600) { setShow(false) }

  return (
    <div className="header" id='header'>
      <div className="header-container">
        <button className='chatty-logo-container' onClick={() => { window.location.href = '/'; }}>
          <img src="img/logo/chatty-logo-nobg-round.jpg" alt="" />
        </button>
        <div className='header-link-container'>
          {screenWidth > 600 ?
            <>
              <Link to={'/addUser'}><span>Add Contact</span></Link>
              <Link to={'/sharecontact'}><span>Share your<br />Contact</span></Link>
              {props.signIn ?
                <button style={{ color: 'red', borderColor: 'red' }} onClick={props.logout}><span>Log out</span></button>
                :
                <Link style={{ color: '#26ff57', borderColor: '#26ff57' }} to={'/signIn'}><span>Sign In</span ></Link>
              }
              <div className="per-logo">
                {props.signIn && props.profilePic ?
                  <img src={props.profilePic} alt="" style={{ cursor: 'pointer' }} title={`Name: ${props.name}\nAbout: ${props.about}`} />
                  :
                  <img src="img/default-profile-img.png" alt="" />}
              </div>
            </>
            :
            <div className="per-logo">
              {props.signIn && props.profilePic ?
                <button onClick={showOptions}>
                  <img src={props.profilePic} alt="" style={{ cursor: 'pointer' }} title={`Name: ${props.name}\nAbout: ${props.about}`} />
                </button>
                :
                <button onClick={showOptions}>
                  <img src="img/default-profile-img.png" alt="" />
                </button>
              }
            </div>
          }
        </div>
      </div>
      {show ?
        <div className='header-link-container' style={{ margin: '16px 0px 21px 0' }}>
          <Link to={'/addUser'}><span>Add Contact</span></Link>
          <Link to={'/sharecontact'}><span>Share your<br />Contact</span></Link>
          {props.signIn ?
            <button style={{ color: 'red', borderColor: 'red' }} onClick={props.logout}><span>Log out</span></button>
            :
            <Link style={{ color: '#26ff57', borderColor: '#26ff57' }} to={'/signIn'}><span>Sign In</span ></Link>
          }
        </div>
        :
        <></>
      }

      <div className='anim'></div>
    </div>
  )
}