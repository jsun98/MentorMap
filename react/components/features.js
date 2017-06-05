import React from 'react';
import Feature from './feature';

class Features extends React.Component {
  render() {
    return (
      <section id="features">

        <header className="block-heading cleafix">
          <div className="row">
            <div className="col-md-3" />
            <div className="col-md-6" >
              <div className="title-page">
                <h5>Features</h5>
                <h1>What do we have to offer?</h1>
                <p className="lead">Lorem ipsum Do commodo in proident enim in dolor cupidatat adipisicing dolore officia nisi aliqua incididunt Ut veniam lorem ipsum Consectetur ut in in eu do.</p>
              </div>
            </div>
            <div className="col-md-3" />
          </div>
        </header>

        <div className="row features-content">

          <div className="features-list">

            <div className = "row">
              <div className = 'col-md-4'>
                <Feature iconType="icon-window" title="Fully Resposive" text="Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. " />
              </div>
              <div className = 'col-md-4'>
                <Feature iconType="icon-eye" title="Retina Ready" text="Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. " />
              </div>
              <div className = 'col-md-4'>
                <Feature iconType="icon-paint-brush" title="Stylish Design" text="Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. " />
              </div>
            </div>

            <div className = "row">
              <div className = 'col-md-4'>
                <Feature iconType="icon-window" title="Fully Resposive" text="Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. " />
              </div>
              <div className = 'col-md-4'>
                <Feature iconType="icon-eye" title="Retina Ready" text="Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. " />
              </div>
              <div className = 'col-md-4'>
                <Feature iconType="icon-paint-brush" title="Stylish Design" text="Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. Sorry No Engrish. " />
              </div>
            </div>


            </div>

        </div>

      </section>
    );
  }
}

export default Features;
