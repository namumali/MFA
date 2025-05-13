import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handlePasswordVerify}>Continue</button>

      {isVerified && (
        <div style={{ marginTop: '20px' }}>
          <h4>Enter OTP from Google Authenticator</h4>
          <input placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} />
          <button onClick={handleOtpVerify}>Verify OTP</button>
        </div>
      )}
    </div>
  );
};

export default Login;
