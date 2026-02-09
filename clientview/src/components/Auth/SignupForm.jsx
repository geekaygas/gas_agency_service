import React, { useState } from "react";

const API = "https://gas-agency-service.onrender.com/api/auth";

const SignupForm = () => {
  const [signupStep, setSignupStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(300); // seconds
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  // STEP 1: REQUEST OTP
  const requestSignupOtp = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch(`${API}/signup/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
        }),
      });

      // const data = await res.json();

      // if (!res.ok) {
      //   alert(data.message || "Error sending OTP");
      //   return;
      // }
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 200) {
          alert("OTP already sent. Please wait 5 minutes.");
        } else {
          alert(data.message || "Error sending OTP");
        }
        return;
      }

      setSignupStep(2);
      setOtpCooldown(300);

      const timer = setInterval(() => {
        setOtpCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      alert("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: VERIFY OTP
  const verifySignupOtp = async () => {
    if (loading) return;

    setLoading(true);
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
        alert(data.message || "Invalid OTP");
        return;
      }

      setSignupStep(3);
    } catch (err) {
      alert("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: SAVE PASSWORD
  const saveSignupPassword = async () => {
    if (loading) return;

    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/signup/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error saving password");
        return;
      }

      setSignupStep(4);
    } catch (err) {
      alert("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form sign-up">
      <h2>Create your Account</h2>

      {/* STEP 1 */}
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

          <button className="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Next"}
          </button>
          <p>
            Resend OTP in {Math.floor(otpCooldown / 60)}:
            {(otpCooldown % 60).toString().padStart(2, "0")}
          </p>
        </form>
      )}

      {/* STEP 2 */}
      {signupStep === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            value={signupData.otp}
            onChange={(e) =>
              setSignupData({ ...signupData, otp: e.target.value })
            }
          />
          <button
            className="submit"
            onClick={verifySignupOtp}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {/* STEP 3 */}
      {signupStep === 3 && (
        <>
          <input
            type="password"
            placeholder="Password"
            value={signupData.password}
            onChange={(e) =>
              setSignupData({ ...signupData, password: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={signupData.confirmPassword}
            onChange={(e) =>
              setSignupData({
                ...signupData,
                confirmPassword: e.target.value,
              })
            }
          />
          <button
            className="submit"
            onClick={saveSignupPassword}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </>
      )}

      {/* STEP 4 */}
      {signupStep === 4 && <h3>🎉 Account Created</h3>}
    </div>
  );
};

export default SignupForm;

// import React, { useState } from "react";

// const API = "https://gas-agency-service.onrender.com/api/auth";

// const SignupForm = () => {
//   const [signupStep, setSignupStep] = useState(1);
//   const [signupData, setSignupData] = useState({
//     name: "",
//     email: "",
//     otp: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const requestSignupOtp = async (e) => {
//     e.preventDefault();
//     const res = await fetch(`${API}/signup/request-otp`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name: signupData.name,
//         email: signupData.email,
//       }),
//     });

//     if (!res.ok) return alert("Error sending OTP");
//     setSignupStep(2);
//   };

//   const verifySignupOtp = async () => {
//     const res = await fetch(`${API}/signup/verify-otp`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email: signupData.email,
//         otp: signupData.otp,
//       }),
//     });

//     if (!res.ok) return alert("Invalid OTP");
//     setSignupStep(3);
//   };

//   const saveSignupPassword = async () => {
//     const res = await fetch(`${API}/signup/set-password`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(signupData),
//     });

//     if (!res.ok) return alert("Error");
//     setSignupStep(4);
//   };

//   return (
//     <div className="form sign-up">
//       <h2>Create your Account</h2>

//       {signupStep === 1 && (
//         <form onSubmit={requestSignupOtp}>
//           <label>
//             <span>Name</span>
//             <input
//               required
//               value={signupData.name}
//               onChange={(e) =>
//                 setSignupData({ ...signupData, name: e.target.value })
//               }
//             />
//           </label>

//           <label>
//             <span>Email</span>
//             <input
//               required
//               type="email"
//               value={signupData.email}
//               onChange={(e) =>
//                 setSignupData({ ...signupData, email: e.target.value })
//               }
//             />
//           </label>

//           <button className="submit">Next</button>
//         </form>
//       )}

//       {signupStep === 2 && (
//         <>
//           <input
//             placeholder="OTP"
//             onChange={(e) =>
//               setSignupData({ ...signupData, otp: e.target.value })
//             }
//           />
//           <button className="submit" onClick={verifySignupOtp}>
//             Verify OTP
//           </button>
//         </>
//       )}

//       {signupStep === 3 && (
//         <>
//           <input
//             type="password"
//             placeholder="Password"
//             onChange={(e) =>
//               setSignupData({ ...signupData, password: e.target.value })
//             }
//           />
//           <input
//             type="password"
//             placeholder="Confirm Password"
//             onChange={(e) =>
//               setSignupData({
//                 ...signupData,
//                 confirmPassword: e.target.value,
//               })
//             }
//           />
//           <button className="submit" onClick={saveSignupPassword}>
//             Save
//           </button>
//         </>
//       )}

//       {signupStep === 4 && <h3>🎉 Account Created</h3>}
//     </div>
//   );
// };

// export default SignupForm;
