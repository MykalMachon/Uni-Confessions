var express = require('express');
var router = express.Router();

const schoolController = require('../controllers/schoolController');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const upvtoteController = require('../controllers/upvoteController');

// Get the home page
router.get('/', (req, res, next) => {
  res.render('index', { title: 'UFV Confessions' });
});
// Get School pages
router.get('/schools/', schoolController.getSchools);
router.get('/schools/new', schoolController.getAddSchool);
router.get('/schools/:id', schoolController.getSchool);
router.get('/schools/:id/new', postController.getAddPost);
// Post School Pages
router.post(`/schools/new`, schoolController.addSchool);
router.post(`/schools/:id/new`, postController.addPost);
// Get Post Pages
router.get('/schools/:id/:postId', postController.getPostPage);
// Post Comments
router.post('/schools/:id/:postId/new', commentController.addComment);
// Vote on Posts or Comments
router.post('/vote/', upvtoteController.updateVote);

module.exports = router;
