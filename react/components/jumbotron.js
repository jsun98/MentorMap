import React from 'react';

class Jumbotron extends React.Component {
  render() {
    return (
      <div className="jumbotron jumbotron-fluid">
        <div className="container">
        	<div className="row">
            <div className="col-md-2"></div>
            <div className="col-md-8 intro-content">
              <p className="jumbo-lead">Hello, World!</p>
              <h1 className="jumbo-display-1">Our awesome app will make your life a lot easier.</h1>
              <p><a className="btn btn-primary btn-lg" href="#" role="button">Learn more &raquo;</a></p>
            </div>
            <div className="col-md-2"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Jumbotron;
