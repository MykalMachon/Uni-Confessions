require('dotenv').config();

const { Pool } = require('pg');
// const isProduction = process.env.NODE_ENV === 'production'
// const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
  connectionString: process.env.DB_URI,
  ssl: true,
});

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

const buildDatabaseStruct = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
    CREATE TABLE School (
      ID SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      deviceId VARCHAR(128) NOT NULL)`);
    console.log(`School table was created...`);

    await client.query(`
    CREATE TABLE VoteCount (
      ID SERIAL PRIMARY KEY,
      count INTEGER DEFAULT 0)`);
    console.log(`VoteCount table was created...`);

    await client.query(`
    CREATE TABLE Post(
      ID SERIAL PRIMARY KEY,
      title VARCHAR(128) NOT NULL,
      body VARCHAR(512) NOT NULL,
      createDate date NOT NULL,
      voteCount INTEGER NOT NULL REFERENCES VoteCount(id),
      schoolId INTEGER NOT NULL REFERENCES School(id),
      deviceId VARCHAR(128) NOT NULL)`);
    console.log(`Post table was created...`);

    await client.query(`CREATE TABLE Comment(
      ID SERIAL PRIMARY KEY,
      body VARCHAR(255) NOT NULL,
      createDate date NOT NULL,
      voteCount INTEGER NOT NULL REFERENCES VoteCount(id),
      postId INTEGER NOT NULL REFERENCES Post(id),
      deviceId VARCHAR(128) NOT NULL)`);
    console.log(`Comment table was created`);
  } catch (err) {
    console.log(err);
    console.log("couldn't create all tables");
  } finally {
    client.release();
  }
};

module.exports = { pool, buildDatabaseStruct };
