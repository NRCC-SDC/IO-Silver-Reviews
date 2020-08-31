const faker = require('faker');
const fs = require('fs');
const moment = require('moment');

let begin = moment();

// Add headers to csv files
fs.writeFileSync('dataGenerator/generatedReviews.csv', 'id,product_id,summary,body,rating,name,email,date,recommend,helpfulness,response,reported\n');

fs.writeFileSync('dataGenerator/generatedImages.csv', 'id,url,review_id\n');

fs.writeFileSync('dataGenerator/generatedRevsChars.csv', 'id,review_id,char_id,value\n');

// generate characteristics csv
const charWriter = fs.createWriteStream('dataGenerator/generatedChars.csv');
charWriter.write('id,char_name\n')
let charas = ['Size', 'Width', 'Comfort', 'Quality', 'Length', 'Fit'];
charas.forEach((char, index) => {
  charWriter.write((index + 1) + ',' + char + '\n');
})
charWriter.end();

// generate characteristics for each product
let products = [];
for (let x = 1; x <= 1000000; x++) {
  products[x] = [];
  let numOfChars = random(1, 6);
  let available = [1, 2, 3, 4, 5, 6];
  while (numOfChars > 0) {
    let randomIndex = random(0, available.length - 1)
    let chara = available[randomIndex];
    products[x].push(chara);
    available = available.slice(0, randomIndex).concat(available.slice(randomIndex + 1));
    numOfChars--;
  }
}

// keeps track of image and revChar ids
let imageCount = 1;
let revCharCount = 1;

let numOfReviews = 10000000;
// let numOfReviews = 1000;
let numOfBatches = 100;

for (let r = 0; r < numOfBatches; r++) {

  for (let i = 1; i <= numOfReviews / numOfBatches; i++) {

    let dateFormatted = moment(faker.date.past()).format("YYYY[-]MM[-]DD[T]HH:mm:ss.SSS[Z]");

    let reviewData = {
      id: i + (r * numOfReviews / numOfBatches),
      product_id: random(1, 1000000),
      summary: faker.lorem.words(),
      body: faker.lorem.paragraph(),
      rating: random(1, 5),
      name: faker.name.findName(),
      email: faker.internet.email(),
      date: dateFormatted,
      recommend: Boolean(random(0, 1)),
      helpfulness: random(0, 100),
      // should have response for 1 in 10 reviews
      response: random(1, 10) === 5 ? faker.lorem.sentences() : 'null',
      // should randomly make 1 in 1000 reviews reported
      reported: random(1, 1000) === 500
    };

    let reviewDataRow = '';
    for (let key in reviewData) {
      reviewDataRow += reviewData[key].toString();
      if (key !== 'reported') {
        reviewDataRow += ',';
      }
    }
    fs.appendFileSync('dataGenerator/generatedReviews.csv', (reviewDataRow + '\n'));

    // make values for characteristics
    let characteristics = products[reviewData.product_id];
    for (let k = 0; k < characteristics.length; k++) {
      let revCharDataRow = revCharCount + ',' + reviewData.id + ',' + characteristics[k] + ',' + random(1, 5) + '\n';
      fs.appendFileSync('dataGenerator/generatedRevsChars.csv', revCharDataRow);
      revCharCount++;
    }

    // generate images
    let numOfImages = random(0, 5);
    for (let j = 0; j < numOfImages; j++) {
      let imageDataRow = imageCount + ',' + faker.random.image() + ',' + reviewData.id + '\n';
      fs.appendFileSync('dataGenerator/generatedImages.csv', imageDataRow);
      imageCount++;
    }

  }

  let batchDone = moment();
  console.log((r+1) + ' Batches complete and ' + ((r+1) * numOfReviews/numOfBatches)
    + ' Records Written in ' + batchDone.diff(begin, 'minutes') + ' minutes');
}

let finished = moment();
console.log('Generated ' + numOfReviews + ' Records in ' + finished.diff(begin, 'minutes', true) + ' minutes');

// helper functions
function random(start, end) {
  // not truly random, somewhat biased
  return start + Math.floor(Math.random() * (end - start + 1));
};
