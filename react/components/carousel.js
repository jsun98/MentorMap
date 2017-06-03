import React from 'react';
import CarouselIndicator from './carousel_indicator';
import CarouselItem from './carousel_item';

class Carousel extends React.Component {
  render () {
    return (
      <section className="block-body">
        <div className="row">
          <div id="carousel-example-generic" className="carousel slide" data-ride="carousel">

              <ol className="carousel-indicators">
                <li data-target="#carousel-example-generic" data-slide-to="0" className="active"></li>
                <li data-target="#carousel-example-generic" data-slide-to="1"></li>
                <li data-target="#carousel-example-generic" data-slide-to="2"></li>
              </ol>

              <div className="carousel-inner" role="listbox">
                <CarouselItem class="item active" src="images/01_200x200.png" text="Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish" />
                <CarouselItem class="item" src="images/02_200x200.png" text="Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish" />
                <CarouselItem class="item" src="images/03_200x200.png" text="Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish Sorry No Engrish" />
              </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Carousel;
