import React from 'react';
import About from './about';
import Jumbotron from './jumbotron';
import Testimonials from './testimonials';
import Portfolio from './portfolio';

class Wrapper extends React.Component {
  render() {
    return (
      <div id='wrapper'>
        <Jumbotron />
        <About />
        <Portfolio />
        <Testimonials />
      </div>
    );
  }
}

export default Wrapper;
