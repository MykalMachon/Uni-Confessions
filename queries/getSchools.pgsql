SELECT schools.name as School, posts.title, posts.body, posts.createDate
FROM schools, posts
WHERE 
  schools.id=posts.schoolid 
  and schools.name='University of the Fraser Valley';
