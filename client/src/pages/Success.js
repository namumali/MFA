// import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '@fluentui/react';
import '../App.css'; // Import the CSS file
import {
  useWindowSize,
} from '@react-hook/window-size'

import Confetti from 'react-confetti'

function Success() {
  const navigate = useNavigate();
  const { width, height } = useWindowSize()
  const handleLogout = () => {
    navigate('/login');
  };

  return (
  <>
    <Confetti
      width={width}
      height={height}
    />
    <div className="glass-card">

      <h2>Success</h2>
      <p>Multi-factor authentication successful!</p>
      <PrimaryButton style={{ marginTop: '20px' }} onClick={handleLogout}>
        Log Out
      </PrimaryButton>
    </div>
  </>

  );
}

export default Success;
