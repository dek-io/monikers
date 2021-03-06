import React from 'react';
import { NavLink } from 'react-router-dom';
import logolockup from '../../assets/Monikers_logo_lockup-02.svg';
import './SplashPage.css';

const SplashPage = () => {
  return (
    <div className="background-furry">
      <div className="splash-page">
        <img
          className="logo-lockup animated bounceIn"
          src={logolockup}
          alt="logolockup"
        />
        <div className="button-wrapper">
          <button className="start-game-button">
            <NavLink className="navlink" to="/setup">
              NEW GAME
            </NavLink>
          </button>
          <button className="instructions-button">
            <NavLink className="navlink" to="/instructions">
              HOW TO PLAY
            </NavLink>
          </button>
          <button className="buy-button">
            <a className="navlink" href="http://www.monikersgame.com/">
              BUY THE GAME
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
