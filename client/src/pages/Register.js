import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpUri, setOtpUri] = useState('');

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:5000/register', { email, password });
      setOtpUri(res.data.otp_uri);
    } catch (err) {
      alert(err.response.data.error || "Registration failed");
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
    </div>
  );
};

export default Register;
