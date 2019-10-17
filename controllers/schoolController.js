// * GET REQUESTS

exports.viewSchools = (req, res) => {
  // TODO Get Schools from DB
  // TODO Return school data to user
};

exports.viewSchoolPosts = (req, res) => {
  // TODO Get School ID from req object
  // TODO Query DB to get posts that have the schools ID
  // TODO Return data
};

// * POST REQUESTS

// ! This should be accessible through the API only and should be secured with token auth
exports.addSchool = (req, res) => {
  // TODO extract and sanitize school data
  // TODO Insert school data into the DB
  // TODO Return the ID of the school
};
