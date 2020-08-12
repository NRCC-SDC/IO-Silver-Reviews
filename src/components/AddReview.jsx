import React from 'react'
import { Rating, useTabContext } from '@material-ui/lab';
import {  Typography, 
          RadioGroup, 
          Radio, 
          Dialog, 
          DialogTitle, 
          DialogContent, 
          DialogContentText, 
          FormControl, 
          FormControlLabel,
          FormLabel,
          TextField
        } from '@material-ui/core';

class AddReview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: 0,
      recommend: undefined,
      summary: '',
      review: ''
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.isOpen} 
        onClose={() => this.props.closeModal()} 
        aria-labelledby="review-title"
        aria-describedby="review-subtitle"
      >
       <DialogTitle>Write Your Review</DialogTitle> 
       <DialogContent>
         <DialogContentText>About the [product name]</DialogContentText>
       </DialogContent>
       <DialogContent>
         <FormControl required>
           <FormLabel>Overall Rating:</FormLabel>
            <RadioGroup row id="overall-rating" aria-label="overall-rating" name="overall-rating-group">
              {this.renderRatingsButtons()}
            </RadioGroup>
         </FormControl>
         <FormControl required>
           <FormLabel>Would you recommend this product?</FormLabel>
            <RadioGroup row id="review-recommend" aria-label="recommend" name="recommend-group">
              <FormControlLabel value="Yes" control={<Radio />} label="yes" />
              <FormControlLabel value="No" control={<Radio />} label="no" />
            </RadioGroup>
         </FormControl>
         {this.renderCharacteristics()}
         <FormControl required>
           <div>
            <TextField 
              id="review-summary"
              label="Review Summary"
              value={this.state.summary}
              onChange={e => this.setState({ summary: e.target.value })}
              variant="outlined"
            />
           </div>
           <div>
            <TextField 
              id="review-body"
              label="Review"
              multiline
              value={this.state.review}
              onChange={e => this.setState({ review: e.target.value })}
              variant="outlined"
            />
           </div>
         </FormControl>
       </DialogContent>
      </Dialog>
    )
  }

  renderCharacteristics() {
    const ready = Boolean(this.props.meta.characteristics);
    if (!ready) return; 

    const { characteristics } = this.props.meta;

    return (
      <FormControl>
        <FormLabel id="review-characteristics">Characteristics:</FormLabel>
        { Object.keys(characteristics).map((characteristic, index) => {
          return (
            <div key={index}>
              <FormLabel>{characteristic}</FormLabel>
              <RadioGroup row id={`review-${characteristic}`} aria-label={characteristic} name={`${characteristic}-group`}>
                {this.renderRatingsButtons()}
              </RadioGroup> 
            </div>
          )
        })
      }
      </FormControl>
    )
  }

  renderRatingsButtons() {
    const ratings = [1, 2, 3, 4, 5];
    return ratings.map((rating, index) => 
      <FormControlLabel 
        key={index}
        value={rating}
        control={<Radio />}
        label={rating}
      />
    )
  }
}

export default AddReview;