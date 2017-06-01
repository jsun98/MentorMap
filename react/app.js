import React from 'react';
import Nav from './components/nav';
import Jumbotron from './components/jumbotron';

class App extends React.Component {
  render() {
    return (
      <div>
        <header>
          <Nav />
        </header>
        <section>
          <Jumbotron />
        </section>
      </div>
    );
  }
}

export default App;
