import React from 'react';
import { TransitionMotion, spring } from 'react-motion';
import stripStyle from 'react-motion/lib/stripStyle';
import { buildTransform, positionToProperties } from '../utils/transformHelpers';
import isEqual from 'lodash.isequal';
import simpleLayout from '../layouts/simple';
import * as simpleEnterExit from '../enter-exit-styles/simple';

export default React.createClass({

  propTypes: {
    columns: React.PropTypes.number.isRequired,
    columnWidth: React.PropTypes.number.isRequired,
    gutterWidth: React.PropTypes.number.isRequired,
    gutterHeight: React.PropTypes.number.isRequired,
    springConfig: React.PropTypes.object,
    component: React.PropTypes.string,
    layout: React.PropTypes.func,
    enter: React.PropTypes.func,
    entered: React.PropTypes.func,
    exit: React.PropTypes.func,
    perspective: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      springConfig: { stiffness: 60, damping: 14, precision: 0.1 },
      component: 'div',
      layout: simpleLayout,
      enter: simpleEnterExit.enter,
      entered: simpleEnterExit.entered,
      exit: simpleEnterExit.exit
    };
  },

  componentWillMount() {
    this.setState(this.doLayout(this.props));
  },

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps, this.props)) {
      this.setState(this.doLayout(nextProps));
    }
  },

  doLayout(props) {
    const items = React.Children.toArray(props.children)
      .map(element => ({
        key: element.key,
        data: {
          element
        }
      }));

    const { positions, gridWidth, gridHeight } =
      props.layout(items.map(item => item.data.element.props), props);

    const styles = positions.map((position, i) => ({
      ...items[i],
      style: {
        ...items[i].style,
        zIndex: 2,
        ...springify(this.props.entered(items[i].data.element.props,
          this.props, { gridWidth, gridHeight }), props.springConfig),
        ...springify(positionToProperties(position), props.springConfig)
      }
    }));

    return { styles, gridWidth, gridHeight };
  },

  willEnter(transitionStyle) {
    const { gridWidth, gridHeight } = this.state;

    return {
      ...stripStyle(transitionStyle.style),
      zIndex: 1,
      ...this.props.enter(transitionStyle.data.element.props,
        this.props, { gridWidth, gridHeight })
    };
  },

  willLeave(transitionStyle) {
    const { gridWidth, gridHeight } = this.state;
    const exitStyle = this.props.exit(transitionStyle.data.element.props,
      this.props, { gridWidth, gridHeight });

    return {
      ...transitionStyle.style,
      zIndex: 0,
      ...springify(exitStyle, this.props.springConfig)
    };
  },

  render() {
    const { component, style, perspective, ...rest } = this.props;

    return (
      <TransitionMotion
        styles={this.state.styles}
        willEnter={this.willEnter}
        willLeave={this.willLeave}
      >
        {interpolatedStyles =>
          React.createElement(component, {
            style: {
              position: 'relative',
              ...style,
              width: this.state.gridWidth,
              height: this.state.gridHeight
            },
            ...rest
          }, interpolatedStyles.map(config => {
            const { style: { opacity, zIndex }, data } = config;

            const transform = buildTransform(config.style, perspective);

            return React.cloneElement(data.element, {
              style: {
                ...data.element.props.style,
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex,
                opacity,
                transform
              }
            });
          }))}
      </TransitionMotion>
    );
  }

});

function springify(style, springConfig) {
  return Object.keys(style).reduce((obj, key) => {
    obj[key] = spring(style[key], springConfig);
    return obj;
  }, {});
}
