// import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '@fluentui/react';
import '../App.css'; // Import the CSS file
//import {useWindowSize} from '@react-hook/window-size'

import Confetti from 'react-confetti'

function Success() {
  const navigate = useNavigate();
  //const { width, height } = useWindowSize()
  const handleLogout = () => {
    navigate('/login');
  };

  return (
  <>
    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
      recycle={false} // Stop recycling confetti
      numberOfPieces={200}
      run={true}
      confettiSource={{ x: 0, y: 0, w: window.innerWidth, h: 0 }}
      initialVelocityY={10}
      gravity={0.3}
      tweenDuration={3000} // Set duration to 3 seconds
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
