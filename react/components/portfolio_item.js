import React from 'react';

class PortfolioItem extends React.Component {
  render() {
    return (
      <div className="col-md-4 text-center">
          <div className="aboutus-item">
              <p className="aboutus-desc">
                {this.props.paragraph}
              </p>
          </div>
      </div>
    );
  }
}

export default PortfolioItem;
