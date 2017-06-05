import React from 'react';
import About from './about';
import Jumbotron from './jumbotron';
import Testimonials from './testimonials';
import Portfolio from './portfolio';
import Parallax from './parallax';
import Footer from './footer';
import CopyRight from './copyright';
import Process from './process'
import Features from './features'

class Wrapper extends React.Component {
  render() {
    return (
      <div id='wrapper'>
        <Jumbotron />
        <About />
        <Features />
        <Process />
        <Portfolio />
        <Testimonials />
        <Parallax />
        <Footer />
        <CopyRight />

      </div>
    );
  }
}

export default Wrapper;
