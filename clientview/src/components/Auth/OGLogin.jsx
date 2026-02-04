import React, { useState } from "react";
import LoginForm from "./LoginForm.jsx";
import SignupForm from "./SignupForm.jsx";
import "../styles/Login.css";

const Login = ({ onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className={`cont ${isSignup ? "s--signup" : ""}`}>
      <LoginForm onLoginSuccess={onLoginSuccess} />

      <div className="sub-cont">
        <div className="img">
          <div className="img__text m--up">
            <h3>Don't have an account? Please Sign up!</h3>
          </div>

          <div className="img__text m--in">
            <h3>If you already have an account, just sign in.</h3>
          </div>

          <div className="img__btn" onClick={() => setIsSignup(!isSignup)}>
            <span className="m--up">Sign Up</span>
            <span className="m--in">Sign In</span>
          </div>
        </div>

        <SignupForm />
      </div>
    </div>
  );
};

export default Login;
