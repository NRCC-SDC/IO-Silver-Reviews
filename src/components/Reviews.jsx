import React from 'react';
import { Grid } from '@material-ui/core';

class Reviews extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return(
      <Grid id="reviews" container item xs={8}>
        <h2>Reviews Component</h2>
      </Grid>
    )
  }
}

export default Reviews;
