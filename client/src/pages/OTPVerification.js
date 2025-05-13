import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const email = localStorage.getItem('email');
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:5000/verify', { email, otp });
      if (res.data.message === 'Login successful') {
        navigate('/success');
      }
    } catch (err) {
      alert(err.response?.data?.error || "OTP verification failed");
    }
  };

  return (
    <div>
      <h2>Enter OTP from Google Authenticator</h2>
      <input placeholder="6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} />
      <button onClick={handleVerify}>Verify OTP</button>
    </div>
  );
};

export default OTPVerification;
