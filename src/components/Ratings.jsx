import React from 'react';
import { Rating } from '@material-ui/lab';
import { LinearProgress, Grid } from '@material-ui/core';

class Ratings extends React.Component {
  constructor(props) {
    super(props);
  }

  calculateRating(ratings = {}) {
    // If ratings object is empty, return undefined
    if (Object.keys(ratings).length === 0) return;

    const createArray = (array, value) => {
      if (ratings[value] === undefined) return array;
      const length = ratings[value];
      const newArray = new Array(length).fill(value);
      return [...array, ...newArray];
    }

    const calc = (result, value) => {
      return result += value;
    }

    const ratingsArray = [1, 2, 3, 4, 5].reduce(createArray, []);

    return (ratingsArray.reduce(calc, 0) / ratingsArray.length).toPrecision(2);
  }

  renderOverview() {
    const { ratings } = this.props.meta ? this.props.meta : {};
    const rating = this.calculateRating(ratings);

    return (
      <Grid container item id="overview" alignItems='center'>
        <Grid item xs={3}>
          <h2 id="rating-number">{ rating ? rating : 'Be the first to rate this product' }</h2>
        </Grid>
        <Grid item>
          <Rating 
            value={ rating ? rating : 0 }
            precision={0.25}
            readOnly
          />
        </Grid>
      </Grid>
    )
  }

  calcBreakdowns(ratings = {}) {
    if (Object.keys(ratings).length === 0) return new Array(5).fill(0);

    const findTotal = (result, value) => {
      if (ratings[value] === undefined) return result;

      return result += ratings[value];
    }

    const totalRatings = [1, 2, 3, 4, 5].reduce(findTotal, 0);

    const calculatePercentage = value => {
      if (ratings[value] === undefined) return 0;
      return (ratings[value] / totalRatings) * 100;
    }

    return [1, 2, 3, 4, 5].map(calculatePercentage);
  }

  renderBreakdown() {
    const { ratings } = this.props.meta.ratings ? this.props.meta : {};
    const breakdowns = this.calcBreakdowns(ratings);
    console.log(breakdowns)

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
                style={{flexDirection: "row"}}
                alignItems='center'
              >
                <Grid item md={3}>
                  {index + 1} {index === 0 ? 'star' : 'stars'}
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
      </Grid>
    )
  }

  renderCharacteristics() {
    return (
      <div id="characteristics"></div>
    )
  }

  render() {
    return(
      <Grid container item xs={3}>
        { this.renderOverview() }
        { this.renderBreakdown() }
        { this.renderCharacteristics() }
      </Grid>
    ) 
  }
}

export default Ratings;
