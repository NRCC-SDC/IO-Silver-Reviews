const supertest = require('supertest');

const request = supertest('http://localhost:3001');

describe('Request Testing', () => {
  let product_id = random(1, 1000000);

  test('/GET Meta Data Route', async () => {
    let response = await request.get(`/reviews/${product_id}/meta`);

    let body = response.body;
    // console.log(body);

    // check if correct product meta data was returned
    expect(Number(body.product_id)).toBe(product_id);

    // check if valid characteristics data was returned
    let chars = Object.keys(body.characteristics);
    expect(chars.length).toBeLessThanOrEqual(6);
    expect(chars.length).toBeGreaterThanOrEqual(1);
    for (let i = 0; i < chars.length; i++) {
      expect(body.characteristics[chars[i]]).toHaveProperty('id');
      expect(body.characteristics[chars[i]]['id']).toBeGreaterThanOrEqual(1);
      expect(body.characteristics[chars[i]]['id']).toBeLessThanOrEqual(6);
      expect(body.characteristics[chars[i]]).toHaveProperty('value');
      expect(body.characteristics[chars[i]]['value']).toBeGreaterThanOrEqual(1);
      expect(body.characteristics[chars[i]]['value']).toBeLessThanOrEqual(5);
    }

    // check if valid recommended prop
    expect(body.recommended).toHaveProperty('0');
    expect(body.recommended).toHaveProperty('1');

    // check if valid ratings
    expect(body.ratings).toHaveProperty('1');
    expect(body.ratings).toHaveProperty('2');
    expect(body.ratings).toHaveProperty('3');
    expect(body.ratings).toHaveProperty('4');
    expect(body.ratings).toHaveProperty('5');

    expect(body.ratings['1']).toBeGreaterThanOrEqual(0);
    expect(body.ratings['2']).toBeGreaterThanOrEqual(0);
    expect(body.ratings['3']).toBeGreaterThanOrEqual(0);
    expect(body.ratings['4']).toBeGreaterThanOrEqual(0);
    expect(body.ratings['5']).toBeGreaterThanOrEqual(0);

  });

  test('/GET Review Data Route', async () => {
    let response = await request.get(`/reviews/${product_id}/list?count=100&sort=newest`);

    let body = response.body;

    // check if correct product Review data was returned
    expect(Number(body.product_id)).toBe(product_id);

    let results = body.results;

    if (results.length > 0) {
      let firstResult = results[0];

      // check that correct props exist
      expect(firstResult).toHaveProperty('id');
      expect(firstResult).toHaveProperty('product_id');
      expect(firstResult).toHaveProperty('summary');
      expect(firstResult).toHaveProperty('body');
      expect(firstResult).toHaveProperty('response');
      expect(firstResult).toHaveProperty('rating');
      expect(firstResult).toHaveProperty('name');
      expect(firstResult).toHaveProperty('email');
      expect(firstResult).toHaveProperty('date');
      expect(firstResult).toHaveProperty('recommend');
      expect(firstResult).toHaveProperty('helpfulness');
      expect(firstResult).toHaveProperty('photos');

      // check that props have correct type
      expect(typeof firstResult.id).toBe('number');
      expect(typeof firstResult.product_id).toBe('number');
      expect(typeof firstResult.summary).toBe('string');
      expect(typeof firstResult.body).toBe('string');
      expect(typeof firstResult.rating).toBe('number');
      expect(typeof firstResult.name).toBe('string');
      expect(typeof firstResult.email).toBe('string');
      expect(typeof firstResult.date).toBe('string');
      expect(typeof firstResult.recommend).toBe('number');
      expect(typeof firstResult.helpfulness).toBe('number');
      expect(Array.isArray(firstResult.photos)).toBe(true);

      if (firstResult.response !== null) {
        expect(typeof firstResult.response).toBe('string');
      }

      // check if photos have correct props and are of correct types
      if (firstResult.photos.length > 0) {
        let photo = firstResult.photos[0];
        expect(photo).toHaveProperty('id');
        expect(photo).toHaveProperty('url');
        expect(typeof photo.id).toBe('number');
        expect(typeof photo.url).toBe('string');
      } else {
        console.log('No photos for this review')
      }

    } else {
      console.log('No Reviews for this product')
    }
  });

});

// helper functions
function random(start, end) {
  // not truly random, somewhat biased
  return start + Math.floor(Math.random() * (end - start + 1));
};