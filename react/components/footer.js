import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <div className="content-block" id="footer">
        <div className="container">
          <div className="row">
              <div className="col-sm-4 blog-post">

                <h2 className="footer-block">Have a Question?</h2>
                <p>Sorry no Engrish. Sorry no Engrish. Sorry no Engrish. Sorry no Engrish. Sorry no Engrish. Sorry no Engrish.</p>

                <p>Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.
                </p>

                <p>Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.Sorry no Engrish.</p>
              </div>

              <div className="col-sm-4 blog-post">
                <h2 className="footer-block">Leave us a message</h2>
                <form action="contact-form.php" id="contactForm" method="post" name="contactform" className="" role="form">
                  <div className="form-group">
                      <input type="text" className="form-control form-control-white" id="name" name="name" placeholder="Your Name" required />
                    </div>
                    <div className="form-group">
                      <input type="email" className="form-control form-control-white" id="email" name="email" placeholder="Enter email" required />
                    </div>
                    <div className="form-group">
                      <textarea className="form-control form-control-white" id="message" name="massage" placeholder="Write Something" required></textarea>
                    </div>
                    <div id="contactFormResponse"></div>
                    <div className="form-group">
                      <input id="cfsubmit" type="submit" className="text-center btn btn-o-white" value="Say Hello" />
                    </div>
                </form>
              </div>

              <div className="col-sm-4 blog-post">

                <h2 className="footer-block">Contact Details</h2>
                <ul>
                  <li className="address-sub"><i className="fa fa-map-marker"></i>Office Address</li>
                    <p>
                      1 Infinity Loop. P.o Box 911 Mountain View. Cupertino. United States of America.
                    </p>
                  <li className="address-sub"><i className="fa fa-phone"></i>Phone</li>
                    <p>
                      Local: 1-800-123-hello<br />
                      Mobile: 1-800-123-hello
                    </p>
                  <li className="address-sub"><i className="fa fa-envelope-o"></i>Email Address</li>
                    <p>
                      <a href="mailto:info@mentormap.com">info@mentormap.com</a><br />
                      <a href="http://www.google.com/">www.mentormap.com</a>
                    </p>


                </ul>
                <div className="social">
                  <a href="#"><i className="fa fa-twitter"></i></a>
                  <a href="#"><i className="fa fa-facebook"></i></a>
                  <a href="#"><i className="fa fa-instagram"></i></a>
                  <a href="#"><i className="fa fa-pinterest-p"></i></a>
                  <a href="#"><i className="fa fa-google-plus"></i></a>
                  <a href="#"><i className="fa fa-skype"></i></a>
                </div>

              </div>
            </div>
        </div>
      </div>
    );
  }
}

export default Footer;
