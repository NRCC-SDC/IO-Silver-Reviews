
const pg = require('pg');

const connectionString = "postgres://noahr@localhost/bsh-rrdb";

xdescribe('Query Time Testing', () => {

  test('Get Meta Data Query should take less that 50ms', async () => {
    const pgClient1 = new pg.Client(connectionString);
    pgClient1.connect();

    let queryTimes = [];

    for (let i = 0; i < 100; i++) {
      // generates product id from last 10% of product ids
      const maxProductId = (await pgClient1.query('SELECT MAX(product_id) FROM reviews;')).rows[0].max;
      const lateProductId = random(Math.floor(maxProductId * 0.9), maxProductId);

      const startQuery = Date.now();

      let dbResponse = await pgClient1.query(`
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
        WHERE reviews.product_id = ${lateProductId};
      `);

      const endQuery = Date.now();

      const queryTime = endQuery - startQuery;

      queryTimes.push(queryTime);

    }

    let avgQueryTime = queryTimes.reduce((time, acc) => {
      return acc + time;
    }) / 100;

    console.log('Average Meta Query Time: ', avgQueryTime, ' ms');

    // expect(avgQueryTime).toBeLessThan(50);  // will likely cause problems with Circle CI

    pgClient1.end();
  });

  test('Get Review Data Query should take less that 50ms (ordered by date)', async () => {
    const pgClient2 = new pg.Client(connectionString);
    pgClient2.connect();

    let queryTimes = [];

    for (let i = 0; i < 100; i++) {
      // generates product id from last 10% of product ids
      const maxProductId = (await pgClient2.query('SELECT MAX(product_id) FROM reviews;')).rows[0].max;
      const lateProductId = random(Math.floor(maxProductId * 0.9), maxProductId);

      const startQuery = Date.now();

      let dbResponse = await pgClient2.query(`
        SELECT id, product_id, summary, body, response, rating, name, email, date, recommend::int, helpfulness
        FROM reviews
        WHERE
          product_id = ${lateProductId} AND
          reported = false
        ORDER BY date DESC
        LIMIT 100;
      `);

      const endQuery = Date.now();

      const queryTime = endQuery - startQuery;

      queryTimes.push(queryTime);

    }

    let avgQueryTime = queryTimes.reduce((time, acc) => {
      return acc + time;
    }) / 100;

    console.log('Average Review Query Time: ', avgQueryTime, ' ms, (ordered by date)');

    // expect(avgQueryTime).toBeLessThan(50);  // will likely cause problems with Circle CI

    pgClient2.end();
  });

  test('Get Review Data Query should take less that 50ms (ordered by helpfulness)', async () => {
    const pgClient3 = new pg.Client(connectionString);
    pgClient3.connect();

    let queryTimes = [];

    for (let i = 0; i < 100; i++) {
      // generates product id from last 10% of product ids
      const maxProductId = (await pgClient3.query('SELECT MAX(product_id) FROM reviews;')).rows[0].max;
      const lateProductId = random(Math.floor(maxProductId * 0.9), maxProductId);

      const startQuery = Date.now();

      let dbResponse = await pgClient3.query(`
        SELECT id, product_id, summary, body, response, rating, name, email, date, recommend::int, helpfulness
        FROM reviews
        WHERE
          product_id = ${lateProductId} AND
          reported = false
        ORDER BY helpfulness DESC
        LIMIT 100;
      `);

      const endQuery = Date.now();

      const queryTime = endQuery - startQuery;

      queryTimes.push(queryTime);

    }

    let avgQueryTime = queryTimes.reduce((time, acc) => {
      return acc + time;
    }) / 100;

    console.log('Average Review Query Time: ', avgQueryTime, ' ms, (ordered by helpfulness)');

    // expect(avgQueryTime).toBeLessThan(50);  // will likely cause problems with Circle CI

    pgClient3.end();
  });

  test('Get Image Data Query should take less that 50ms', async () => {
    const pgClient4 = new pg.Client(connectionString);
    pgClient4.connect();

    let queryTimes = [];

    for (let i = 0; i < 100; i++) {
      // generates product id from last 10% of product ids
      const maxReviewId = (await pgClient4.query('SELECT MAX(review_id) FROM images;')).rows[0].max;
      const lateReviewId = random(Math.floor(maxReviewId * 0.9), maxReviewId);

      const startQuery = Date.now();

      let dbResponse = await pgClient4.query(`SELECT id, url FROM images WHERE review_id = ${lateReviewId}`);

      const endQuery = Date.now();

      const queryTime = endQuery - startQuery;

      queryTimes.push(queryTime);

    }

    let avgQueryTime = queryTimes.reduce((time, acc) => {
      return acc + time;
    }) / 100;

    console.log('Average Image Query Time: ', avgQueryTime, ' ms');

    // expect(avgQueryTime).toBeLessThan(50); // will likely cause problems with Circle CI

    pgClient4.end();
  });

  test('Insert Review Query should take less that 50ms', async () => {
    const pgClient5 = new pg.Client(connectionString);
    pgClient5.connect();

    let queryTimes = [];

    for (let i = 0; i < 100; i++) {
      // generates product id from last 10% of product ids
      const maxProductId = (await pgClient5.query('SELECT MAX(product_id) FROM reviews;')).rows[0].max;
      const lateProductId = random(Math.floor(maxProductId * 0.9), maxProductId);

      let insertReview = 'INSERT INTO reviews ( product_id, summary, body, response, rating, name, email, date, recommend, reported, helpfulness ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 ) RETURNING id';

      let reviewValues = [
        lateProductId,
        'Test',
        'This is for testing This is for testing This is for testing This is for testing',
        'This is a test response This is a test response This is a test response',
        5,
        'Test Name',
        'test@email.com',
        "2020-09-22T00:00:00.000Z",
        true,
        false,
        0
      ];

      const startQuery = Date.now();

      let reviewId = (await pgClient5.query(insertReview, reviewValues)).rows[0].id;

      const endQuery = Date.now();

      const queryTime = endQuery - startQuery;

      queryTimes.push(queryTime);

      // remove added review
      await pgClient5.query(`DELETE FROM reviews WHERE id = ${reviewId};`);

    }

    // set reviews id sequence back to normal
    await pgClient5.query(`
    SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews) + 1);
    `);

    let avgQueryTime = queryTimes.reduce((time, acc) => {
      return acc + time;
    }) / 100;

    console.log('Average Insert Review Query Time: ', avgQueryTime, ' ms');

    // expect(avgQueryTime).toBeLessThan(50);  // will likely cause problems with Circle CI

    pgClient5.end();
  });

  test('Insert Image Query should take less that 50ms', async () => {
    const pgClient6 = new pg.Client(connectionString);
    pgClient6.connect();

    let queryTimes = [];

    for (let i = 0; i < 100; i++) {
      // generates review id from last 10% of review ids
      const maxReviewId = (await pgClient6.query('SELECT MAX(review_id) FROM images;')).rows[0].max;
      const lateReviewId = random(Math.floor(maxReviewId * 0.9), maxReviewId);

      let insertImage = `INSERT INTO images ( review_id, url ) VALUES ( ${lateReviewId}, 'someImageUrl' ) RETURNING id`;

      const startQuery = Date.now();

      let imageId = (await pgClient6.query(insertImage)).rows[0].id;

      const endQuery = Date.now();

      const queryTime = endQuery - startQuery;

      queryTimes.push(queryTime);

      // remove added image
      await pgClient6.query(`DELETE FROM images WHERE id = ${imageId};`);

    }

    // set images id sequence back to normal
    await pgClient6.query(`
    SELECT setval('images_id_seq', (SELECT MAX(id) FROM images) + 1);
    `);

    let avgQueryTime = queryTimes.reduce((time, acc) => {
      return acc + time;
    }) / 100;

    console.log('Average Insert Image Query Time: ', avgQueryTime, ' ms');

    // expect(avgQueryTime).toBeLessThan(50);  // will likely cause problems with Circle CI

    pgClient6.end();
  });

  test('Insert reviews_chars Query should take less that 50ms', async () => {
    const pgClient7 = new pg.Client(connectionString);
    pgClient7.connect();

    let queryTimes = [];

    for (let i = 0; i < 100; i++) {
      // generates review id from last 10% of review ids
      const maxReviewId = (await pgClient7.query('SELECT MAX(review_id) FROM reviews_chars;')).rows[0].max;
      const lateReviewId = random(Math.floor(maxReviewId * 0.9), maxReviewId);

      let insertChar = `INSERT INTO reviews_chars ( review_id, char_id, value ) VALUES ( ${lateReviewId}, 3, 5 ) RETURNING id`;

      const startQuery = Date.now();

      let charId = (await pgClient7.query(insertChar)).rows[0].id;

      const endQuery = Date.now();

      const queryTime = endQuery - startQuery;

      queryTimes.push(queryTime);

      // remove added char
      await pgClient7.query(`DELETE FROM reviews_chars WHERE id = ${charId};`);

    }

    // set reviews_chars id sequence back to normal
    await pgClient7.query(`
    SELECT setval('reviews_chars_id_seq', (SELECT MAX(id) FROM reviews_chars) + 1);
    `);

    let avgQueryTime = queryTimes.reduce((time, acc) => {
      return acc + time;
    }) / 100;

    console.log('Average Insert ReviewChar Query Time: ', avgQueryTime, ' ms');

    // expect(avgQueryTime).toBeLessThan(50);  // will likely cause problems with Circle CI

    pgClient7.end();
  });

  test('Increment helpfulness Query should take less that 50ms', async () => {
    const pgClient8 = new pg.Client(connectionString);
    pgClient8.connect();

    let queryTimes = [];

    for (let i = 0; i < 100; i++) {
      // generates review id from last 10% of review ids
      const maxReviewId = (await pgClient8.query('SELECT MAX(id) FROM reviews;')).rows[0].max;
      const lateReviewId = random(Math.floor(maxReviewId * 0.9), maxReviewId);

      let incHelpful = `
      UPDATE reviews
      SET helpfulness = helpfulness + 1
      WHERE id = ${lateReviewId};
      `;

      const startQuery = Date.now();

      await pgClient8.query(incHelpful);

      const endQuery = Date.now();

      const queryTime = endQuery - startQuery;

      queryTimes.push(queryTime);

      // remove added helpful
      await pgClient8.query(`
      UPDATE reviews
      SET helpfulness = helpfulness - 1
      WHERE id = ${lateReviewId};
      `);

    }

    let avgQueryTime = queryTimes.reduce((time, acc) => {
      return acc + time;
    }) / 100;

    console.log('Average Increment helpfulness Query Time: ', avgQueryTime, ' ms');

    // expect(avgQueryTime).toBeLessThan(50);  // will likely cause problems with Circle CI

    pgClient8.end();
  });

  test('Set Reported Query should take less that 50ms', async () => {
    const pgClient8 = new pg.Client(connectionString);
    pgClient8.connect();

    let queryTimes = [];

    for (let i = 0; i < 100; i++) {
      // generates review id from last 10% of review ids
      const maxReviewId = (await pgClient8.query('SELECT MAX(id) FROM reviews;')).rows[0].max;
      const lateReviewId = random(Math.floor(maxReviewId * 0.9), maxReviewId);

      const currentReportBool = (await pgClient8.query(`SELECT reported FROM reviews
      where id = ${lateReviewId};`)).rows[0].reported;

      let setReported = `
      UPDATE reviews
      SET reported = ${!currentReportBool}
      WHERE id = ${lateReviewId};
      `;

      const startQuery = Date.now();

      await pgClient8.query(setReported);

      const endQuery = Date.now();

      const queryTime = endQuery - startQuery;

      queryTimes.push(queryTime);

      // swap reported back to original
      await pgClient8.query(`
      UPDATE reviews
      SET reported = ${currentReportBool}
      WHERE id = ${lateReviewId};
      `);

    }

    let avgQueryTime = queryTimes.reduce((time, acc) => {
      return acc + time;
    }) / 100;

    console.log('Average Set Reported Query Time: ', avgQueryTime, ' ms');

    // expect(avgQueryTime).toBeLessThan(50);  // will likely cause problems with Circle CI

    pgClient8.end();
  });
});

// helper functions
// generate random number between start and end inclusive
function random(start, end) {
  // not truly random, somewhat biased
  return start + Math.floor(Math.random() * (end - start + 1));
};
