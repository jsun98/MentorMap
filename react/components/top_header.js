import React from 'react';
import Nav from './nav';

class BodyHeader extends React.Component {
  render () {
    return (
      <header className="top-header">
  			<div className="container">
  				<div className="row">
  					<div className="col-md-1 col-xs-5 col-sm-4 header-logo">
  						<br />
  						<a href="index.html">
  							<h1 className="logo">M<span className="logo-head">2</span></h1>
  						</a>
  					</div>

  					<div className="col-md-10 col-xs-7">
              <Nav />
  					</div>
            <div className="col-md-1"></div>
  				</div>
  			</div>
  		</header>
    );
  }
}

export default BodyHeader;
