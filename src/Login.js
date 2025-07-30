import React, { useState } from "react";
import "./styles.css";

function Login({ onLoginSuccess, setUserEmail }) {
  const [step, setStep] = useState(1); // 1: enter email, 2: enter OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUserEmail(email);
        setStep(2);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess(data.token || "", email);
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={step === 1 ? handleEmailSubmit : handleOtpSubmit}>
        <h2 className="login-title">Sign In</h2>
        {step === 1 && (
          <>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="login-input"
            />
            <button type="submit" className="login-btn" disabled={loading || !/^\S+@\S+\.\S+$/.test(email)}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength={6}
              required
              className="login-input"
            />
            <button type="submit" className="login-btn" disabled={loading || otp.length !== 6}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button type="button" className="login-link" onClick={() => setStep(1)} disabled={loading}>
              Change Email
            </button>
          </>
        )}
        {error && <div className="login-error">{error}</div>}
      </form>
    </div>
  );
}

export default Login;
