import React from 'react';

class Process extends React.Component {
  render () {
    return (
      <section id="process">

        <header className="block-heading cleafix">
          <div className="row">
            <div className="col-md-3" />
            <div className="col-md-6" >
              <div className="title-page">
                <h5>Process</h5>
                <h1>How does it Work?</h1>
                <p className="lead">Lorem ipsum Do commodo in proident enim in dolor cupidatat adipisicing dolore officia nisi aliqua incididunt Ut veniam lorem ipsum Consectetur ut in in eu do.</p>
              </div>
            </div>
            <div className="col-md-3" />
          </div>
        </header>


      	<div className="row process-content">

      		<div className="left-side">

      			<div className="item" data-item="1">

      				<h5>Sign Up</h5>

      				<p>Lorem ipsum Cupidatat nostrud non cupidatat ut dolor id eiusmod non minim aute consectetur incididunt tempor irure aute consequat quis voluptate.</p>

      			</div>

      			<div className="item" data-item="2">

   	   			<h5>Upload</h5>

   	   			<p>Lorem ipsum Cupidatat nostrud non cupidatat ut dolor id eiusmod non minim aute consectetur incididunt tempor irure aute consequat quis voluptate.</p>

      			</div>

      		</div>

      		<div className="right-side">

      			<div className="item" data-item="3">

      				<h5>Create</h5>

      				<p>Lorem ipsum Cupidatat nostrud non cupidatat ut dolor id eiusmod non minim aute consectetur incididunt tempor irure aute consequat quis voluptate.</p>

      			</div>

      			<div className="item" data-item="4">

      				<h5>Publish</h5>

      				<p>Lorem ipsum Cupidatat nostrud non cupidatat ut dolor id eiusmod non minim aute consectetur incididunt tempor irure aute consequat quis voluptate.</p>

      			</div>

      		</div>

      		<div className="image-part"></div>

      	</div>

      </section>
    );
  }
}

export default Process;
