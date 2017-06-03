import React from 'react';
import Jumbotron from './jumbotron';
import About from './about'
import Portfolio from './portfolio';

class Wrapper extends React.Component {
  render () {
    return (
      <div id="wrapper">
        <Jumbotron />
        <About />
        <Portfolio />
      </div>
    );
  }
}

export default Wrapper;
