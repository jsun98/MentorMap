import React from 'react';

class CopyRight extends React.Component {
  render() {
    return (
      <div className="content-block footer-bottom" id="footer">
        <div className="container">
          <div className="row">
            <div className="col-xs-6">&copy; Copyright MentorMap 2017</div>
            <div className="col-xs-6 text-right">Design by <a href="https://github.com/jsun98/MentorMap" target="_blink">Joshua Sun, Bill Qi</a></div>
          </div>
        </div>
      </div>
    );
  }
}

export default CopyRight;
