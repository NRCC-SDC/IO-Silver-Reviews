const faker = require('faker');
const fs = require('fs');
const moment = require('moment');

// var writer = fs.createWriteStream('dataGenerator/generatedReviews.txt', {
//   flags: 'a' // 'a' means appending (old data will be preserved)
// })

const reviewWriter = fs.createWriteStream('dataGenerator/generatedReviews.csv')

const imageWriter = fs.createWriteStream('dataGenerator/generatedImages.csv')

const revCharWriter = fs.createWriteStream('dataGenerator/generatedRevsChars.csv')

const charWriter = fs.createWriteStream('dataGenerator/generatedChars.csv');

reviewWriter.write('id,product_id,summary,body,rating,name,email,date,recommend,helpfulness,response,reported\n');

imageWriter.write('id,url,review_id\n')

charWriter.write('id,char_name\n')

let charas = ['Size', 'Width', 'Comfort', 'Quality', 'Length', 'Fit'];
charas.forEach((char, index) => {
  charWriter.write((index + 1) + ',' + char + '\n');
})
charWriter.end();

revCharWriter.write('id,review_id,char_id,value\n');

let imageCount = 1;
let revCharCount = 1;

// let numOfReviews = 10000000;
let numOfReviews = 10;

for (let i = 1; i <= numOfReviews; i++) {
  let dateFormatted = moment(faker.date.past()).format("YYYY[-]MM[-]DD[T]HH:mm:ss.SSS[Z]");

  let reviewData = {
    id: i, // added automatically with serial
    product_id: random(0, 1000000),
    summary: faker.lorem.words(),
    body: faker.lorem.paragraph(),
    rating: random(1, 5),
    name: faker.name.findName(),
    email: faker.internet.email(),
    date: dateFormatted,
    recommend: Boolean(random(0, 1)),
    helpfulness: random(0, 100),
    // should have response for 1 in 10 reviews
    response: random(1, 10) === 5 ? faker.lorem.sentences() : null,
    // should randomly make 1 in 1000 reviews reported
    reported: random(1, 1000) === 500
  };

  let revDataArray = [];
  for (let key in reviewData) {
    revDataArray.push(reviewData[key]);
  }

  for (let j = 0; j < revDataArray.length; j++) {
    let revData;
    if (revDataArray[j] === null) {
      revData = revDataArray[j];
    } else {
      revData = revDataArray[j].toString();
    }

    if (j !== revDataArray.length - 1) {
      revData += ','
    }

    reviewWriter.write(revData);
  }

  reviewWriter.write('\n');


  let characteristics = {};
  let numOfChars = random(1, 6);
  let available = [1, 2, 3, 4, 5, 6]
  // generate characteristics
  while (numOfChars > 0) {
    let randomIndex = random(0, available.length - 1)
    let chara = charas[available[randomIndex]];
    revCharWriter.write(revCharCount + ',' + i + ',' + available[randomIndex] + ',' + random(1, 5) + '\n');
    revCharCount++;
    available = available.slice(0, randomIndex).concat(available.slice(randomIndex + 1));
    numOfChars--;
  }

  // generate images
  let numOfImages = random(0, 5);
  for (let j = 0; j < numOfImages; j++) {
    imageWriter.write(imageCount + ',' + faker.random.image() + ',' + i + '\n');
    imageCount++;
  }


  // // console.log(reviewData);
  // const reviewDataJSON = JSON.stringify(reviewData);
  // // load reviewData into file
  // writer.write(reviewDataJSON + '\n');
}
reviewWriter.end();
revCharWriter.end();
imageWriter.end();


// helper functions
function random(start, end) {
  // not truly random, somewhat biased
  return start + Math.floor(Math.random() * (end - start + 1));
};
