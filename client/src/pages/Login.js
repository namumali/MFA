import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, PrimaryButton } from '@fluentui/react';
import '../App.css'; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const handlePasswordVerify = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:5000/login', { email, password });
      if (res.data.message === 'Password matched') {
        setIsVerified(true); // Show OTP input now
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
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
      <h2>Login</h2>
      <TextField label="Email" required value={email} onChange={(_, newValue) => setEmail(newValue)} />
      <TextField label="Password" type="password" required value={password} onChange={(_, newValue) => setPassword(newValue)} />
      <PrimaryButton style={{ marginTop: '20px' }} onClick={handlePasswordVerify}>Continue</PrimaryButton>

      {isVerified && (
        <div style={{ marginTop: '20px' }}>
          <h4>Enter OTP from Google Authenticator</h4>
          <TextField label="Enter 6-digit OTP" value={otp} onChange={(_, newValue) => setOtp(newValue)} />
          <PrimaryButton onClick={handleOtpVerify} style={{ marginTop: '12px', padding: '8px 16px' }}>Verify OTP</PrimaryButton>
        </div>
      )}

      <p style={{ marginTop: '30px' }}>
        If you haven't registered already,{' '}
        <button onClick={() => navigate('/')} style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
