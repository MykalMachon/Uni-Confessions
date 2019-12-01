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
    SELECT p.id, p.title, p.body, p.createDate, v.id as voteId, v.count, p.deviceId
    FROM Post as p, VoteCount as v
    WHERE p.id=${postId} and v.id = p.voteCount 
    `;

    const postData = await client.query(postDataQuery);
    const decodedPostData = {
      id: postData.rows[0].id,
      title: validator.unescape(postData.rows[0].title),
      body: validator.unescape(postData.rows[0].body),
      createDate: postData.rows[0].createdate,
      canDeletePost:
        req.cookies.deviceId == postData.rows[0].deviceid ? true : false,
      votes: postData.rows[0].count,
      voteId: postData.rows[0].voteid,
    };

    const commentDataQuery = `
    SELECT c.id, c.body, c.createDate, c.deviceId, v.id as voteId, v.count
    FROM Comment as c, VoteCount as v
    WHERE postId=${postId} and v.id = c.voteCount
    ORDER BY v.count DESC
    `;

    const commentData = await client.query(commentDataQuery);
    const decodedCommentData = commentData.rows.map((comment) => {
      comment.body = validator.unescape(comment.body);
      comment.canDeleteComment =
        req.cookies.deviceId == comment.deviceid ? true : false;
      return comment;
    });

    res.render('post', {
      postData: decodedPostData,
      commentData: decodedCommentData,
      schoolData: { id: schoolId },
      title: decodedPostData.title,
    });
  } catch (err) {
    console.log(err);
    res.redirect(`/schools/${schoolId}`);
  } finally {
    client.release();
  }
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
      const newUpvoteCount = await client.query(
        `INSERT INTO VoteCount (count) VALUES ('0') RETURNING ID`
      );
      console.log(`New Upvote Count ID : ${newUpvoteCount.rows[0].id}`);
      await client.query(`INSERT INTO Post (title, body, createDate, voteCount, schoolId, deviceId) values (
        '${validator.escape(title.trim())}',
        '${validator.escape(body.trim())}',
        '${new Date().toDateString()}',
        '${newUpvoteCount.rows[0].id}',
        '${schoolId}',
        '${req.cookies.deviceId}'
        )`);
      req.flash('success', `Your post was made!`);
      res.redirect(`/schools/${schoolId}`);
    } catch (err) {
      console.log(err);
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

exports.removePost = async (req, res) => {
  res.json({
    works: 'it does!',
  });
};
