import React from 'react';
import Carousel from './carousel';

class Testimonials extends React.Component {
  render () {
    return (
      <div className="content-block" id="testimonials">
        <div className="container testimonial-sec">

          <header className="block-heading cleafix">
            <div className="title-page  pull-left">
              <p className="main-header">Testimonial</p>
                <p className="sub-header">What our client says</p>
            </div>
          </header>

          <Carousel />
        </div>
      </div>
    );
  }
}

export default Testimonials;
