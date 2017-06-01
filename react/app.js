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
        <Jumbotron />
      </div>
    );
  }
}

export default App;
