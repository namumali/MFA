import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

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
      <h2>Register</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>

      {otpUri && (
        <div>
          <h4>Scan QR with Google Authenticator</h4>
          <QRCodeSVG value={otpUri} />
        </div>
      )}

      {showOtpInput && (
        <div style={{ marginTop: '20px' }}>
          <h4>Enter OTP from Google Authenticator</h4>
          <input placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} />
          <button onClick={handleOtpVerify}>Verify OTP</button>
        </div>
      )}

      {/* Existing user login option */}
      <p style={{ marginTop: '30px' }}>
        Already have an account?{' '}
        <button onClick={() => navigate('/login')} style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;
