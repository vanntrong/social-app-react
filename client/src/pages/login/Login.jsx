import { useContext, useRef } from "react";
import { loginCall } from "../../api/index";
import { AuthContext } from "../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import "./login.css";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const handleSubmit = (event) => {
    event.preventDefault();
    loginCall({ email: emailRef.current.value, password: passwordRef.current.value }, dispatch);
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
            <input placeholder="Email" type="email" className="loginInput" ref={emailRef} required />
            <input
              placeholder="Password"
              type="password"
              className="loginInput"
              ref={passwordRef}
              required
              minLength={6}
            />
            <button className="loginButton" disabled={isFetching} type="submit">
              {isFetching ? <CircularProgress color="inherit" size="20px" /> : "Log In"}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton">
              {isFetching ? <CircularProgress color="inherit" size="20px" /> : "Create a New Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
