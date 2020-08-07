import React from 'react';
import Ratings from './Ratings.jsx';
import Reviews from './Reviews.jsx';

class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div id="app">
        <h2 id="title">Ratings and Reviews</h2>
        <Ratings />
        <Reviews />
      </div>
    )
  }
}

export default App;
