const { pool } = require('../dbConfig');
const validator = require('validator');

// * GET REQUESTS
// ! na

// * POST REQUESTS

exports.addComment = async (req, res) => {
  const { body } = req.body;
  const { postId } = req.params;
  const deviceId = req.cookies.deviceId;

  const client = await pool.connect();
  if (!validator.isEmpty(body)) {
    try {
      const commentInsertQuery = `
        INSERT INTO Comment (body, createDate, postId, deviceId)
        VALUES (
          '${validator.escape(body.trim())}',
          '${new Date().toDateString()}',
          '${postId}',
          '${deviceId}'
      )`;
      await client.query(commentInsertQuery);
      req.flash('success', 'Your comment was made!');
      res.redirect('back');
    } catch (err) {
      req.flash(
        'error',
        'Oh no! Something went wrong when creating your comment!'
      );
      res.redirect('back');
    } finally {
      client.release();
    }
  } else {
    req.flash('error', 'Some of the data entered was invalid, try again!');
    res.redirect('back');
  }
};
