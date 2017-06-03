import React from 'react';

class CarouselItem extends React.Component {
  render () {
    return (
      <div className={this.props.class}>
          <div className="img-center">
            <img className="img-circle circular-img" src={this.props.src} />
          </div>
          <h3>
            {this.props.text}
          </h3>

      </div>
    );
  }
}

export default CarouselItem;
