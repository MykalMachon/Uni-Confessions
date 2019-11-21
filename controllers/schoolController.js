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
  //! IMPLEMENT BUGFIX : When School is first created and has 0 posts, this query doesn't get school data. MUST FIX
  const schooDataQuery = `
  SELECT name, address, id
  FROM schools
  WHERE id=${req.params.id}
  `;
  const postDataQuery = `
  SELECT posts.title, posts.body, posts.createDate
  FROM posts
  WHERE schoolId=${req.params.id}
  `;
  const client = await pool.connect();
  try {
    const schoolData = await client.query(schooDataQuery);
    const postData = await client.query(postDataQuery);
    const decodedPostData = postData.rows.map((row) => {
      row.title = validator.unescape(row.title);
      row.body = validator.unescape(row.body);
      return row;
    })
    const decodedSchoolData = {
      id: schoolData.rows[0].id,
      name: schoolData.rows[0].name,
      address: schoolData.rows[0].address
    }
    res.render('school', {
      title: decodedSchoolData.name,
      schoolData: decodedSchoolData,
      postData: decodedPostData
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
    const client = await pool.connect();
    try {
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
