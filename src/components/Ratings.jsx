import React from 'react';
import { Rating } from '@material-ui/lab';
import { LinearProgress } from '@material-ui/core';

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
    const { ratings } = this.props.meta ? this.props.meta : { ratings: {} };
    const rating = this.calculateRating(ratings);

    return (
      <div id="overview">
        <h2 id="rating-number">{ rating ? rating : 'Be the first to rate this product' }</h2>
        <Rating 
          value={ rating ? rating : 0 }
          precision={0.25}
          readOnly
        />
      </div>
    )
  }

  calcBreakdowns(ratings) {
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
    const { ratings } = this.props.meta.ratings ? this.props.meta : { ratings: {} };
    const breakdowns = this.calcBreakdowns(ratings);
    console.log(breakdowns)

    return (
      <div id="breakdown">
        {
          breakdowns.map((percentage, index) => {
            return (
              <div key={index} className="breakdown-bar" style={{flexDirection: "row"}}>
                <p>{index + 1} {index === 0 ? 'star' : 'stars'}</p>
                <LinearProgress 
                  variant="determinate"
                  value={percentage}
                  style={{
                    maxWidth: "30%",
                    padding: "6px 0"
                  }}
                />
              </div>
            )
          })
        }
      </div>
    )
  }

  renderCharacteristics() {
    return (
      <div id="characteristics"></div>
    )
  }

  render() {
    return(
      <div id="ratings">
        { this.renderOverview() }
        { this.renderBreakdown() }
        { this.renderCharacteristics() }
      </div>
    ) 
  }
}

export default Ratings;
