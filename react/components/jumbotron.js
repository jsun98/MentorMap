import React from 'react';

class Jumbotron extends React.Component {
  render() {
    return (
      <div id="header" className="content-block">
				<section className="center">
          <div className="secondary-slogan">
            <h5>HELLO, WOLRD!</h5>
          </div>
					<div className="slogan">
					  Welcome To MentorMap.
					</div>
          <div className="secondary-slogan">
						CoolWordOne. CoolWordTwo. CoolWordThree.
					</div>
          <a className="button stroke smoothscroll" href="#" title="">Learn More</a>
				</section>
			</div>
    );
  }
}

export default Jumbotron;
