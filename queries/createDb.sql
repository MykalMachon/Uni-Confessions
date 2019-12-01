CREATE TABLE School
(
  ID SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  deviceId VARCHAR(128) NOT NULL
);

CREATE TABLE Post
(
  ID SERIAL PRIMARY KEY,
  title VARCHAR(128) NOT NULL,
  body VARCHAR(512) NOT NULL,
  createDate date NOT NULL,
  schoolId INTEGER NOT NULL REFERENCES schools(id),
  deviceId VARCHAR(128) NOT NULL
);

CREATE TABLE Comment
(
  ID SERIAL PRIMARY KEY,
  body VARCHAR(255) NOT NULL,
  createDate date NOT NULL,
  postId INTEGER NOT NULL REFERENCES posts(id),
  deviceId VARCHAR(128) NOT NULL
);

CREATE TABLE VoteCount (
  ID SERIAL PRIMARY KEY,
  voteType ENUM('post', 'comment'),
  count INTEGER DEFAULT 0
)
