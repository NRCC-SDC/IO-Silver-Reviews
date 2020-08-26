import React from 'react'
import { Rating, useTabContext } from '@material-ui/lab';
import {  Button,
          RadioGroup,
          Radio,
          Dialog,
          DialogTitle,
          DialogContent,
          DialogContentText,
          FormControl,
          FormControlLabel,
          FormLabel,
          TextField,
          Typography
        } from '@material-ui/core';

class AddReview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: undefined,
      recommend: undefined,
      summary: '',
      review: '',
      name: '',
      email: '',
      photo: '',
      characteristics: {
        Quality: {},
        Fit: {},
        Length: {},
        Comfort: {},
        Size: {}
      },
      errors: {}
    }
  }

  componentDidMount() {
    const ignore = ['errors', 'summary']
    let errors = {};
    Object.keys(this.state).forEach(key => {
      if(ignore.includes(key)) return
      errors[key] = 'false';
    })

    // this.setState({ errors: errors });
  }

  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={() => this.props.closeModal()}
        aria-labelledby="review-title"
        aria-describedby="review-subtitle"
        maxWidth="lg"
      >
       <DialogTitle>Write Your Review</DialogTitle>
       <DialogContent>
         <DialogContentText>About the [product name]</DialogContentText>
       </DialogContent>
       <DialogContent>
         <div id="review-user-info">
          <FormControl
            required
            error={ this.state.errors.name }
          >
            {
              this.state.errors.name
              ?
              <Typography variant="body2" style={{color: "red"}}>Name is required</Typography>
              : null
            }
            <TextField
              id="review-name"
              label="Your Name"
              value={ this.state.name || '' }
              onChange={e => this.setState({ name: e.target.value })}
              variant="outlined"
            />
          </FormControl>
          <FormControl
            required
          >
            {
              this.state.errors.email
              ?
              <Typography variant="body2" style={{color: "red"}}>Email is required</Typography>
              : null
            }
            <TextField
              id="review-email"
              label="Email"
              value={this.state.email}
              onChange={e => this.setState({ email: e.target.value })}
              variant="outlined"
            />
          </FormControl>
         </div>
         <div id="review-overview">
          <FormControl
            required
            error={this.state.errors.rating}
          >
            <FormLabel>Overall Rating:</FormLabel>
              <RadioGroup
                row
                id="overall-rating"
                aria-label="overall-rating"
                name="overall-rating-group"
                value={ this.state.rating || '' }
                onChange={ e => this.setState({ rating: e.target.value }) }
              >
                <FormControlLabel value='1' control={<Radio size="small" />} label='1' />
                <FormControlLabel value='2' control={<Radio size="small" />} label='2' />
                <FormControlLabel value='3' control={<Radio size="small" />} label='3' />
                <FormControlLabel value='4' control={<Radio size="small" />} label='4' />
                <FormControlLabel value='5' control={<Radio size="small" />} label='5' />
              </RadioGroup>
          </FormControl>
          <FormControl
            required
            error={this.state.errors.recommend}
          >
            <FormLabel>Would you recommend this product?</FormLabel>
              <RadioGroup
                row
                id="review-recommend"
                aria-label="recommend"
                name="recommend-group"
                value={ this.state.recommend || '' }
                onClick={e => this.setState({ recommend: e.target.value })}
              >
                <FormControlLabel value="Yes" control={<Radio size="small" />} label="yes" />
                <FormControlLabel value="No" control={<Radio size="small" />} label="no" />
              </RadioGroup>
          </FormControl>
         </div>
         <div id="review-characteristics">
          {this.renderCharacteristics()}
         </div>
         <div id="review-footer">
          <FormControl className="review-summary">
              <TextField
                id="review-summary"
                label="Review Summary"
                value={this.state.summary}
                onChange={e => this.setState({ summary: e.target.value })}
              />
            </FormControl>
            <FormControl
              required
              error={this.state.errors.review}
              className="review-body"
            >
              {
                this.state.errors.review
                ?
                <Typography variant="body2" style={{color: "red"}}>Review is required</Typography>
                : null
              }
              <TextField
                id="review-body"
                label="Review"
                multiline
                value={ this.state.review || '' }
                onChange={e => this.setState({ review: e.target.value })}
              />
              {
                this.state.review.length < 50
                ?
                <div>{50 - this.state.review.length} more characters needed</div>
                : null
              }
            </FormControl>
              <TextField
                id="review-add-photo"
                label="Link to a photo"
                value={ this.state.photo || '' }
                onChange={e => this.setState({ photo: e.target.value })}
              />
         </div>
         <Button id="review-submit" variant="outlined" onClick={this.handleSubmit.bind(this)}>Submit</Button>
       </DialogContent>
      </Dialog>
    )
  }


  renderCharacteristics() {
    if(Object.keys(this.props.meta).length === 0) return;

    const { characteristics } = this.props.meta;

    return (
      Object.entries(characteristics).map(([characteristic, {id, value}], index) => {
        return (
          <FormControl
            key={index}
            required
            error={this.state.errors[characteristic]}
          >
            <FormLabel>{characteristic}</FormLabel>
            <RadioGroup
              row
              id={`review-${characteristic}`}
              aria-label={characteristic}
              name={`${characteristic}-group`}
              value={ this.state.characteristics[characteristic].value || '' }
              onChange={e => this.setCharacteristic(characteristic, id, e.target.value)}
            >
              <FormControlLabel value='1' control={<Radio size="small" />} label='1' />
              <FormControlLabel value='2' control={<Radio size="small" />} label='2' />
              <FormControlLabel value='3' control={<Radio size="small" />} label='3' />
              <FormControlLabel value='4' control={<Radio size="small" />} label='4' />
              <FormControlLabel value='5' control={<Radio size="small" />} label='5' />
            </RadioGroup>
          </FormControl>
        )
      })
    )
  }

  handleSubmit() {
    if(!this.validateData()) return;

    let characteristics = {};
    Object.entries(this.props.meta.characteristics).forEach(([characteristic, {id}]) => {
      characteristics[id] = this.state.characteristics[characteristic].value
    });

    const recommend = this.state.recommend === "Yes" ? 1 : 0;

    const data = {
      rating: this.state.rating,
      summary: this.state.summary,
      body: this.state.review,
      name: this.state.name,
      email: this.state.email,
      recommend: recommend,
      characteristics: characteristics,
      photos: [this.state.photo]
    };

    const body = JSON.stringify(data);

    const { product_id } = this.props.meta;

    const url = `/reviews/${product_id}`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    })
      .then(() => {
        this.props.update();
        this.props.closeModal();
      })
  }

  validateData() {
    const { product_id } = this.props.meta;

    let errors = {}
    let errorFound = false;

    const setError = (key) => {
      errorFound = true;
      errors = {
        ...errors,
        [key]: 'true'
      }
    }

    // Make sure user has entered a name
    if(this.state.name.length === 0) setError('name');
    // Make sure user has a valid email
    const validEmail = (/^[^@]+@[^@]+\.[^@]+$/).test(this.state.email);
    if(!validEmail) setError('email');
    // Make sure the user has given an overall rating
    if(this.state.rating === undefined) setError('rating')
    // Make sure user has recommended product or not
    if(this.state.recommend === undefined) setError('recommend')
    // Make sure user filled out all characteristics
    Object.entries(this.props.meta.characteristics).map(([characteristic]) => {
      if (this.state.characteristics[characteristic].value === undefined) setError(characteristic)
    });
    // Make sure user has filled out review body
    if(this.state.review.length < 50) setError('review')

    this.setState({ errors: errors })

    if(errorFound) return false;
    return true;
  }

  setCharacteristic(characteristic, id, value) {
    const updatedCharacteristic = {
      id: id,
      value: value
    };

    this.setState({
      characteristics: {
        ...this.state.characteristics,
        [characteristic]: updatedCharacteristic
      }
    });
  }
}

export default AddReview;