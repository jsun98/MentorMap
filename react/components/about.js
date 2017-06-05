import React from 'react';
import AboutItem from './about_item';

class About extends React.Component {
  render() {
    return (
      <div id="about">
        <div className="container about-sec">
          <header className="block-heading cleafix">
            <div className="row">
              <div className="col-md-1" />
              <div className="col-md-10" >
              <div className="title-page">
                <h5>About</h5>
                <h1>What is MentorMap?</h1>
                <p className="lead">Lorem ipsum Do commodo in proident enim in dolor cupidatat adipisicing dolore officia nisi aliqua incididunt Ut veniam lorem ipsum Consectetur ut in in eu do.</p>
              </div>
              </div>
              <div className="col-md-1" />
            </div>
          </header>

          <div className="divide50"></div>

          <div className="row">
            <AboutItem
              title="Who we are"
              paragraph="Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish "
            />
            <AboutItem
              title="What we do"
              paragraph="Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish"
            />
            <AboutItem
              title="Who you are"
              paragraph="Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default About;
