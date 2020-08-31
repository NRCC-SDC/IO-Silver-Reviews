import React from 'react';
import { Rating } from '@material-ui/lab';
import { LinearProgress, Grid, Typography } from '@material-ui/core';

class Ratings extends React.Component {
  constructor(props) {
    super(props);
  }

  // Rendering
  render() {
    return (
      <Grid id="ratings" container item xs={3} direction="column">
        {this.renderOverview()}
        {this.renderBreakdown()}
        {this.renderCharacteristics()}
      </Grid>
    )
  }

  renderOverview() {
    const { ratings } = this.props.meta ? this.props.meta : {};
    const rating = this.calcRating(ratings);

    return (
      <Grid container item id="overview" alignItems='center'>
        <Grid item xs={3}>
          <h2 id="rating-number">{rating ? rating : 'No Reviews'}</h2>
        </Grid>
        <Grid item>
          <Rating
            value={rating ? rating : 0}
            precision={0.25}
            readOnly
          />
        </Grid>
      </Grid>
    )
  }

  renderBreakdown() {
    const { ratings, recommended } = this.props.meta ? this.props.meta : {};
    const breakdowns = this.calcBreakdowns(ratings);
    const percentRecommend = this.calcRecommend(recommended);

    return (
      <Grid container item id="breakdown">
        {
          breakdowns.map((percentage, index) => {
            return (
              <Grid
                container
                item
                key={index}
                className="breakdown-bar"
                style={{ flexDirection: "row" }}
                alignItems='center'
              >
                <Grid item md={3}>
                  <a href='#' className="breakdown-number" onClick={() => this.props.setFilter(index + 1)}>
                    {index + 1} {index === 0 ? 'star' : 'stars'}
                  </a>
                </Grid>
                <Grid item md={9}>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                  />
                </Grid>
              </Grid>
            )
          })
        }

        <Typography variant="body2" id="percent-recommend">
          {percentRecommend !== undefined
            ? `${percentRecommend}% of users recommend this product`
            : 'Nobody has recommended this product yet'
          }

        </Typography>
      </Grid>
    )
  }

  renderCharacteristics() {
    if (Object.keys(this.props.meta).length === 0) return;

    const { characteristics } = this.props.meta.characteristics === undefined ? { characteristics: {} } : this.props.meta;

    const descriptions = {
      Size: ['Too Small', 'Perfect', 'Too Large'],
      Comfort: ['Poor', 'Perfect'],
      Quality: ['Poor', 'Perfect'],
      Fit: ['Too Tight', 'Perfect', 'Too Baggy'],
      Length: ['Too Short', 'Perfect', 'Too Long'],
      Width: ['Too Thin', 'Perfect', 'Too Wide']
    }

    return (
      <div id="characteristics">
        {Object.entries(characteristics).map(([characteristic, { id, value }], index) => {
          const percentage = (value / 5.0) * 100;

          return (
            <Grid key={index} container className="characteristic" spacing={2}>
              <Grid item xs={3} className="characteristic-name">{characteristic}</Grid>
              <Grid item xs={9} className="characteristic-bar-container">
                <div className="characteristic-marker" style={{ position: 'relative', left: `${percentage}%` }} />
                <div className="characteristic-bar" />
                <div className="characteristic-description-container">
                  {descriptions[characteristic].map((description, index) => {
                    return (
                      <div key={index} className="characteristic-description">{description}</div>
                    )
                  })}
                </div>
              </Grid>
            </Grid>
          )
        })
        }
      </div>
    )
  }

  // Utilities
  calcRating(ratings = {}) {
    if (Object.keys(ratings).length === 0) return;

    const createArray = (array, value) => {
      if (ratings[value] === undefined) return array;
      const length = ratings[value];
      const newArray = new Array(length).fill(value);
      return [...array, ...newArray];
    }

    const ratingsArray = [1, 2, 3, 4, 5].reduce(createArray, []);

    const length = ratingsArray.length;
    const total = ratingsArray.reduce((total, value) => total += value, 0)
    const average = (total / length).toPrecision(2);

    return average;
  }

  calcBreakdowns(ratings = {}) {
    if (Object.keys(ratings).length === 0) return new Array(5).fill(0);

    const findTotal = (result, value) => {
      if (ratings[value] === undefined) return result;

      return result += ratings[value];
    }

    const calculatePercentage = value => {
      if (ratings[value] === undefined) return 0;
      return (ratings[value] / totalRatings) * 100;
    }

    const totalRatings = [1, 2, 3, 4, 5].reduce(findTotal, 0);

    return [1, 2, 3, 4, 5].map(calculatePercentage);
  }

  calcRecommend(recommended = {}) {
    if (Object.keys(recommended).length === 0) return;

    const dislikes = recommended[0] || 0;
    const likes = recommended[1] || 0;
    const total = likes + dislikes;
    const percentage = Math.floor((likes / total) * 100);

    return percentage;
  }
}

export default Ratings;
