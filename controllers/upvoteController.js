const { pool } = require('../dbConfig');

// * GET REQUESTS
// ! NO GET REQUESTS ON UPVOTE CONTROLLER

// * POST REQUESTS

exports.updateVote = async (req, res) => {
  const { voteId, action } = req.body;

  const client = await pool.connect();

  try {
    // UPDATE VOTE COUNT WITH SQL
    if (action === 'upvote') {
      await client.query(
        `UPDATE VoteCount SET count = count + 1 WHERE id=${voteId}`
      );
    } else if (action === 'downvote') {
      await client.query(
        `UPDATE VoteCount SET count = count - 1 WHERE id=${voteId}`
      );
    } else {
      throw new Error(
        'Invalid action on vote (should be either upvote or downvote'
      );
    }
  } catch (err) {
    // CATCH ERR AND REDIRECT
    req.flash('error', 'Something went wrong, try again later');
  } finally {
    client.release();
    res.redirect('back');
  }
};
