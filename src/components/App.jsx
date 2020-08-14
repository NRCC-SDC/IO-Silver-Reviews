import React, { useState } from 'react';
import Ratings from './Ratings.jsx';
import Reviews from './Reviews.jsx';
import AddReview from './AddReview.jsx';
import { Grid } from '@material-ui/core';

const App = () => {
  const [productId, setProductId] = useState(24);
  const [meta, setMeta] = useState({});
  const [reviews, setReviews] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const reviewsURL = 'http://52.26.193.201:3000/reviews/';

  const fetchMetadata = () => {
    const url = reviewsURL + `${productId}/meta`;
    fetch(url)
      .then(res => res.json())
      .then(data => setMeta(data));
  }

  const fetchReviews = () => {
    const url = reviewsURL + `${productId}/list`;
    fetch(url)
      .then(res => res.json())
      .then(data => setReviews(data));
  }

  const openModal = () => setModalIsOpen(true);

  const closeModal = () => setModalIsOpen(false);

  fetchMetadata();
  fetchReviews();

  return (
    <div id="app">
      <h2 id="title">
        <Grid container spacing={2}>
          <Ratings meta={meta} />
          <Reviews reviews={reviews} update={fetchReviews} addReview={openModal} />
        </Grid>
        <AddReview isOpen={modalIsOpen} closeModal={closeModal} meta={meta} update={fetchReviews} />
      </h2>
    </div>
  );
};

export default App;