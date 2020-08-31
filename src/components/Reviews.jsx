import React from 'react';
import { Grid, Typography, Link, Button, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import moment from 'moment';

class Reviews extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showReviews: 2,
      markedHelpful: {},
      reported: {},
      modalIsOpen: false,
      showMore: {}
    };
  }

  render() {
    return(
      <Grid id="reviews" container item xs={9}>
        { this.renderSort() }
        { this.renderReviews() }
      </Grid>
    )
  }

  renderSort() {
    const sortOptions = ['newest', 'helpful', 'relevant'];

    const { sort } = this.props;

    const totalReviews = Object.keys(this.props.reviews).length === 0 ? 0 : this.props.reviews.results.length;

    const sortBy = this.props.sort === 'relevant' ? 'relevance' : this.props.sort;

    return (
      <div id="reviews-sort">
        <Typography id="sort-menu-title" variant="h6">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}, sorted by {sortBy}</Typography>
        <InputLabel id="sort-menu-label">Sort By</InputLabel>
        <Select
          labelId="sort-menu-label"
          id="sort-menu"
          value={sort || ''}
          onChange={e => this.props.setSort(e.target.value)}
        >
          { sortOptions.map((sortBy, index) => <MenuItem key={index} value={sortBy}>{sortBy}</MenuItem>) }
        </Select>
      </div>
    )

  }

  renderReviews() {
    const ready = Object.keys(this.props.reviews).length;
    if(!ready) return;

    let { results } = this.props.reviews ? this.props.reviews : null;

    if(this.props.filterBy) results = results.filter(review => review.rating === this.props.filterBy);

    const reviews = results.slice(0, this.state.showReviews);

    return (
      <Grid container item id="reviews-list" direction="column">
        { reviews.map((review, index) => {
          const { name, rating, summary, body, recommend, date, helpfulness, photos, response, id } = review;
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
                      {name}, {moment(date).format('MMMM Do YYYY')}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h4' noWrap>{summary}</Typography>
                </Grid>
                <Grid item>
                  {
                    body.length > 250
                    ?
                    <Typography variant="body1" onClick={ () => this.toggleShowMore(id)}>
                      {
                        this.state.showMore[id]
                        ?
                        body
                        :
                        body.slice(0, 250) + '...show more'
                      }
                    </Typography>
                    :
                    <Typography variant="body1">{body}</Typography>
                  }
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
                  <Grid className="response"  item>
                    <Typography variant="h6">Response:</Typography>
                    <Typography variant="body1">{response}</Typography>
                  </Grid>
                  : null
                }
                {
                  photos.length
                  ?
                  <div id="reviews-photos-container">
                    <div>Photos:</div>
                    <div id="reviews-photos">
                      {
                      photos.map(({url}, index) => <img src={url} key={index} />)
                      }
                    </div>
                  </div>
                  : null
                }
                <Grid className="review-footer" item>
                  <Typography variant="body2">
                    Helpful? <Link underline="always" onClick={() => this.markHelpful(id)}>Yes</Link>
                    <span> ({helpfulness}) </span>
                    <Link underline="always" onClick={() => this.reportReview(id)}>Report</Link>
                  </Typography>
                </Grid>
              </Grid>
          )
        }) }
        <Grid id="reviews-buttons" container item>
          {
          results.length > this.state.showReviews
          ?
            <Button id="more-reviews" xs={4} disableElevation variant="outlined" onClick={this.loadMoreReviews.bind(this)}>
              More Reviews
            </Button>
          : null
        }
          <Button id="add-review" xs={4} disableElevation variant="outlined" onClick={this.props.addReview}>
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

  markHelpful(id) {
    if (this.state.markedHelpful[id] === true) return;
    fetch(`/reviews/helpful/${id}/`, { method: 'PUT' })
      .then(() => {
        this.props.update();
        this.setState({ markedHelpful: {...this.state.markedHelpful, [id]: true} })
      });
  }

  reportReview(id) {
    fetch(`/reviews/report/${id}/`, { method: 'PUT' })
      .then(() => this.props.update())
  }

  toggleShowMore(id) {
    this.setState({
      showMore: {
        ...this.state.showMore,
        [id]: !this.state.showMore[id]
      }
    })
  }

}

export default Reviews;
