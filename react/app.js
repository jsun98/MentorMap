import React from 'react';
import BodyHeader from './components/top_header';
import Wrapper from './components/wrapper';

class App extends React.Component {
  render() {
    return (
      <div>
        <BodyHeader />
        <Wrapper />
      </div>
    );
  }
}

export default App;
