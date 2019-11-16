// * GET REQUESTS

const { pool } = require('../dbConfig');
const validator = require('validator');

exports.getSchools = async (req, res) => {
  const client = await pool.connect();
  try {
    const dbRes = await client.query(`SELECT * FROM schools`);
    res.render('schools', { schoolData: dbRes.rows, title: "Schools" });
  } catch (err) {
    console.log(err);
    res.status = 500;
    res.send();
  } finally {
    client.release();
  }
};

exports.getSchool = async (req, res) => {
  const schoolPostsQuery = `
  SELECT posts.title, posts.body, posts.createDate, schools.name, schools.address, schools.id
  FROM posts, schools
  WHERE posts.schoolId=${req.params.id} AND posts.schoolId=schools.id
  `;
  const client = await pool.connect();
  try {
    const dbRes = await client.query(schoolPostsQuery);
    const decodedPostRows = dbRes.rows.map((row) => {
      row.title = validator.unescape(row.title);
      row.body = validator.unescape(row.body);
      return row;
    })
    const schoolData = {
      id: dbRes.rows[0].id,
      name: dbRes.rows[0].name,
      address: dbRes.rows[0].address
    }
    res.render('school', {
      schoolData,
      title: dbRes.rows[0].name,
      postData: decodedPostRows
    });
  } catch (err) {
    console.log(err);
    res.status = 500;
    res.send();
  } finally {
    client.release();
  }
}

exports.getAddSchool = (req, res) => {
  res.render('newSchool', { title: `Add a new school!` });
}

// * POST REQUESTS

exports.addSchool = async (req, res) => {
  const { name, address, test } = req.body;

  if (!validator.isEmpty(name) && !validator.isEmpty(address) && validator.isEmpty(test)) {
    try {
      const client = await pool.connect();
      const dbRes = await client.query(`INSERT INTO schools (name, address) values('${name}', '${address}') RETURNING *`);
      req.flash('success', `${name} was added successfully! make a post?`);
      res.redirect(`/schools/${dbRes.rows[0].id}`);
    } catch (err) {
      req.flash('error', `Oh no! something went wrong when creating your school!`);
      res.redirect('/schools/new');
    } finally {
      client.release();
    }
  } else {
    req.flash('error', `Some of the data entered was invalid, try again!`);
    res.redirect('/schools/new');
  }
};
