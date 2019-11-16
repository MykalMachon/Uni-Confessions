const { pool } = require('../dbConfig');
const validator = require('validator');

// * GET REQUESTS
// example route: /school/:schoolId/new
// Gets the page that allows you to post 
exports.getAddPost = (req, res) => {
  res.render('newPost', { title: `Add a new post!`, data: { schoolId: req.params.id } });
}

exports.addPost = async (req, res) => {
  const schoolId = req.params.id;
  const { title, body, test } = req.body;

  if (!validator.isEmpty(title) && !validator.isEmpty(body) && validator.isEmpty(test)) {
    const client = await pool.connect();
    try {
      const dbRes = await client.query(`INSERT INTO posts (title, body, createDate, schoolId) values (
        '${validator.escape(title.trim())}',
        '${validator.escape(body.trim())}',
        '${new Date().toDateString()}',
        '${schoolId}')`);
      req.flash('success', `Your post was made!`);
      res.redirect(`/schools/${schoolId}`);
    } catch (err) {
      req.flash('error', `Oh no! something went wrong when creating your post!`);
      res.redirect(`/schools/${schoolId}/new`);
    } finally {
      client.release();
    }
  } else {
    req.flash('error', `The body of your post can't be empty, try again!`);
    res.redirect(`/schools/${schoolId}`);
  }
}
