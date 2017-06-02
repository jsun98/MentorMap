import React from 'react';
import AboutItem from './about_item';

class About extends React.Component {
  render() {
    return (
      <div id="about" className="about-us">
        <div className="container about-sec">
          <header className="block-heading cleafix">
            <div className="title-page">
              <p className="main-header">About us</p>
              <p className="sub-header">Make sure you know about us</p>
            </div>
          </header>
          <div className="divide50"></div>
          <div className="row">
            <AboutItem
              title="Great Benefits"
              paragraph="Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish "
            />
            <AboutItem
              title="Very Cheap"
              paragraph="Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish"
            />
            <AboutItem
              title="Delicious Food"
              paragraph="Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default About;
