
const lineReader = require('line-reader');

let reviews = [];

lineReader.eachLine('dataGenerator/generatedReviews.txt', (line, last) => {
  // instead of pushing, I will be loading into database
  reviews.push(JSON.parse(line));

  if (last) {
    console.log('DataBase Loading Complete!');
  }
});

