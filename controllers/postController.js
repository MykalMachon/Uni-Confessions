const { pool } = require('../dbConfig');
const validator = require('validator');

// * GET REQUESTS
exports.getAddPost = (req, res) => {
  res.render('newPost', {
    title: `Add a new post!`,
    data: { schoolId: req.params.id },
  });
};

exports.getPostPage = async (req, res) => {
  const schoolId = req.params.id;
  const postId = req.params.postId;

  const client = await pool.connect();
  try {
    const postDataQuery = `
    SELECT title, body, createDate, deviceId
    FROM posts
    WHERE id=${postId} 
    `;
    const postData = await client.query(postDataQuery);
    const decodedPostData = {
      id: postData.rows[0].id,
      title: validator.unescape(postData.rows[0].title),
      body: validator.unescape(postData.rows[0].body),
      createDate: postData.rows[0].createDate,
    };
    res.render('post', {
      postData: decodedPostData,
      schoolData: { id: schoolId, },
      title: decodedPostData.title,
    });
  } catch (err) {
    res.redirect(`/schools/${schoolId}`);
  } finally {
    client.release();
  }
  // Get Post Data
  // Get Post Comments
  // Render Post Page with Post Data
};

// * POST REQUESTS
exports.addPost = async (req, res) => {
  const schoolId = req.params.id;
  const { title, body, test } = req.body;

  if (
    !validator.isEmpty(title) &&
    !validator.isEmpty(body) &&
    validator.isEmpty(test)
  ) {
    const client = await pool.connect();
    try {
      const dbRes = await client.query(`INSERT INTO posts (title, body, createDate, schoolId, deviceId) values (
        '${validator.escape(title.trim())}',
        '${validator.escape(body.trim())}',
        '${new Date().toDateString()}',
        '${schoolId}',
        '${req.cookies.deviceId}'
        )`);
      req.flash('success', `Your post was made!`);
      res.redirect(`/schools/${schoolId}`);
    } catch (err) {
      req.flash(
        'error',
        `Oh no! something went wrong when creating your post!`
      );
      res.redirect(`/schools/${schoolId}/new`);
    } finally {
      client.release();
    }
  } else {
    req.flash('error', `Some of the data entered was invalid, try again!`);
    res.redirect(`/schools/${schoolId}/new`);
  }
};
