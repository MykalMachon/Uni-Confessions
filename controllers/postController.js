// * POST REQUESTS

exports.validatePost = (req, res, next) => {
  // TODO Check for entered hidden field
  // TODO Remove invalid characters and run through sanitization plugin
  // TODO Run through profanity filter and detect issues
  // TODO if any of these fail, return the form with an error message (look into using flash())
  // TODO if all is good, call next() (which will call addPostToSchool) and then return;
};

exports.addPostToSchool = (req, res) => {
  // TODO extract and sanitize post data, as well as school ID
  // TODO insert post data into the DB
  // TODO get the ID of the post and redirect them to the post page (see res.redirect())
};

// Posts can only be deleted by users who have the same userCookieId as the poster
exports.deletePost = (req, res) => {
  // TODO ensure the user has permission to delete the post
  // TODO remove post from database
  // TODO return them to the school page
};
