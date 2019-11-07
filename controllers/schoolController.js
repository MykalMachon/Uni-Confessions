// * GET REQUESTS

const { pool } = require('../dbConfig');

exports.getSchools = (req, res) => {
  pool.query(`SELECT * FROM schools`, (err, dbRes) => {
    if (err) {
      console.log(err);
      res.status = 500;
      res.send();
    } else {
      console.log(dbRes.rows);
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

// * POST REQUESTS

// ! This should be accessible through the API only and should be secured with token auth
exports.addSchool = (req, res) => {

  // TODO extract and sanitize school data
  // TODO Insert school data into the DB
  // TODO Return the ID of the school
};
