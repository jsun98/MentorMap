import React from 'react';
import Jumbotron from './jumbotron';
import About from './about'
import Testimonials from './testimonials'

class Wrapper extends React.Component {
  render () {
    return (
      <div id="wrapper">
        <Jumbotron />
        <About />



        <Testimonials /> //this is one of the later sections
      </div>
    );
  }
}

export default Wrapper;
