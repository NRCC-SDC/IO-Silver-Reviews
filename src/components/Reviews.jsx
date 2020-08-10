import React from 'react';
import { Grid, Typography, Link, Paper, Button } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import moment from 'moment';

class Reviews extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showReviews: 2
    };
  }

  render() {
    return(
      <Grid id="reviews" container item xs={9}>
        { this.renderReviews() }
      </Grid>
    )
  }

  renderReviews() {
    const ready = Object.keys(this.props.reviews).length;
    if(!ready) return;

    const { results } = this.props.reviews ? this.props.reviews : null;

    const reviews = results.slice(0, this.state.showReviews);

    return (
      <Grid container item id="reviews-list" direction="column" spacing={2}>
        { reviews.map((review, index) => {
          const { reviewer_name, rating, summary, body, recommend, date, helpfulness, photos, response } = review;
          return(
              <Grid key={index} className="user-review" container item direction="column">
                <Grid container item justify="space-between">
                  <Grid item>
                    <Rating 
                      value={rating}
                      precision={0.25}
                      size="small"
                      readOnly
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant='body2'>
                      {reviewer_name}, {moment(date).format('MMMM Do YYYY')}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h4' noWrap>{summary}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant='body1'>{body}</Typography>
                </Grid>
                {
                  recommend
                  ?
                  <Grid item>
                    <Typography variant='body2'>I recommend this product</Typography>
                  </Grid>
                  : null
                }
                {
                  (response && response !== 'null' && response !== '')
                  ?
                  <Grid item>
                    <Paper square variant="outlined" elevation={2}>{response}</Paper>
                  </Grid>
                  : null
                }
                <Grid item>
                  <Typography variant="body2">
                    Helpful? <Link underline="always">Yes</Link> ({helpfulness}) <Link underline="always">Report</Link>
                  </Typography>
                </Grid>
              </Grid>
          )
        }) }
        <Grid container item>
          { 
          results.length > this.state.showReviews 
          ?
            <Button id="more-reviews" xs={4} disableElevation variant="outlined" onClick={this.loadMoreReviews.bind(this)}>
              More Reviews
            </Button>
          : null
        }
          <Button id="add-review" xs={4} disableElevation variant="outlined" onClick={this.loadMoreReviews.bind(this)}>
            + Add Review
          </Button>
        </Grid>
      </Grid>
    )

  }

  loadMoreReviews() {
    const newReviews = this.state.showReviews + 2;
    this.setState({
      showReviews: newReviews
    });
  }
  
}

export default Reviews;
