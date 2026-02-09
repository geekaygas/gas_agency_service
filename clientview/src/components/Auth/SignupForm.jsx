import React, { useState } from "react";

const API = "https://gas-agency-service.onrender.com/api/auth";

const SignupForm = () => {
  const [signupStep, setSignupStep] = useState(1);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const requestSignupOtp = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/signup/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: signupData.name,
        email: signupData.email,
      }),
    });

    if (!res.ok) return alert("Error sending OTP");
    setSignupStep(2);
  };

  const verifySignupOtp = async () => {
    const res = await fetch(`${API}/signup/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: signupData.email,
        otp: signupData.otp,
      }),
    });

    if (!res.ok) return alert("Invalid OTP");
    setSignupStep(3);
  };

  const saveSignupPassword = async () => {
    const res = await fetch(`${API}/signup/set-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupData),
    });

    if (!res.ok) return alert("Error");
    setSignupStep(4);
  };

  return (
    <div className="form sign-up">
      <h2>Create your Account</h2>

      {signupStep === 1 && (
        <form onSubmit={requestSignupOtp}>
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

          <button className="submit">Next</button>
        </form>
      )}

      {signupStep === 2 && (
        <>
          <input
            placeholder="OTP"
            onChange={(e) =>
              setSignupData({ ...signupData, otp: e.target.value })
            }
          />
          <button className="submit" onClick={verifySignupOtp}>
            Verify OTP
          </button>
        </>
      )}

      {signupStep === 3 && (
        <>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setSignupData({ ...signupData, password: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) =>
              setSignupData({
                ...signupData,
                confirmPassword: e.target.value,
              })
            }
          />
          <button className="submit" onClick={saveSignupPassword}>
            Save
          </button>
        </>
      )}

      {signupStep === 4 && <h3>🎉 Account Created</h3>}
    </div>
  );
};

export default SignupForm;
