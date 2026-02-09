import React, { useState } from "react";
import "../styles/Login.css";
const API = "https://gas-agency-service.onrender.com/api/auth";

const Login = (onLoginSuccess) => {
  const [isSignup, setIsSignup] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  /* ---------------- Login ---------------- */

  const loginUser = async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Login successful");
  };

  const requestForgotOtp = async () => {
    const res = await fetch(`${API}/forgot/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setForgotStep(2);
  };

  const resetPassword = async () => {
    const res = await fetch(`${API}/forgot/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: forgotEmail,
        password: newPassword,
        confirmPassword,
      }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setForgotStep(4);
  };

  /* ---------------- SIGN UP ---------------- */

  const requestSignupOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/signup/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message); // show backend error
        return;
      }

      // ✅ Backend said OK → move to OTP page
      setSignupStep(2);
    } catch (err) {
      alert("Server error");
    }
  };

  const verifySignupOtp = async () => {
    try {
      const res = await fetch(`${API}/signup/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupData.email,
          otp: signupData.otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // ✅ OTP verified → move to password step
      setSignupStep(3);
    } catch (err) {
      alert("Server error");
    }
  };

  const saveSignupPassword = async () => {
    try {
      const res = await fetch(`${API}/signup/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
          confirmPassword: signupData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // ✅ Account created
      setSignupStep(4);
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className={`cont ${isSignup ? "s--signup" : ""}`}>
      {/* SIGN IN */}
      <div className="form sign-in">
        <h2>Welcome</h2>

        {/* STEP 0: NORMAL LOGIN */}
        {!showForgot && (
          <form
            onSubmit={(e) => {
              e.preventDefault(); // prevent page reload
              loginUser(); // call your existing login logic
            }}
          >
            <label>
              <span>Email</span>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </label>

            <p
              className="forgot-pass"
              onClick={() => {
                setShowForgot(true);
                setForgotStep(1);
              }}
            >
              Forgot password?
            </p>

            <button type="submit" className="submit">
              Sign In
            </button>
          </form>
        )}
        {/* STEP 1: ENTER EMAIL */}
        {showForgot && forgotStep === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault(); // prevent page reload
              requestForgotOtp();
              setForgotStep(2); // move to next step
            }}
          >
            <h3>Reset Password</h3>

            <label>
              <span>Email</span>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </label>

            <button type="submit" className="submit">
              Next
            </button>
          </form>
        )}

        {/* STEP 2: OTP */}
        {showForgot && forgotStep === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setForgotStep(3);
            }}
          >
            <p className="otp-text">Enter 4-digit OTP</p>

            <div className="otp-inputs">
              {[0, 1, 2, 3].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength="1"
                  className="otp-input"
                  inputMode="numeric"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/, "");
                    if (!value) return;

                    const otpArr = forgotOtp.padEnd(4, "").split("");
                    otpArr[i] = value;
                    setForgotOtp(otpArr.join(""));

                    const next = e.target.nextElementSibling;
                    if (next) next.focus();
                  }}
                  required
                />
              ))}
            </div>

            <button type="submit" className="submit">
              Verify OTP
            </button>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {showForgot && forgotStep === 3 && (
          <>
            <label>
              <span>New Password</span>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>

            <label>
              <span>Confirm Password</span>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>

            <button
              type="button"
              className="submit"
              onClick={resetPassword} // ✅ backend call
            >
              Save
            </button>
          </>
        )}

        {/* STEP 4: SUCCESS */}
        {showForgot && forgotStep === 4 && (
          <div className="success-step">
            <h3>Password Updated</h3>
            <p>Your password has been reset successfully.</p>

            <button
              type="button"
              className="submit"
              onClick={() => {
                setShowForgot(false);
                setForgotStep(1);
                setForgotEmail("");
                setForgotOtp("");
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
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

        {/* SIGN UP */}
        <div className="form sign-up">
          <h2>Create your Account</h2>

          {/* STEP 1: NAME + EMAIL */}
          {signupStep === 1 && (
            <form onSubmit={requestSignupOtp}>
              <div>
                <label>
                  <span>Name</span>
                  <input
                    required
                    value={signupData.name}
                    onChange={(e) =>
                      setSignupData({ ...signupData, name: e.target.value })
                    }
                  />
                </label>

                <label>
                  <span>Email</span>
                  <input
                    required
                    type="email"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                  />
                </label>
                <button className="submit" type="submit">
                  Next
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: OTP */}
          {signupStep === 2 && (
            <div className="otp-step">
              <p className="otp-text">Enter 4-digit OTP</p>

              <div className="otp-inputs">
                {[0, 1, 2, 3].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="otp-input"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!value) return;

                      const otpArr = signupData.otp.padEnd(4, "").split("");
                      otpArr[index] = value;
                      setSignupData({ ...signupData, otp: otpArr.join("") });

                      // ✅ SIMPLE auto-focus (no refs)
                      const next = e.target.nextElementSibling;
                      if (next) next.focus();
                    }}
                  />
                ))}
              </div>

              <button className="submit" onClick={verifySignupOtp}>
                Verify OTP
              </button>
            </div>
          )}

          {/* STEP 3: PASSWORD */}
          {signupStep === 3 && (
            <div>
              <label>
                <span>Password</span>
                <input
                  type="password"
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                />
              </label>

              <label>
                <span>Confirm Password</span>
                <input
                  type="password"
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </label>
              <button className="submit" onClick={saveSignupPassword}>
                Save
              </button>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {signupStep === 4 && (
            <div className="success-step">
              <h3>🎉 Congratulations!</h3>
              <p>Your account has been created successfully.</p>
              <button
                type="button"
                className="submit"
                onClick={() => setIsSignup(!isSignup)}
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;