const { pool } = require('../dbConfig');

// * GET REQUESTS
// ! NO GET REQUESTS ON UPVOTE CONTROLLER

// * POST REQUESTS

exports.updateVote = async (req, res) => {
  const client = await pool.connect();

  try {
    // UPDATE VOTE COUNT WITH SQL
  } catch (err) {
    // CATCH ERR AND REDIRECT
  } finally {
    client.release();
  }
};
