import React from 'react';

class Feature extends React.Component {
  render () {
    return (
      <div className="feature">

          <span className="icon"><i className={this.props.iconType}></i></span>

            <div className="service-content">

               <h3 className="h05">{this.props.title}</h3>

              <p>
                {this.props.text}
              </p>

          </div>

      </div>
    );
  }
}

export default Feature;
