import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, PrimaryButton } from '@fluentui/react';

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
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>OTP Verification</h2>
      <TextField label="Enter OTP" required value={otp} onChange={(_, newValue) => setOtp(newValue)} />
      <PrimaryButton style={{ marginTop: '20px' }} onClick={handleVerify}>Verify</PrimaryButton>
    </div>
  );
};

export default OTPVerification;
