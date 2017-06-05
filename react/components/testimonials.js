import React from 'react';
import Carousel from './carousel';

class Testimonials extends React.Component {
  render () {
    return (
      <div className="content-block" id="testimonials">
        <div className="container testimonial-sec">

          <header className="block-heading cleafix">
            <div className="row">
              <div className="col-md-1" />
              <div className="col-md-10" >
                <div className="title-page">
                  <h5>Testimonials</h5>
                  <h1>See what our customers have to say</h1>
                  <p className="lead">Lorem ipsum Do commodo in proident enim in dolor cupidatat adipisicing dolore officia nisi aliqua incididunt Ut veniam lorem ipsum Consectetur ut in in eu do.</p>
                </div>
              </div>
              <div className="col-md-1" />
            </div>
          </header>

          <Carousel />
        </div>
      </div>
    );
  }
}

export default Testimonials;
