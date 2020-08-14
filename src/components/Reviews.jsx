import React, { useState } from 'react';
import { Grid, Typography, Link, Paper, Button } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import moment from 'moment';

const Reviews = (props) => {
  const [showReviews, setShowReviews] = useState(2);

  const { reviewsURL, reviews, update, addReview } = props;

  // Utilities
  const loadMoreReviews = () => setShowReviews(showReviews + 2);

  const markHelpful = (reviewId) => {
    const url = reviewsURL + `/helpful/${review_id}/`;
    const options = { method: 'PUT' };

    fetch(url, options).then(update);
  };

  const reportReview = (reviewId) => {
    const url = reviewsURL + `report/${reviewId}`;
    const options = { method: 'PUT' };

    fetch(url, options).then(update);
  } 

  // Rendering
  const renderReviews = (reviews = []) => {
    const reviewsToShow = reviews.slice(0, showReviews);

    return (
      <Grid container item id="reviews-list" direction="column" spacing={2}>
        { reviewsToShow.map((review, index) => {
          const { reviewer_name, rating, summary, body, recommend, date, helpfulness, photos, response, review_id } = review;
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
                    Helpful? <Link underline="always" onClick={() => markHelpful(review_id)}>Yes</Link>
                    <span> ({helpfulness}) </span>
                    <Link underline="always" onClick={() => reportReview(review_id)}>Report</Link>
                  </Typography>
                </Grid>
              </Grid>
          )
        }) }
        <Grid container item>
          { 
          reviewsToShow.length < reviews.length 
          ?
            <Button id="more-reviews" xs={4} disableElevation variant="outlined" onClick={() => loadMoreReviews()}>
              More Reviews
            </Button>
          : null
        }
          <Button id="add-review" xs={4} disableElevation variant="outlined" onClick={() => addReview()}>
            + Add Review
          </Button>
        </Grid>
      </Grid>
    )
  };

  const render = () => {
    const { results } = Object.keys(reviews).length ? reviews : { results: [] };
    return (
      <Grid id="reviews" container item xs={9}>
        { renderReviews(results) }
      </Grid>
    );
  }

  return render();
}

export default Reviews;
