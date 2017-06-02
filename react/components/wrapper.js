import React from 'react';
import Jumbotron from './jumbotron';
import About from './about'

class Wrapper extends React.Component {
  render () {
    return (
      <div id="wrapper">
        <Jumbotron />
        <About />
      </div>
    );
  }
}

export default Wrapper;
