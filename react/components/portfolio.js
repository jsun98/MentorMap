import React from 'react';
import PortfolioItem from './portfolio_item';
import AboutItem from './about_item';

class Portfolio extends React.Component {
  render() {
    return (
      <div id="portfolio">
        <div className="container portfolio-sec">

        <header className="block-heading cleafix">
          <div className="row">
            <div className="col-md-3" />
            <div className="col-md-6" >
              <div className="title-page">
                <h5>Target Audience</h5>
                <h1>Who is MentorMap for?</h1>
                <p className="lead">Lorem ipsum Do commodo in proident enim in dolor cupidatat adipisicing dolore officia nisi aliqua incididunt Ut veniam lorem ipsum Consectetur ut in in eu do.</p>
              </div>
            </div>
            <div className="col-md-3" />
          </div>
        </header>


          <section className="block-body">

            <div className="row">

              <div className="col-sm-4">
                <a href="#" className="recent-work" style={{backgroundImage: 'url(images/rain_1-320x240.jpg)'}}>
                  <span className="btn btn-o-white">Lorem Rocks</span>
                </a>
              </div>

              <div className="col-sm-4">
                <a href="#" className="recent-work" style={{backgroundImage: 'url(images/min_icons_thumb1-320x240.jpg)'}}>
                  <span className="btn btn-o-white">Lorem Rocks</span>
                </a>
              </div>

              <div className="col-sm-4">
                <a href="#" className="recent-work" style={{backgroundImage: 'url(images/flat_icons_thumb.jpg)'}}>
                  <span className="btn btn-o-white">Lorem Rocks</span>
                </a>
              </div>

            </div>


            <div className="row">

              <PortfolioItem
                paragraph="Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish "
              />

              <PortfolioItem
                paragraph="Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish "
              />

              <PortfolioItem
                paragraph="Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish "
              />

            </div>

          </section>
        </div>
      </div>
    );
  }
}

export default Portfolio;
