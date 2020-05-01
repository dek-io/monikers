import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export class Card extends Component {
  render() {
    const { card } = this.props;
    let pointColor;
    let categoryColor;

    if (card.pointValue === 1) {
      pointColor = { backgroundColor: 'rgba(76, 189, 159, 1)' };
      categoryColor = { color: 'rgba(76, 189, 159, 1)' };
    } else if (card.pointValue === 2) {
      pointColor = { backgroundColor: '#00B4EF' };
      categoryColor = { color: '#00B4EF' };
    } else if (card.pointValue === 3) {
      pointColor = { backgroundColor: '#866AAD' };
      categoryColor = { color: '#866AAD' };
    } else if (card.pointValue === 4) {
      pointColor = { backgroundColor: 'rgba(239, 83, 63, 1)' };
      categoryColor = { color: 'rgba(239, 83, 63, 1)' };
    }

    return (
      <div className={"card-container animated slideInRight " + this.props.className} onClick={this.props.onClick}>
        <h1 className="card-title">{card.name}</h1>
        <p className="description">{card.description}</p>
        <div className="dashed-line" />
        <h3 className="category" style={categoryColor}>
          {card.category}
        </h3>
        <div className="circle" style={pointColor}>
          <h1 className="points">{card.pointValue}</h1>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  card: state.activeCards[0]
});

Card.propTypes = {
  activeCards: PropTypes.array
};

export default connect(mapStateToProps)(Card);
