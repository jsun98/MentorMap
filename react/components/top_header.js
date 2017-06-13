import React from 'react';
import Nav from './nav';
import NavTab from './nav_tab';

class BodyHeader extends React.Component {
  render () {
    return (
      <header className="top-header">
  			<div className="container">
  				<div className="row">


  					<div className="col-md-2 col-xs-5 col-sm-4 header-logo">
  						<a href="index.html">
  							<h1 className="logo">M<span className="logo-head">2</span></h1>
  						</a>
  					</div>

  					<div className="col-md-8 col-xs-7">
              <Nav />
  					</div>


            <div className="col-md-2 header-right">
              <ul className="nav navbar-nav">
                <NavTab target="#" tabClass="fa" tabVal="Sign In" />
                <NavTab target="#" tabClass="fa" tabVal="Sign Up" />
              </ul>
            </div>


  				</div>
  			</div>
  		</header>
    );
  }
}

export default BodyHeader;
