const faker = require('faker');
const fs = require('fs');

var writer = fs.createWriteStream('dataGenerator/generatedReviews.txt', {
  flags: 'a' // 'a' means appending (old data will be preserved)
})

// let numOfReviews = 10000000;
let numOfReviews = 1;

for (let i = 0; i < numOfReviews; i++) {
  let reviewData = {
    id: i,
    product_id: random(0, 1000000),
    summary: faker.lorem.words(),
    body: faker.lorem.paragraph(),
    rating: random(1, 5),
    name: faker.name.findName(),
    email: faker.internet.email(),
    date: faker.date.past(),
    recommend: random(0, 1),
    // should have response for 1 in 10 reviews
    response: random(1, 10) === 5 ? faker.lorem.sentences() : null,
    // should randomly make 1 in 1000 reviews reported
    reported: random(1, 1000) === 500,
    characteristics: {},
    images: []
  };

  let charas = ['Size', 'Width', 'Comfort', 'Quality', 'Length', 'Fit'];
  let numOfChars = random(1, 6);
  // generate characteristics
  while (numOfChars > 0) {
    let randomIndex = random(0, charas.length - 1)
    let chara = charas[randomIndex];
    reviewData.characteristics[chara] = random(1, 5);
    charas = charas.slice(0, randomIndex).concat(charas.slice(randomIndex + 1));
    numOfChars--;
  }

  // generate images
  let numOfImages = random(0, 5);
  for (let j = 0; j < numOfImages; j++) {
    reviewData.images.push(faker.random.image());
  }

  // console.log(reviewData);
  const reviewDataJSON = JSON.stringify(reviewData);
  // load reviewData into file
  writer.write(reviewDataJSON + '\n');
}
writer.end();

// helper functions
function random(start, end) {
  // not truly random, somewhat biased
  return start + Math.floor(Math.random() * (end - start + 1));
};
