import React, { useState } from "react";

const API = "http://localhost:4000/api/auth";

const LoginForm = ({ onLoginSuccess }) => {
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);

  // login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // forgot
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* ---------------- LOGIN ---------------- */

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

  if (!res.ok) return alert(data.message);

  // ✅ SAVE LOGIN STATE
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  onLoginSuccess(data.user);
};

  /* ---------------- FORGOT PASSWORD ---------------- */

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

  return (
    <div className="form sign-in">
      <h2>Welcome</h2>

      {/* 🔐 NORMAL LOGIN */}
      {!showForgot && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginUser();
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

          <button className="submit">Sign In</button>
        </form>
      )}

      {/* 🔁 FORGOT STEP 1 */}
      {showForgot && forgotStep === 1 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            requestForgotOtp();
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

          <button className="submit">Next</button>
        </form>
      )}

      {/* 🔢 FORGOT STEP 2 (OTP) */}
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
                maxLength="1"
                className="otp-input"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/, "");
                  if (!value) return;

                  const otpArr = forgotOtp.padEnd(4, "").split("");
                  otpArr[i] = value;
                  setForgotOtp(otpArr.join(""));

                  const next = e.target.nextElementSibling;
                  if (next) next.focus();
                }}
              />
            ))}
          </div>

          <button className="submit">Verify OTP</button>
        </form>
      )}

      {/* 🔑 FORGOT STEP 3 */}
      {showForgot && forgotStep === 3 && (
        <>
          <label>
            <span>New Password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>

          <label>
            <span>Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>

          <button className="submit" onClick={resetPassword}>
            Save
          </button>
        </>
      )}

      {/* ✅ FORGOT STEP 4 */}
      {showForgot && forgotStep === 4 && (
        <div className="success-step">
          <h3>Password Updated</h3>
          <p>Your password has been reset successfully.</p>

          <button
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
  );
};

export default LoginForm;
