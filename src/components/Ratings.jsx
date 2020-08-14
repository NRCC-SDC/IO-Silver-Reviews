import React from 'react';
import { Rating } from '@material-ui/lab';
import { LinearProgress, Grid, Typography } from '@material-ui/core';

const Ratings = (props) => {

  const { meta } = props;

  const { ratings, recommended } = Object.keys(meta).length > 0 ? meta : { ratings: {}, recommended: {} };

  // Utilities
  const calcRating = () => {
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
  };

  const calcBreakdowns = () => {
    if (Object.keys(ratings).length === 0) return new Array(5).fill(0);

    const findTotal = (result, value) => {
      if (ratings[value] === undefined) return result;

      return result += ratings[value];
    }

    const calculatePercentage = value => {
      if (ratings[value] === undefined) return 0;
      return (ratings[value] / totalRatings) * 100;
    }

    const ratingValues = [1, 2, 3, 4, 5];
    
    const totalRatings = ratingValues.reduce(findTotal, 0);

    return ratingValues.map(calculatePercentage);
  };

  const calcRecommended = () => {
    if (Object.keys(recommended).length === 0) return;

    const dislikes = recommended[0] || 0;
    const likes = recommended[1] || 0;
    const total = likes + dislikes;
    const percentage = Math.floor((likes / total) * 100);

    return percentage;
  };

  // Rendering
  const renderOverview = () => {
    const rating = calcRating();

    return (
      <Grid container item id="overview" alignItems='center'>
        <Grid item xs={3}>
          <h2 id="rating-number">{ rating ? rating : 'No Reviews' }</h2>
        </Grid>
        <Grid item>
          <Rating 
            value={ rating ? rating : 0 }
            precision={0.25}
            readOnly
          />
        </Grid>
      </Grid>
    );
  };

  const renderBreakdown = () => {
    const breakdowns = calcBreakdowns();
    const percentRecommended = calcRecommended();

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
        
        <p>
          { percentRecommended !== undefined
            ? `${percentRecommended}% of users recommend this product`
            : 'Nobody has recommended this product yet'
          } 
        
        </p>
      </Grid>
    );
  };

  const renderCharacteristics = () => {

  };

  const render = () => {
    return (
      <Grid>
        { renderOverview() }
        { renderBreakdown() }
        { renderCharacteristics() }
      </Grid>
    );
  };

  return render();
};

export default Ratings;
