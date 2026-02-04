const API = "http://localhost:4000/api/auth";

export const loginUser = (email, password) =>
  fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

export const requestForgotOtp = (email) =>
  fetch(`${API}/forgot/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

export const resetPassword = (email, password, confirmPassword) =>
  fetch(`${API}/forgot/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, confirmPassword }),
  });

export const requestSignupOtp = (name, email) =>
  fetch(`${API}/signup/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
