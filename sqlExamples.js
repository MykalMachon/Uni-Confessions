const { pool } = require('./dbConfig');

// Create Schools Table example query
const createSchoolsTable = () => {
  pool.query(`CREATE TABLE schools (
      ID SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL
    );`, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.log(res);
    }
  });
}

// Create Posts Table example Query
const createPostTable = () => {
  pool.query(`CREATE TABLE posts (
      ID SERIAL PRIMARY KEY,
      title VARCHAR(128) NOT NULL,
      body VARCHAR(512) NOT NULL,
      createDate date NOT NULL,
      schoolId INTEGER NOT NULL REFERENCES schools(id)
    );`, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.log(res);
    }
  })
}

const addSchool = (name, address) => {
  pool.query(`INSERT INTO schools (name, address) values('${name}', '${address}')`, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.log(res.rows);
    }
  });
}

const getSchools = () => {
  pool.query(`SELECT * FROM schools`, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res.rows);
    }
  });
}

const emptyDatabase = () => {
  pool.query(`DELETE FROM schools`, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res.rows);
    }
  });

  pool.query(`DELETE FROM posts`, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res.rows);
    }
  });
}

exports.createDb = () => {
  createSchoolsTable();
  createPostTable();
  console.log("-- DATABASE CREATED --")
}

// createTable();
// addSchool('University of the Fraser Valley', 'King Way, Abbotsford');
// addSchool('Simon Fraser University', 'Burnaby');
// getSchools();