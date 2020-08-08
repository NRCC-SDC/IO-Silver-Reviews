import React from 'react';
import Ratings from './Ratings.jsx';
import Reviews from './Reviews.jsx';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      product_id: Math.floor(Math.random() * 100),
      meta: {}
    }
  }

  fetchMetadata() {
    fetch(`http://52.26.193.201:3000/reviews/${this.state.product_id}/meta`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          meta: data
        });
      });
  }

  componentDidMount() {
    this.fetchMetadata();
  }

  render() { 
    return (
      <div id="app">
        <h2 id="title">Ratings and Reviews</h2>
        <Ratings meta={this.state.meta} />
        <Reviews />
      </div>
    )
  }
}

export default App;
