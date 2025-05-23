import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { TextField, PrimaryButton } from '@fluentui/react';
import '../App.css'; // Import the CSS file

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpUri, setOtpUri] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:5000/register', { email, password });
      setOtpUri(res.data.otp_uri);
      setShowOtpInput(true);
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  const handleOtpVerify = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:5000/verify-otp', { email, otp });
      if (res.data.message === 'Login successful') {
        navigate('/success');
      }
    } catch (err) {
      alert(err.response?.data?.error || "OTP verification failed");
    }
  };

  return (
    <div className="glass-card">
      <h2>Sign Up</h2>
      <TextField label="Email" required value={email} onChange={(_, newValue) => setEmail(newValue)} />
      <TextField label="Password" type="password" required value={password} onChange={(_, newValue) => setPassword(newValue)} />
      <TextField label="Confirm Password" type="password" required />
      <PrimaryButton style={{ marginTop: '20px' }} onClick={handleRegister}>Sign Up</PrimaryButton>

      {otpUri && (
        <div>
          <h4>Scan QR with Google Authenticator</h4>
          <QRCodeSVG value={otpUri} />
        </div>
      )}

      {showOtpInput && (
        <div style={{ marginTop: '16px' }}>
          <h4>Enter OTP from Google Authenticator</h4>
          <TextField placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} />
          <PrimaryButton onClick={handleOtpVerify}style={{ marginTop: '10px', padding: '8px 16px' }}>Verify OTP</PrimaryButton>
        </div>
      )}

      <p style={{ marginTop: '20px' }}>
        Already have an account?{' '}
        <button onClick={() => navigate('/login')} style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;
