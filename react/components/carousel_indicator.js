import React from 'react';

class CarouselIndicator extends React.Component {
  render () {
    return (
      <li data-target={this.props.target} data-slide-to={this.props.slideTo} className={this.props.className}></li>
    );
  }
}

export default CarouselIndicator;
