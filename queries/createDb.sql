CREATE TABLE School
(
  ID SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  deviceId VARCHAR(128) NOT NULL
);

CREATE TABLE VoteCount (
  ID SERIAL PRIMARY KEY,
  count INTEGER DEFAULT 0
);

CREATE TABLE Post
(
  ID SERIAL PRIMARY KEY,
  title VARCHAR(128) NOT NULL,
  body VARCHAR(512) NOT NULL,
  createDate date NOT NULL,
  voteCount INTEGER NOT NULL REFERENCES VoteCount(id),
  schoolId INTEGER NOT NULL REFERENCES School(id),
  deviceId VARCHAR(128) NOT NULL
);

CREATE TABLE Comment
(
  ID SERIAL PRIMARY KEY,
  body VARCHAR(255) NOT NULL,
  createDate date NOT NULL,
  postId INTEGER NOT NULL REFERENCES Post(id),
  voteCount INTEGER NOT NULL REFERENCES VoteCount(id),
  deviceId VARCHAR(128) NOT NULL
);

-- Insert Misc INSERTS, UPDATES, DELETES here. 
-- These are handled by the GUI app we wrote that can be found at https://ufv-confessions.herokuapp.com
