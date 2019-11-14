const { pool } = require('../dbConfig');
const validator = require('validator');

// * GET REQUESTS
// example route: /school/:schoolId/new
// Gets the page that allows you to post 
exports.getAddPost = (req, res) => {
  res.render('newPost', { title: `Add a new post!`, data: { schoolId: req.params.id } });
}

exports.addPost = (req, res) => {
  const schoolId = req.params.id;
  const { title, body, test } = req.body;

  if (!validator.isEmpty(title) && !validator.isEmpty(body) && validator.isEmpty(test)) {
    pool.query(`INSERT INTO posts (
      title,
      body, 
      createDate, 
      schoolId
      ) values(
        '${title}',
        '${body}',
        '${new Date().toDateString()}',
        '${schoolId}'
      ) RETURNING *`, (err, dbRes) => {
      if (err) {
        console.error(err);
        req.flash('error', `Oh no! something went wrong when creating your post!`);
        res.redirect(`/schools/${schoolId}/new`);
      } else {
        req.flash('success', `your post was made!`);
        res.redirect(`/schools/${schoolId}`);
      }
    })
  } else {
    req.flash('error', `The body of your post can't be empty, try again!`);
    res.redirect(`/schools/${schoolId}`);
  }
}
