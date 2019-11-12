// * GET REQUESTS

const { pool } = require('../dbConfig');
const validator = require('validator');

exports.getSchools = (req, res) => {
  pool.query(`SELECT * FROM schools`, (err, dbRes) => {
    if (err) {
      console.log(err);
      res.status = 500;
      res.send();
    } else {
      res.render('schools', { schoolData: dbRes.rows, title: "Schools" });
    }
  });
};

exports.getSchool = (req, res) => {
  pool.query(`SELECT * FROM schools WHERE id='${req.params.id}'`, (err, dbRes) => {
    if (err) {
      console.log(err);
      res.status = 500;
      res.send();
    } else {
      res.render('school', { schoolData: dbRes.rows[0], title: dbRes.rows[0].name });
    }
  })
}

exports.getAddSchool = (req, res) => {
  res.render('newSchool', { title: `Add a new school!` });
}

// * POST REQUESTS

// ! This should be accessible through the API only and should be secured with token auth
exports.addSchool = (req, res) => {
  const { name, address } = req.body;

  if (!validator.isEmpty(name) && !validator.isEmpty(address)) {
    // sanitize dom content using domPurify?
    pool.query(`INSERT INTO schools (name, address) values('${name}', '${address}') RETURNING id`, (err, dbRes) => {
      if (err) {
        req.flash('error', `Oh no! something went wrong when creating your school!`);
        res.redirect('/schools/new');
      } else {
        const newId = dbRes.id;
        req.flash('success', `${name} was added successfully! make a post?`);
        res.redirect(`/schools/${newId}`);
      }
    })
  } else {
    req.flash('error', `Some of the data entered was invalid`);
    res.redirect('/schools/new');
  }
};
