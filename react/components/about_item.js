import React from 'react';

class AboutItem extends React.Component {
  render () {
    return (
      <div className="col-md-4 text-center">
          <div className="aboutus-item">
              <i className="aboutus-icon fa fa-plane"></i>
              <h4 className="aboutus-title">{this.props.title}</h4>
              <p className="aboutus-desc">
                {this.props.paragraph}
              </p>
          </div>
      </div>
    );
  }
}

export default AboutItem;
