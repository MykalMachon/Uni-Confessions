SELECT School.name as School, Post.title, Post.body, Post.createDate
FROM School, Post
WHERE 
  School.id=Post.schoolid 
  and School.name='University of the Fraser Valley'; 
