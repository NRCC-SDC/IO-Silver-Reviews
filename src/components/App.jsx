import React from 'react';
import Ratings from './Ratings.jsx';
import Reviews from './Reviews.jsx';
import { Grid } from '@material-ui/core';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      product_id: 2,// Math.floor(Math.random() * 100),
      meta: {},
      reviews: {}
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

  fetchReviews() {
    fetch(`http://52.26.193.201:3000/reviews/${this.state.product_id}/list`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          reviews: data
        });
      });
  }

  componentDidMount() {
    this.fetchMetadata();
    this.fetchReviews();
  }

  render() { 
    return (
      <div id="app">
        <h2 id="title">Ratings and Reviews</h2>
        <Grid container spacing={2}>
          <Ratings meta={this.state.meta} />
          <Reviews reviews={this.state.reviews} />
        </Grid>
      </div>
    )
  }
}

export default App;
