import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header(props) {
  return (
    <div className="header" id="header">
      {props.signIn ? (
        <button onClick={props.logout}>
          <span>Log out</span>
        </button>
      ) : (
        <Link to={"/signIn"}>
          <span>Sign In</span>
        </Link>
      )}
      <a href="/">
        <img src="img/logo/chatty-logo-nobg-round.jpg" alt="" />
      </a>
    </div>
  );
}
