const express = require('express');
const moment = require('moment');

const app = express();
const PORT = 3001;

app.use(express.static('public'));

app.use(express.json());

app.get('/reviews/:product_id/meta', (req, res) => {
  // console.log('get url: ', req.originalUrl);
  // console.log('params: ', req.params);

  // Replace sampleMetaRes with query to database
  res.send(sampleMetaRes);
});

app.get('/reviews/:product_id/list', (req, res) => {
  // console.log('get url: ', req.originalUrl);
  // console.log('params: ', req.params);
  // console.log('query: ', req.query);

  // Replace with query to database
  let dummyRes = JSON.parse(JSON.stringify(sampleListRes));

  // remove "reported" reviews
  dummyRes.results = dummyRes.results.filter((result) => {
    return !result.reported;
  });

  if (req.query.sort) {
    const sorter = req.query.sort || '';
    if (sorter === 'newest') {
      dummyRes.results.sort(compareDates);
    } else if (sorter === 'helpful') {
      dummyRes.results.sort((a, b) => {
        return b.helpfulness - a.helpfulness;
      })
    } else if (sorter === 'relevant') {
      // how do I sort by relevance?
      console.log('sort by relevance')
    }
  }

  let count = req.query.count || 5;
  dummyRes.count = count;
  if (dummyRes.results.length > count) {
    dummyRes.results = dummyRes.results.slice(0, count - 1);
  }

  dummyRes.results.forEach((result) => console.log(result.date));

  res.send(dummyRes);
});

app.post('/reviews/:product_id', (req, res) => {
  console.log('post url: ', req.originalUrl);
  console.log('params: ', req.params);
  console.log('body: ', req.body);

  // add body to database here

  res.statusCode = 201;
  res.send('Status: 201 CREATED');
});

app.put('/reviews/helpful/:review_id', (req, res) => {
  console.log('add helpful to review: ', req.params.review_id);

  // increment helpfulness for review_id in database

  res.statusCode = 204;
  res.send('Status: 204 NO CONTENT');
});

app.put('/reviews/report/:review_id', (req, res) => {
  console.log('report review: ', req.params.review_id);

  // set reported for review_id to true in database

  res.statusCode = 204;
  res.send('Status: 204 NO CONTENT');
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));


// Helper functions
const compareDates = (a, b) => {
  let dateA = moment(a.date);
  let dateB = moment(b.date);

  if (dateA > dateB) {
    return -1;
  } else {
    return 0;
  }

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
}

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
      "response": null,
      "body": "they match my red shirt perfectly! let's go save the princess",
      "date": "2020-08-21T00:00:00.000Z",
      "reviewer_name": "Its me! Mario",
      "helpfulness": 1,
      "photos": [
        {
          "id": 27151,
          "url": "https://pngimg.com/uploads/mario/mario_PNG88.png"
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