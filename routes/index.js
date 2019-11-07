var express = require('express');
var router = express.Router();

const schoolController = require('../controllers/schoolController');

// Get the home page
router.get('/', (req, res, next) => {
  res.render('index', { title: 'UFV Confessions' });
});
// Get school pages
router.get('/schools/', schoolController.getSchools);
router.get('/schools/:id', schoolController.getSchool);

module.exports = router;
