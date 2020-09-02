require('newrelic');
const express = require('express');
const moment = require('moment');

const pg = require('pg');

const connectionString = "postgres://noahr@localhost/bsh-rrdb";
const pgClient = new pg.Client(connectionString);
pgClient.connect();

const app = express();
const PORT = 3001;

app.use(express.static('public'));

app.use(express.json());

app.get('/reviews/:product_id/meta', async (req, res) => {

  // let startQuery = moment();

  let metaQuery = `
  SELECT
    reviews_chars.review_id,
    reviews.rating,
    reviews.recommend,
    reviews_chars.char_id,
    chars.char_name,
    reviews_chars.value
  FROM
    reviews
    INNER JOIN reviews_chars ON reviews.id = reviews_chars.review_id
    INNER JOIN chars ON reviews_chars.char_id = chars.id
    WHERE reviews.product_id = $1
  `;

  let dbResponse = await pgClient.query(metaQuery, [req.params.product_id]);

  let metaResData = { product_id: req.params.product_id };

  metaResData.ratings = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
  metaResData.recommended = { '0': 0, '1': 0 };

  // add ratings and recommended
  let ratedReviews = {};
  for (let i = 0; i < dbResponse.rows.length; i++) {
    if (ratedReviews[dbResponse.rows[i].review_id] === undefined) {
      let rowRating = dbResponse.rows[i].rating.toString();

      metaResData.ratings[rowRating]++;

      if (dbResponse.rows[i].recommend) {
        metaResData.recommended['1']++;
      } else {
        metaResData.recommended['0']++;
      }

      ratedReviews[dbResponse.rows[i].review_id] = true;
    }
  }

  let characteristics = {};
  for (let i = 0; i < dbResponse.rows.length; i++) {
    let currentRow = dbResponse.rows[i];
    if (characteristics[currentRow.char_name] === undefined) {
      characteristics[currentRow.char_name] = { id: currentRow.char_id, value: currentRow.value, count: 1 };
    } else {
      characteristics[currentRow.char_name].value += currentRow.value;
      characteristics[currentRow.char_name].count++;
    }
  }

  for (let char in characteristics) {
    characteristics[char].value = characteristics[char].value / characteristics[char].count;
    delete characteristics[char].count;
  }

  metaResData.characteristics = characteristics;

  // let responseReady = moment();
  // console.log('Meta Query for product_id ' + req.params.product_id + ' took ' + responseReady.diff(startQuery) + ' milliseconds');

  res.send(metaResData);
});

app.get('/reviews/:product_id/list', async (req, res) => {
  // let startQuery = Date.now();

  let count = req.query.count || 5;

  let sortBy = 'date';
  if (req.query.sort !== 'newest') {
    sortBy = 'helpfulness';
  }

  let dbResponse = await pgClient.query(`
    SELECT id, product_id, summary, body, response, rating, name, email, date, recommend::int, helpfulness
    FROM reviews
    WHERE
      product_id = $1 AND
      reported = false
    ORDER BY ${sortBy} DESC
    LIMIT $2;
  `, [req.params.product_id, count]);

  let responseData = { product_id: req.params.product_id };
  responseData.results = dbResponse.rows;

  // get and add image urls
  for (let i = 0; i < responseData.results.length; i++) {
    let dbImageResponse = await pgClient.query('SELECT id, url FROM images WHERE review_id = $1', [responseData.results[i].id]);
    responseData.results[i].photos = dbImageResponse.rows;
  }

  // let responseReady = Date.now();
  // console.log('Reviews Query for product_id ' + req.params.product_id + ' took ' + (responseReady - startQuery) + ' milliseconds');

  res.send(responseData);
});

app.post('/reviews/:product_id', async (req, res) => {

  // let startQuery = Date.now();

  let date = moment().format("YYYY[-]MM[-]DD[T]HH:mm:ss.SSS[Z]");

  // add body, date, and reported: false to database here
  let insertReview = 'INSERT INTO reviews ( product_id, summary, body, response, rating, name, email, date, recommend, reported, helpfulness ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 ) RETURNING id';

  let reviewValues = [
    req.params.product_id,
    req.body.summary,
    req.body.body,
    req.body.response,
    req.body.rating,
    req.body.name,
    req.body.email,
    date,
    Boolean(req.body.recommend),
    false, // reported initially false
    0 // helpfulness initially 0
  ];

  let insertResponse = await pgClient.query(insertReview, reviewValues);

  let reviewId = insertResponse.rows[0].id;

  let promises = [];

  let chars = ['Size', 'Width', 'Comfort', 'Quality', 'Length', 'Fit'];
  let characteristics = req.body.characteristics;
  for (let j = 0; j < chars.length; j++) {
    if (characteristics[chars[j]]) {
      promises.push(pgClient.query('INSERT INTO reviews_chars ( review_id, char_id, value ) VALUES ( $1, $2, $3 )', [reviewId, (j + 1), characteristics[chars[j]]]));
    }
  }

  let images = req.body.photos;
  for (let x = 0; x < images.length; x++) {
    promises.push(pgClient.query('INSERT INTO images ( review_id, url ) VALUES ( $1, $2 )', [reviewId, images[x]]));
  }

  Promise.all(promises)
    .then(() => {
      // console.log('Created review #' + reviewId + ' in ' + (Date.now() - startQuery) + ' milliseconds');
      res.statusCode = 201;
      res.send();
    })
    .catch((err) => {
      console.log(err);
      res.statusCode = 500;
      res.send();
    })

});

app.put('/reviews/helpful/:review_id', (req, res) => {
  // let startQuery = moment();
  // increment helpfulness for review_id in database
  pgClient.query(`
  UPDATE reviews
  SET helpfulness = helpfulness + 1
  WHERE id = $1;
  `, [req.params.review_id])
    .then(() => {
      // let endQuery = moment();
      // console.log('Incremented helpful for review: ' + req.params.review_id + ' in ' + endQuery.diff(startQuery) + ' ms');
      res.statusCode = 204;
      res.send();
    })
    .catch((err) => {
      console.log(err);
      res.statusCode = 500;
      res.send();
    })
});

app.put('/reviews/report/:review_id', (req, res) => {
  // let startQuery = moment();

  // set reported for review_id to true in database
  pgClient.query(`
    UPDATE reviews
    SET reported = true
    WHERE id = $1;
  `, [req.params.review_id])
    .then(() => {
      // let endQuery = moment();
      // console.log('Reported review: ' + req.params.review_id + ' in ' + endQuery.diff(startQuery) + ' ms');
      res.statusCode = 204;
      res.send();
    })
    .catch((err) => {
      console.log(err);
      res.statusCode = 500;
      res.send();
    })
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));


// // Helper functions
// // code not necessary anymore, sorting done in query
// const compareDates = (a, b) => {
//   let dateA = moment(a.date);
//   let dateB = moment(b.date);

//   if (dateA > dateB) {
//     return -1;
//   } else {
//     return 0;
//   }

  // old code that works, but is confusing
  // const aYear = Number(a.date.slice(0, 4));
  // const bYear = Number(b.date.slice(0, 4));

  // if (aYear > bYear) {
  //   return -1;
  // } else if (aYear === bYear) {
  //   const aMonth = Number(a.date.slice(5, 7));
  //   const bMonth = Number(b.date.slice(5, 7));

  //   if (aMonth > bMonth) {
  //     return -1;
  //   } else if (aMonth === bMonth) {
  //     const aDay = Number(a.date.slice(8, 10));
  //     const bDay = Number(b.date.slice(8, 10));

  //     if (aDay > bDay) {
  //       return -1;
  //     } else if (aDay === bDay) {
  //       const aHour = Number(a.date.slice(12, 14));
  //       const bHour = Number(b.date.slice(12, 14));

  //       if (aHour > bHour) {
  //         return -1;
  //       } else if (aHour === bHour) {
  //         const aMin = Number(a.date.slice(15, 17));
  //         const bMin = Number(b.date.slice(15, 17));

  //         if (aMin > bMin) {
  //           return -1;
  //         } else if (aMin === bMin) {
  //           const aSec = Number(a.date.slice(18, 24));
  //           const bSec = Number(b.date.slice(18, 24));

  //           if (aSec > bSec) {
  //             return -1;
  //           } else if (aSec === bSec) {
  //             return 0;
  //           } else {
  //             return 1;
  //           }

  //         } else {
  //           return 1;
  //         }

  //       } else {
  //         return 1;
  //       }

  //     } else {
  //       return 1;
  //     }

  //   } else {
  //     return 1;
  //   }

  // } else {
  //   return 1;
  // }
// }

// sample data
const sampleMetaRes = {
  "product_id": "24",
  "ratings": {
    "1": 2,
    "2": 2,
    "4": 4,
    "5": 14
  },
  "recommended": {
    "0": 3,
    "1": 19
  },
  "characteristics": {
    "Fit": {
      "id": 78,
      "value": "3.7368"
    },
    "Length": {
      "id": 79,
      "value": "3.7895"
    },
    "Comfort": {
      "id": 80,
      "value": "4.0000"
    },
    "Quality": {
      "id": 81,
      "value": "3.8421"
    }
  }
}


const sampleListRes = {
  "product": "24",
  "page": 0,
  "count": 100,
  "results": [
    {
      "review_id": 57454,
      "reported": false,
      "rating": 5,
      "summary": "TEST",
      "recommend": 1,
      "response": null,
      "body": "ETSTLEKSJTLKJSELKTJLKSEJLKJLKJTL:KSJLKTJLKSEJTLKSJL:KJLK",
      "date": "2020-08-26T00:00:00.000Z",
      "reviewer_name": "TEST",
      "helpfulness": 4,
      "photos": []
    },
    {
      "review_id": 57455,
      "reported": false,
      "rating": 5,
      "summary": "pretttyyyyyyyyyy good",
      "recommend": 0,
      "response": null,
      "body": "50 characters?????????????????????/???????????????",
      "date": "2019-08-22T00:00:00.000Z",
      "reviewer_name": "yes",
      "helpfulness": 0,
      "photos": []
    },
    {
      "review_id": 57457,
      "reported": false,
      "rating": 1,
      "summary": "sgsdfgsdfg",
      "recommend": 1,
      "response": null,
      "body": "sdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgadfg",
      "date": "2020-08-22T00:00:00.000Z",
      "reviewer_name": "new review ",
      "helpfulness": 0,
      "photos": []
    },
    {
      "review_id": 57458,
      "reported": false,
      "rating": 5,
      "summary": "These overalls are the best!!! ",
      "recommend": 1,
      "response": "Glad you liked them!",
      "body": "they match my red shirt perfectly! let's go save the princess",
      "date": "2020-08-21T00:00:00.000Z",
      "reviewer_name": "Its me! Mario",
      "helpfulness": 1,
      "photos": [
        {
          "id": 27151,
          "url": "https://pngimg.com/uploads/mario/mario_PNG88.png"
        },
        {
          "id": 27158,
          "url": "https://supermariorun.com/assets/img/hero/hero_chara_mario_update_pc.png"
        }
      ]
    },
    {
      "review_id": 57459,
      "reported": false,
      "rating": 4,
      "summary": "these overalls are too short!!! maybe I am just too tall. ",
      "recommend": 1,
      "response": null,
      "body": "these overalls are too short!!! maybe I am just too tall. Mario, you can wear these",
      "date": "2020-09-22T00:00:00.000Z",
      "reviewer_name": "Luigi",
      "helpfulness": 2,
      "photos": [
        {
          "id": 27152,
          "url": "https://toppng.com/uploads/preview/luigi-nsmbod-super-mario-luigi-11563054900re9hy0bndm.png"
        }
      ]
    },
    {
      "review_id": 57460,
      "reported": true,
      "rating": 4,
      "summary": "these overalls are too short!!! maybe I am just too tall. ",
      "recommend": 1,
      "response": null,
      "body": "these overalls are too short!!! maybe I am just too tall. Mario, you can wear these",
      "date": "2020-08-22T00:00:00.000Z",
      "reviewer_name": "Luigi",
      "helpfulness": 0,
      "photos": [
        {
          "id": 27153,
          "url": "https://toppng.com/uploads/preview/luigi-nsmbod-super-mario-luigi-11563054900re9hy0bndm.png"
        }
      ]
    }
  ]
}