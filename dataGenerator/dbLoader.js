const pg = require('pg');
const moment = require('moment');

// const connectionString = "postgres://noahr@localhost/bsh-rrdb";
const connectionString = "postgres://postgres:bshreviews@3.19.55.222/bshrrdb";
const pgClient = new pg.Client(connectionString);
pgClient.connect();

let loadStart = moment();

let promises = [];

// delete tables
promises.push(pgClient.query(`
DROP TABLE IF EXISTS reviews CASCADE
`))
promises.push(pgClient.query(`
DROP TABLE IF EXISTS chars CASCADE
`))
promises.push(pgClient.query(`
DROP TABLE IF EXISTS images
`))
promises.push(pgClient.query(`
DROP TABLE IF EXISTS reviews_chars
`))

// create tables
promises.push(pgClient.query(`
CREATE TABLE reviews(
  id SERIAL PRIMARY KEY,
  product_id	 INTEGER NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  response TEXT,
  rating SMALLINT NOT NULL,
  name VARCHAR(70) NOT NULL,
  email VARCHAR(100) NOT NULL,
  date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  helpfulness INTEGER NOT NULL
);
`))
promises.push(pgClient.query(`
CREATE TABLE chars(
  id SERIAL PRIMARY KEY,
  char_name VARCHAR(10) NOT NULL
);
`))
promises.push(pgClient.query(`
CREATE TABLE reviews_chars(
  id SERIAL PRIMARY KEY,
  review_id INTEGER NOT NULL,
  char_id SMALLINT NOT NULL,
  value SMALLINT NOT NULL
);
`))
promises.push(pgClient.query(`
CREATE TABLE images(
  id SERIAL PRIMARY KEY,
  url VARCHAR(500) NOT NULL,
  review_id INTEGER NOT NULL
);
`))

// Copy Data from CSV files to tables
promises.push(pgClient.query(`
COPY reviews(id,product_id,summary,body,rating,name,email,date,recommend,helpfulness,response,reported)
FROM '${__dirname}/generatedReviews.csv'
DELIMITER ','
CSV HEADER;
`))
promises.push(pgClient.query(`
COPY chars(id,char_name)
FROM '${__dirname}/generatedChars.csv'
DELIMITER ','
CSV HEADER;
`))
promises.push(pgClient.query(`
COPY images(id,url,review_id)
FROM '${__dirname}/generatedImages.csv'
DELIMITER ','
CSV HEADER;
`))
promises.push(pgClient.query(`
COPY reviews_chars(id,review_id,char_id,value)
FROM '${__dirname}/generatedRevsChars.csv'
DELIMITER ','
CSV HEADER;
`))

// reset sequences to start at correct ids
promises.push(pgClient.query(`
SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews) + 1);
`))
promises.push(pgClient.query(`
SELECT setval('images_id_seq', (SELECT MAX(id) FROM images) + 1);
`))
promises.push(pgClient.query(`
SELECT setval('reviews_chars_id_seq', (SELECT MAX(id) FROM reviews_chars) + 1);
`))

// create foreign keys
promises.push(pgClient.query(`
ALTER TABLE images
  ADD CONSTRAINT fk_images_review_id
  FOREIGN KEY (review_id)
  REFERENCES reviews(id);
`))
promises.push(pgClient.query(`
ALTER TABLE reviews_chars
  ADD CONSTRAINT fk_reviews_chars_review_id
  FOREIGN KEY (review_id)
  REFERENCES reviews(id);
`))
promises.push(pgClient.query(`
ALTER TABLE reviews_chars
  ADD CONSTRAINT fk_reviews_chars_char_id
  FOREIGN KEY (char_id)
  REFERENCES chars(id);
`))

// Create indexes
promises.push(pgClient.query(`
CREATE INDEX reviews_product_id_index ON reviews(product_id);
`))
promises.push(pgClient.query(`
CREATE INDEX images_review_id_index ON images(review_id);
`))
promises.push(pgClient.query(`
CREATE INDEX revChars_review_id_index ON reviews_chars(review_id);
`))
promises.push(pgClient.query(`
CREATE INDEX revChars_char_id_index ON reviews_chars(char_id);
`))

Promise.all(promises)
  .then(() => {
    let loadEnd = moment();
    let loadTime = loadEnd.diff(loadStart);
    console.log('Loaded in ' + loadTime + ' milliseconds');

    pgClient.end();
  })
  .catch((err) => {
    console.log(err);
    pgClient.end();
  })

