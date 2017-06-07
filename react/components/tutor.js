import React from 'react';

class Tutor extends React.Component {
  render() {
    return (

      <section id="portfolio-section" className="page bg-style1">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="portfolio">

                <div className="page-header-wrapper">
                  <div className="container">
                    <div className="page-header text-center wow fadeInDown" data-wow-delay="0.4s">
                      <h5>Our Tutors</h5>
                      <div className="devider" />
                      <h1>What we are proud of</h1>
                    </div>
                  </div>
                </div>

                <div className="portfoloi_content_area">

                  <div className="portfolio_menu" id="filters">
                    <ul>
                      <li className="active_prot_menu"><a href="#porfolio_menu" data-filter="*">all</a></li>
                      <li><a href="#porfolio_menu" data-filter=".websites">Subject 1</a></li>
                      <li><a href="#porfolio_menu" data-filter=".webDesign">Subject 2</a></li>
                      <li><a href="#porfolio_menu" data-filter=".appsDevelopment">Subject 3</a></li>
                      <li><a href="#porfolio_menu" data-filter=".GraphicDesign">Subject 4</a></li>
                    </ul>
                  </div>


                  <div className="portfolio_content">
                    <div className="row" id="portfolio">

                      <div className="col-xs-12 col-sm-4 appsDevelopment">
                        <div className="portfolio_single_content">
                          <img src="images/portfolio/p1.jpg" alt="title" />
                          <div>
                            <a href="#" className="btn btn-o-white">Skull Awesome</a>
                            <span></span>
                          </div>
                        </div>
                      </div>

                      <div className="col-xs-12 col-sm-4 GraphicDesign">
                        <div className="portfolio_single_content">
                          <img src="images/portfolio/p2.jpg" alt="title" />
                          <div>
                            <a href="#" className="btn btn-o-white">Photo Frame</a>
                            <span></span>
                          </div>
                        </div>
                      </div>

                      <div className="col-xs-12 col-sm-4 responsive">
                        <div className="portfolio_single_content">
                          <img src="images/portfolio/p3.jpg" alt="title" />
                          <div>
                            <a href="#" className="btn btn-o-white">Hand Shots</a>
                            <span></span>
                          </div>
                        </div>
                      </div>

                      <div className="col-xs-12 col-sm-4 webDesign websites">
                        <div className="portfolio_single_content">
                          <img src="images/portfolio/p4.jpg" alt="title" />
                          <div>
                            <a href="#" className="btn btn-o-white">Night Abstract</a>
                            <span></span>
                          </div>
                        </div>
                      </div>

                      <div className="col-xs-12 col-sm-4 appsDevelopment websites">
                        <div className="portfolio_single_content">
                          <img src="images/portfolio/p5.jpg" alt="title" />
                          <div>
                            <a href="#" className="btn btn-o-white">Joy of Independence</a>
                            <span></span>
                          </div>
                        </div>
                      </div>

                      <div className="col-xs-12 col-sm-4 GraphicDesign">
                        <div className="portfolio_single_content">
                          <img src="images/portfolio/p6.jpg" alt="title" />
                          <div>
                            <a href="#" className="btn btn-o-white">Night Crawlers</a>
                            <span></span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    );
  }
}

export default Tutor;
