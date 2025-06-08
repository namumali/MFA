// import React from 'react';
import React, { Component } from "react";
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '@fluentui/react';
import '../App.css'; //
import Confetti from 'react-confetti'


class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerVal: null,
      computerVal: null,
      playerScore: 0,
      compScore: 0,
    };
  }

  logic = (playerVal, computerVal) => {
    if (playerVal === computerVal) {
      return 0;
    } else if (
      (playerVal === "ROCK" && computerVal === "SCISSORS") ||
      (playerVal === "SCISSORS" && computerVal === "PAPER") ||
      (playerVal === "PAPER" && computerVal === "ROCK")
    ) {
      return 1;
    } else {
      return -1;
    }
  };

  decision = (playerChoice) => {
    const choices = ["ROCK", "PAPER", "SCISSORS"];
    const compChoice = choices[Math.floor(Math.random() * choices.length)];
    const val = this.logic(playerChoice, compChoice);
    if (val === 1) {
      this.setState({
        playerVal: playerChoice,
        computerVal: compChoice,
        playerScore: this.state.playerScore + 1,
      });
    } else if (val === -1) {
      this.setState({
        playerVal: playerChoice,
        computerVal: compChoice,
        compScore: this.state.compScore + 1,
      });
    } else {
      this.setState({
        computerVal: compChoice,
        playerVal: playerChoice,
      });
    }
  };

  render() {
    const { playerVal, computerVal, playerScore, compScore } = this.state;
    return (
      <div className="container">
        <h1>You can now play</h1>
        <h2>Rock, Paper, Scissors</h2>
        <div>
          <PrimaryButton onClick={() => this.decision("ROCK")}>Rock</PrimaryButton>
          <PrimaryButton onClick={() => this.decision("PAPER")}>Paper</PrimaryButton>
          <PrimaryButton onClick={() => this.decision("SCISSORS")}>Scissors</PrimaryButton>
        </div>
        <div className="content">
          <p>Your choice: {playerVal}</p>
          <p>Computer's choice: {computerVal}</p>
          <h2>Your Score: {playerScore}</h2>
          <h2>Computer Score: {compScore}</h2>
        </div>
      </div>
    );
  }
}

function Success() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false} // Stopped recycling confetti
        numberOfPieces={200}
        run={true}
        confettiSource={{ x: 0, y: 0, w: window.innerWidth, h: 0 }}
        initialVelocityY={10}
        gravity={0.3}
        tweenDuration={2500} 
      />
      <div className="glass-card">
        <h2>Success</h2>
        <p>Multi-factor authentication successful!</p>
        <div className="game-container">
          <Game />
        </div>
        <PrimaryButton style={{ marginTop: '20px' }} onClick={handleLogout}>
          Log Out
        </PrimaryButton>
      </div>
    </>
  );
}

export default Success;
