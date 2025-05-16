import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '@fluentui/react';

function Success() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Success</h2>
      <p>Multi-factor authentication successful!</p>
      <PrimaryButton style={{ marginTop: '20px' }} onClick={handleLogout}>
        Log Out
      </PrimaryButton>
    </div>
  );
}

export default Success;
