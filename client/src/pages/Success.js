import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '@fluentui/react';
import '../App.css'; // Import the CSS file

function Success() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="glass-card">
      <h2>Success</h2>
      <p>Multi-factor authentication successful!</p>
      <PrimaryButton style={{ marginTop: '20px' }} onClick={handleLogout}>
        Log Out
      </PrimaryButton>
    </div>
  );
}

export default Success;
