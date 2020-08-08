import React from 'react';
import { Rating } from '@material-ui/lab';

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

  renderBreakdown() {
    return (
      <div id="breakdown"></div>
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
