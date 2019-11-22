require('dotenv').config();

const { Pool } = require('pg');
// const isProduction = process.env.NODE_ENV === 'production'
// const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
  connectionString: process.env.DB_URI,
  ssl: true,
});

const rebuildDatabase = async () => {
  await pool.query(
    `CREATE TABLE schools (
      ID SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      deviceId VARCHAR(128) NOT NULL
    );`,
    (err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.log('created table schools');
        console.log(res);
      }
    }
  );

  await pool.query(
    `CREATE TABLE posts (
      ID SERIAL PRIMARY KEY,
      title VARCHAR(128) NOT NULL,
      body VARCHAR(512) NOT NULL,
      createDate date NOT NULL,
      schoolId INTEGER NOT NULL REFERENCES schools(id),
      deviceId VARCHAR(128) NOT NULL
    );`,
    (err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.log('created table posts');
        console.log(res);
      }
    }
  );
};

const emptyDatabase = async () => {
  await pool.query(`DELETE FROM schools`, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log('deleted the entire table: schools');
    }
  });

  await pool.query(`DELETE FROM posts`, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log('deleted the entire table: posts');
    }
  });
};

const createCommentTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`CREATE TABLE Comment (
      ID SERIAL PRIMARY KEY,
      body VARCHAR(512) NOT NULL,
      createDate date NOT NULL,
      postId INTEGER NOT NULL REFERENCES posts(id),
      deviceId VARCHAR(128) NOT NULL)`);
    console.log('comment table was made');
  } catch (err) {
    console.log(err);
    console.log("couldn't create Comment table");
  } finally {
    client.release();
  }
};

module.exports = { pool, rebuildDatabase, createCommentTable };
