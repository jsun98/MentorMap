import React from 'react';
import PortfolioItem from './portfolio_item';
import AboutItem from './about_item';

class Portfolio extends React.Component {
  render() {
    return (
      <div className="content-block" id="portfolio">
        <div className="container portfolio-sec">

          <header className="block-heading cleafix">
            <a href="#" className="btn btn-o btn-lg pull-right">View All</a>
            <div className="title-page">
              <p className="main-header">Our Latest Examples </p>
              <p className="sub-header">Take a look at some of our recent comments</p>
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
