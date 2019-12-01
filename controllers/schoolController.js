// importing the pool object which is used to connect to our SQL database
const { pool } = require('../dbConfig');
// importing a package that handles input validation
const validator = require('validator');

// * GET REQUESTS

/**
 * getSchools
 *
 * gets all schools and passes them into the schools.liquid view to be
 * rendered on the client.
 */
exports.getSchools = async (req, res) => {
  const client = await pool.connect();
  try {
    const dbRes = await client.query(`SELECT * FROM School`);
    res.render('schools', { schoolData: dbRes.rows, title: 'Schools' });
  } catch (err) {
    console.log(err);
    res.status = 500;
    res.send();
  } finally {
    client.release();
  }
};

/**
 * getSchool
 *
 * gets all data relevant to a school forum page and passes it into the
 * school.liquid view (this includes school metadata and comments)
 */
exports.getSchool = async (req, res) => {
  const client = await pool.connect();

  const schooDataQuery = `
  SELECT name, address, id
  FROM School
  WHERE id=${req.params.id}
  `;

  const postDataQuery = `
  SELECT p.id, p.title, p.body, p.createDate, v.count as voteCount, v.id as voteId, p.deviceId
  FROM Post as p, VoteCount as v
  WHERE p.schoolId=${req.params.id} AND p.voteCount=v.id 
  ORDER BY v.count DESC
  `;
  try {
    const schoolData = await client.query(schooDataQuery);
    const decodedSchoolData = {
      id: schoolData.rows[0].id,
      name: schoolData.rows[0].name,
      address: schoolData.rows[0].address,
    };

    const postData = await client.query(postDataQuery);
    const decodedPostData = postData.rows.map((row) => {
      row.id = row.id;
      row.title = validator.unescape(row.title);
      row.body = validator.unescape(row.body);
      row.canDeletePost = req.cookies.deviceId == row.deviceid ? true : false;
      return row;
    });

    res.render('school', {
      title: decodedSchoolData.name,
      schoolData: decodedSchoolData,
      postData: decodedPostData,
    });
  } catch (err) {
    console.log(err);
    res.status = 500;
    res.send();
  } finally {
    client.release();
  }
};

/**
 * getAddSchool
 *
 * renders the view containing the add school form (newSchool.liquid)
 */
exports.getAddSchool = (req, res) => {
  res.render('newSchool', { title: `Add a new school!` });
};

// * POST REQUESTS

/**
 * addSchool
 *
 * handles and validates a post request made to the server and
 */
exports.addSchool = async (req, res) => {
  const { name, address, test } = req.body;

  if (
    !validator.isEmpty(name) &&
    !validator.isEmpty(address) &&
    validator.isEmpty(test)
  ) {
    const client = await pool.connect();
    try {
      const dbRes = await client.query(
        `INSERT INTO School (name, address, deviceId) values('${name}', '${address}', '${req.cookies.deviceId}') RETURNING *`
      );
      req.flash('success', `${name} was added successfully! make a post?`);
      res.redirect(`/schools/${dbRes.rows[0].id}`);
    } catch (err) {
      req.flash(
        'error',
        `Oh no! something went wrong when creating your school!`
      );
      res.redirect('/schools/new');
    } finally {
      client.release();
    }
  } else {
    req.flash('error', `Some of the data entered was invalid, try again!`);
    res.redirect('/schools/new');
  }
};
