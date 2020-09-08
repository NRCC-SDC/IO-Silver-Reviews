// file of helper functions for artillery testing
const faker = require('faker');

module.exports = {
  randomProductId,
  prepareJSON,
  randomReviewId
}

function randomProductId(context, ee, next) {
  context.vars.productId = random(1, 1000000);
  return next();
}

function randomReviewId(context, ee, next) {
  context.vars.reviewId = random(9000000, 10000000);
  return next();
}

function prepareJSON(requestParams, context, ee, next) {
  requestParams.json.summary = faker.lorem.words();
  requestParams.json.body = faker.lorem.paragraph();
  requestParams.json.name = faker.name.findName();
  requestParams.json.email = faker.internet.email();

  requestParams.json.rating = random(1, 5);
  requestParams.json.recommend = random(0, 1);

  let characteristics = {};
  let chars = ['Size', 'Width', 'Comfort', 'Quality', 'Length', 'Fit'];
  let numOfChars = random(1, 6);
  let available = [1, 2, 3, 4, 5, 6];
  while (numOfChars > 0) {
    let randomIndex = random(0, available.length - 1)
    let chara = available[randomIndex];
    characteristics[chara] = random(1, 5);
    available = available.slice(0, randomIndex).concat(available.slice(randomIndex + 1));
    numOfChars--;
  }

  requestParams.json.characteristics = characteristics;

  let photos = [];
  let numOfImages = random(0, 5);
  for (let j = 0; j < numOfImages; j++) {
    photos.push(faker.random.image());
  }

  requestParams.json.photos = photos;

  // console.log(requestParams.json);
  return next();
}

// helper functions
// generate random number between start and end inclusive
function random(start, end) {
  // not truly random, somewhat biased
  return start + Math.floor(Math.random() * (end - start + 1));
};