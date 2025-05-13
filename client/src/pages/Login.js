import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    localStorage.setItem('email', email);
    navigate('/verify');
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={handleContinue}>Continue to OTP</button>
    </div>
  );
};

export default Login;
