import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../shared";

import "./register.css";

export default function Register() {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordAgainRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (passwordAgainRef.current.value !== passwordRef.current.value) {
      passwordAgainRef.current.setCustomValidity("Passwords do not match");
    } else {
      const user = {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      try {
        await axios.post(`${apiUrl}auth/register`, user);
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">SocialApp</h3>
          <span className="loginDesc">Connect with friends and the world around you on SocialApp.</span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleSubmit}>
            <input placeholder="Username" className="loginInput" ref={usernameRef} required />
            <input placeholder="Email" className="loginInput" ref={emailRef} required type="email" />
            <input
              placeholder="Password"
              className="loginInput"
              ref={passwordRef}
              required
              type="password"
              minLength={6}
            />
            <input
              placeholder="Password Again"
              className="loginInput"
              ref={passwordAgainRef}
              required
              type="password"
              minLength={6}
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <button className="loginRegisterButton">Log into Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}
