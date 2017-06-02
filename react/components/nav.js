import React from 'react';
import NavTab from './nav_tab'

class Nav extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-default">
          <div className="container-fluid nav-bar">
            <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
            </div>

            <div className="collapse navbar-collapse navbar-def" id="bs-example-navbar-collapse-1">
              <div className="centerNav">
                <ul className="nav navbar-nav">
                  <NavTab target="#wrapper" tabClass="fa fa-home" tabVal="Home" />
                  <NavTab target="#portfolio" tabClass="fa fa-bookmark" tabVal="Portfolio" />
                  <NavTab target="#about" tabClass="fa fa-bookmark" tabVal="About" />
                  <NavTab target="#services" tabClass="fa fa-tasks" tabVal="Service" />
                  <NavTab target="#blog" tabClass="fa fa-wordpress" tabVal="Blog" />
                  <NavTab target="#testimonials" tabClass="fa fa-thumbs-up" tabVal="Testimonial" />
                </ul>
              </div>
            </div>
          </div>
      </nav>
    );
  }
}

export default Nav;
