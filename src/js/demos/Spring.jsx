import React from 'react';
import d3Array from 'd3-array';
import SpringGrid from '../components/SpringGrid';
import pinterestLayout from '../layouts/pinterest';
import { enter, exit } from '../enter-exit-styles/newspaper';

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

export default React.createClass({

  getDefaultProps() {
    return {
      minItems: 10
    };
  },

  getInitialState() {
    return {
      data: this.generateData()
    };
  },

  handleShuffle() {
    this.setState({
      data: this.generateData()
    });
  },

  generateData() {
    return d3Array.shuffle(alphabet)
      .slice(0, this.props.minItems +
        Math.floor(Math.random() * (26 - this.props.minItems)))
      .sort()
      .map(letter => {
        return {
          letter,
          number: Math.floor(Math.random() * 100)
        };
      });
  },

  render() {
    const itemWidth = 150;

    const items = this.state.data.map(d => {
      const height = (d.letter.charCodeAt(0) % 3) * 75 + 75;

      return (
        <li
          className="grid-item"
          style={{ height, width: itemWidth }}
          key={d.letter}
          itemRect={{ height }}
        >
          <h3>{d.letter.toUpperCase()} - {parseInt(d.number, 10)}</h3>
        </li>
      );
    });

    return (
      <div>
        <button
          onClick={this.handleShuffle}
        >Randomize</button>
        <SpringGrid
          className="grid"
          component="ul"
          columns={4}
          columnWidth={itemWidth}
          gutterWidth={5}
          gutterHeight={5}
          layout={pinterestLayout}
          enter={enter}
          exit={exit}
          // springConfig={{ stiffness: 60, damping: 9, precision: 0.1 }}
        >
          {items}
        </SpringGrid>
      </div>
    );
  }
});