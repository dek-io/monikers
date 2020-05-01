import React, { Component } from 'react';
import PropTypes from 'prop-types';
import indexedDB from '../../indexedBD';
import { connect } from 'react-redux';
import { Card } from '../Card/Card';
import * as actions from '../../actions';
import './Setup.css';
import logo from '../../assets/Monikers_logo_lockup-02.svg';

class CardPicker extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.numPlayers);

    this.state = {
      cards: [],
      currCards: [],
      selected: [],
      playersChosen: 0
    };
  }
  async getPickableCards() {
    return (await indexedDB.allCards.toArray()).slice(0, 5);
  }
  shuffleCurrentCards() {
    const lowerBound = 1;
    const upperBound = this.state.cards.length;
    const uniqueRandomNumbers = [];

    while (uniqueRandomNumbers.length < 10) {
      const randomNumber = Math.floor(
        Math.random() * (upperBound - lowerBound) + lowerBound
      );

      if (uniqueRandomNumbers.indexOf(randomNumber) === -1) {
        uniqueRandomNumbers.push(randomNumber);
      }
    }
    this.setState({ currCards: uniqueRandomNumbers });
  }
  async componentDidMount() {
    this.setState({ cards: await indexedDB.allCards.toArray() }, function () {
      this.shuffleCurrentCards();
    })
  }
  handleClick = i => {
    const selectedI = this.state.selected.indexOf(i);
    if (selectedI >= 0) {
      this.state.selected.splice(selectedI, 1);
      this.setState({ selected: this.state.selected });
    } else if (this.state.selected.length < 5)
      this.setState({ selected: [...this.state.selected, i] });
    else
      alert('Already chosen 5 cards!');
  }
  handleSubmit = () => {
    if (this.state.selected.length < 5) {
      alert('Choose 5 cards!');
      return;
    }
    this.state.selected.forEach(i => {
      this.props.addCard(this.state.cards[i]);
      this.state.cards.splice(i, 1);
    });
    this.setState({ cards: this.state.cards });
    this.setState({ selected: [] });
    this.setState({ playersChosen: this.state.playersChosen + 1 }, function () {
      console.log(this.state.playersChosen.toString() + '/' + this.props.numPlayers.toString())
      if (this.state.playersChosen < this.props.numPlayers)
        this.shuffleCurrentCards();
      else
        this.props.history.push('/play');
    });
  }
  render() {
    return [
      this.state.currCards.map(i =>
        <Card
          key={i}
          card={this.state.cards[i]}
          onClick={() => this.handleClick(i)}
          className={this.state.selected.includes(i) ? '' : 'unselected'}
        />),
      <button className="start-button" onClick={this.handleSubmit}>
        {this.state.playersChosen + 1 < this.props.numPlayers ? 'NEXT' : 'PLAY'}
      </button>
    ]
  }
}

export class Setup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teamOne: '',
      teamTwo: '',
      cardSelectionType: 'auto',
      numPlayers: -1,
      numCards: -1,
      pickingCards: false
    };
  }

  getActiveCards = async numberOfCards => {
    const { addCard } = this.props;
    const numberOfCardsInIDB = await indexedDB.allCards.count();
    const lowerBound = 1;
    const upperBound = numberOfCardsInIDB;
    const uniqueRandomNumbers = [];

    while (uniqueRandomNumbers.length < numberOfCards) {
      const randomNumber = Math.floor(
        Math.random() * (upperBound - lowerBound) + lowerBound
      );

      if (uniqueRandomNumbers.indexOf(randomNumber) === -1) {
        uniqueRandomNumbers.push(randomNumber);
      }
    }
    const allCards = await indexedDB.allCards.toArray();
    uniqueRandomNumbers.forEach(num => {
      addCard(allCards[num]);
    });
  };

  handleChange = e => {
    const { value, name } = e.target;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { teamOne, teamTwo, numCards, cardSelectionType, numPlayers } = this.state;

    if (!(teamOne && teamTwo))
      return;

    if (cardSelectionType === 'manual' && numPlayers >= 2) {
      await this.storeGameInfo(teamOne, teamTwo, numPlayers * 5);
      this.setState({ pickingCards: true });
    }

    if (cardSelectionType === 'auto' && numCards >= 30) {
      await this.storeGameInfo(teamOne, teamTwo, numCards);
      this.getActiveCards(numCards);
      this.props.history.push('/play');
    }
  };

  storeGameInfo = async (teamOne, teamTwo, numCards) => {
    const { addTeamNames, numOfCards, currentTeam } = this.props;

    addTeamNames(teamOne);
    addTeamNames(teamTwo);
    numOfCards(parseInt(numCards, 10));
    currentTeam(teamOne);
  };

  handleBackButton = e => {
    e.preventDefault();
    this.props.history.push('/');
  };

  render() {
    return (
      this.state.pickingCards ?
        <div className="play">
          <CardPicker addCard={this.props.addCard} numPlayers={this.state.numPlayers} history={this.props.history} />
        </div>
        :
        <div className="wrapper">
          <img className="logo" src={logo} alt="Monikers logo" />
          <h2 className="game-setup-headline">Game Setup</h2>
          <form action="" onSubmit={this.handleSubmit}>
            <h3 className="label-name">Team One</h3>
            <input
              autoComplete="off"
              className="input-field"
              type="text"
              name="teamOne"
              placeholder="Enter team name"
              onChange={this.handleChange}
            />
            <h3 className="label-name">Team Two</h3>
            <input
              autoComplete="off"
              className="input-field"
              type="text"
              name="teamTwo"
              placeholder="Enter team name"
              onChange={this.handleChange}
            />
            <h3 className="label-name">Card selection</h3>
            <select
              className="input-field"
              name="cardSelectionType"
              onChange={this.handleChange}
            >
              <option value="auto">Auto</option>
              <option value="manual">Manual</option>
            </select>
            {
              this.state.cardSelectionType === 'auto' ?
                [
                  <h3 className="label-name">Number of Cards</h3>,
                  <input
                    className="input-field"
                    type="number"
                    min="30"
                    max="60"
                    placeholder="Enter number 30-60"
                    name="numCards"
                    onChange={this.handleChange}
                  />
                ] :
                [
                  <h3 className="label-name">Number of Players</h3>,
                  <input
                    className="input-field"
                    type="number"
                    min="2"
                    max="12"
                    placeholder="Enter number 2-12"
                    name="numPlayers"
                    onChange={this.handleChange}
                  />
                ]
            }
            <button className="start-button" type="submit">
              START GAME
          </button>
            <button
              className="back-button"
              type="submit"
              onClick={this.handleBackButton}
            >
              BACK
          </button>
          </form>
        </div>
    );
  }
}

export const mapStateToProps = state => ({
  teamNames: state.teamNames,
  numCards: state.numCards
});

export const mapDispatchToProps = dispatch => ({
  numOfCards: number => dispatch(actions.numOfCards(number)),
  currentTeam: team => dispatch(actions.currentTeam(team)),
  addCard: card => dispatch(actions.addCard(card)),
  addTeamNames: teamName => dispatch(actions.addTeamNames(teamName))
});

Setup.propTypes = {
  teamNames: PropTypes.array.isRequired,
  numCards: PropTypes.number.isRequired,
  getTeamNames: PropTypes.func.isRequired,
  numOfCards: PropTypes.func.isRequired,
  currentTeam: PropTypes.func.isRequired,
  addCard: PropTypes.func.isRequired,
  addTeamNames: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Setup);
