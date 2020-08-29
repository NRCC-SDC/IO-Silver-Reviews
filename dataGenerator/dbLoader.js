const pg = require('pg');
const lineReader = require('line-reader');

const connectionString = "postgres://noahr@localhost/bsh-rrdb";
const pgClient = new pg.Client(connectionString);
pgClient.connect();

let promises = [];
// Clear data in tables
promises.push(pgClient.query(`
TRUNCATE TABLE reviews CASCADE
`))
promises.push(pgClient.query(`
TRUNCATE TABLE chars CASCADE
`))
promises.push(pgClient.query(`
TRUNCATE TABLE images
`))
promises.push(pgClient.query(`
TRUNCATE TABLE reviews_chars
`))

// Copy Data from CSV files to database
promises.push(pgClient.query(`
COPY reviews(id,product_id,summary,body,rating,name,email,date,recommend,helpfulness,response,reported)
FROM '/Users/noahr/Documents/HRProjects/SDC-Ratings-and-Reviews/dataGenerator/generatedReviews.csv'
DELIMITER ','
CSV HEADER;
`))
promises.push(pgClient.query(`
COPY chars(id,char_name)
FROM '/Users/noahr/Documents/HRProjects/SDC-Ratings-and-Reviews/dataGenerator/generatedChars.csv'
DELIMITER ','
CSV HEADER;
`))
promises.push(pgClient.query(`
COPY images(id,url,review_id)
FROM '/Users/noahr/Documents/HRProjects/SDC-Ratings-and-Reviews/dataGenerator/generatedImages.csv'
DELIMITER ','
CSV HEADER;
`))
promises.push(pgClient.query(`
COPY reviews_chars(id,review_id,char_id,value)
FROM '/Users/noahr/Documents/HRProjects/SDC-Ratings-and-Reviews/dataGenerator/generatedRevsChars.csv'
DELIMITER ','
CSV HEADER;
`))


Promise.all(promises)
  .then(() => {
    pgClient.end();
  })
  .catch((err) => {
    console.log(err);
    pgClient.end();
  })

// lineReader.eachLine('dataGenerator/generatedReviews.txt', (line, last) => {
//   let reviewObj = JSON.parse(line);

//   let insertReview = 'INSERT INTO reviews ( product_id, summary, body, response, rating, name, email, date, recommend, reported, helpfulness ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 ) RETURNING id';

//   let reviewValues = [
//     reviewObj.product_id,
//     reviewObj.summary,
//     reviewObj.body,
//     reviewObj.response,
//     reviewObj.rating,
//     reviewObj.name,
//     reviewObj.email,
//     reviewObj.date,
//     Boolean(reviewObj.recommend),
//     reviewObj.reported,
//     reviewObj.helpfulness
//   ];

//   pgClient.query(insertReview, reviewValues)
//     .then((res) => {
//       let review_id = res.rows[0].id;
//       let insertImage = 'INSERT INTO images ( url, review_id ) VALUES ( $1, $2 )';

//       for (let i = 0; i < reviewObj.images.length; i++) {
//         let imageValues = [reviewObj.images[i], review_id];

//         pgClient.query(insertImage, imageValues);
//       }

//       let insertChar = 'INSERT INTO chars ( char_name ) VALUES ( $1 ) ON CONFLICT ( char_name ) DO UPDATE SET char_name=EXCLUDED.char_name RETURNING id';

//       for (let char in reviewObj.characteristics) {
//         pgClient.query(insertChar, [char])
//           .then((res) => {
//             let char_id = res.rows[0].id;

//             let insertCharReview = 'INSERT INTO reviews_chars ( review_id, char_id, value ) VALUES ( $1, $2, $3 )';

//             pgClient.query(insertCharReview, [review_id, char_id, reviewObj.characteristics[char]])
//           })
//       }
//     })

//   console.log(last);
//   if (last) {
//     console.log('Last Data Loaded');
//   }
// });
