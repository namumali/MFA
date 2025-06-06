import React, { useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { TextField, PrimaryButton } from "@fluentui/react";
import "../App.css"; // Import the CSS file

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpUri, setOtpUri] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/register", {
        email,
        password,
      });
      setOtpUri(res.data.otp_uri);
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };


const handleConfirmScan = async () => {
  try {
    const res = await axios.post('http://127.0.0.1:5000/confirm-scan', { email });
    alert(res.data.message || "QR code scanned successfully");
    navigate("/login"); 
  } catch (err) {
    alert(err.response?.data?.error || "Failed to confirm QR code scan");
  }
};
  return (
    <div className="glass-card">
      <h2>Sign Up</h2>
      <TextField
        label="Email"
        required
        value={email}
        onChange={(_, newValue) => setEmail(newValue)}
      />
      <TextField
        label="Password"
        type="password"
        required
        value={password}
        onChange={(_, newValue) => setPassword(newValue)}
      />
      <TextField label="Confirm Password" type="password" required />
      <PrimaryButton style={{ marginTop: "20px" }} onClick={handleRegister}>
        Sign Up
      </PrimaryButton>

      {otpUri && (
        <div>
          <h4>Scan QR with Google Authenticator</h4>
          <QRCodeSVG value={otpUri} />
          <PrimaryButton
            style={{ marginTop: "10px" }}
            onClick={handleConfirmScan}
          >
            Confirm QR Scan
          </PrimaryButton>
        </div>
      )}

      <p style={{ marginTop: "20px" }}>
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          style={{
            color: "blue",
            textDecoration: "underline",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;
