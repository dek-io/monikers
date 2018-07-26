import React, { Component } from 'react';
import Card from '../Card/Card';
import Round from '../Round/Round';
import Next from '../Next/Next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import indexedDB from '../../indexedBD';
import * as actions from '../../actions';
import {
  currentTeam,
  updateTeamTimer,
  currentRound
} from '../../actions/gameActions';

import './Play.css';

export class Play extends Component {
  constructor() {
    super();
    this.state = {
      clock: 'active'
    };
  }

  componentDidMount() {}

  handleGotIt = e => {
    e.preventDefault();

    if (this.props.currTeam === this.props.teamNames[0]) {
      this.props.teamOneScore(this.props.activeCards[0].pointValue);
    } else {
      this.props.teamTwoScore(this.props.activeCards[0].pointValue);
    }
    this.props.discardedCards(this.props.activeCards[0]);
    indexedDB.discardedCards.add(this.props.activeCards[0]);

    const newCards = this.props.activeCards.slice(1);
    this.props.updateActiveCards(newCards);
    indexedDB.activeCards.clear();
    indexedDB.activeCards.bulkAdd(newCards);

    if (this.props.activeCards.length === 1) {
      this.props.currentRound(1);
    }
  };

  handleSkipped = e => {
    e.preventDefault();

    const newCards = this.props.activeCards.slice(1);
    this.props.updateActiveCards(newCards);

    this.props.addCard(this.props.activeCards[0]);
  };

  render() {
    if (this.props.teamTimer === 'stopped') {
      return <Next />;
    } else if (this.props.teamTimer === 'pregame') {
      return <Round />;
    } else if (this.props.activeCards.length === 0) {
      return <Round />;
    } else {
      return (
        <div className="play">
          <div className="game-info-container">
            <h3 className="current-team">{this.props.currTeam}</h3>
            <h3 className="current-round">Round {this.props.currRound}</h3>
          </div>
          <div className="timer" />
          {this.props.activeCards.length && <Card />}
          <div className="buttons-container">
            <button
              className="pass-button ripple-pass"
              onClick={this.handleSkipped}
            >
              Pass
            </button>
            <button
              className="got-it-button ripple-got-it"
              onClick={this.handleGotIt}
            >
              Got It!
            </button>
          </div>
        </div>
      );
    }
  }
}

export const mapStateToProps = state => ({
  activeCards: state.activeCards,
  discardPile: state.discardPile,
  currTeam: state.currTeam,
  currRound: state.currRound,
  teamNames: state.teamNames,
  teamTimer: state.teamTimer
});

export const mapDispatchToProps = dispatch => ({
  updateActiveCards: cards => dispatch(actions.updateActiveCards(cards)),
  discardedCards: card => dispatch(actions.discardedCards(card)),
  addCard: card => dispatch(actions.addCard(card)),
  teamOneScore: points => dispatch(actions.teamOneScore(points)),
  teamTwoScore: points => dispatch(actions.teamTwoScore(points)),
  currentTeam: team => dispatch(currentTeam(team)),
  updateTeamTimer: timer => dispatch(updateTeamTimer(timer)),
  currentRound: roundNumber => dispatch(currentRound(roundNumber))
});

Play.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Play);
