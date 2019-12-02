    SELECT 
      c.id, 
      c.body, 
      c.createDate, 
      c.deviceId, 
      vc.id as commentVoteId, 
      vc.count as commoentVoteCount, 
      p.title as postTitle, 
      p.body as postBody, 
      p.createDate as postDate,
      vp.id as postVoteId,
      vp.count as postVoteCount
    FROM Comment as c, VoteCount as vc, Post as p, VoteCount as vp
    WHERE c.postId=3 and vc.id = c.voteCount and p.id = c.postId and vp.id=3
    ORDER BY vc.count DESC  