    SELECT c.id, c.body, c.createDate, c.deviceId, v.id as voteId, v.count
    FROM Comment as c, VoteCount as v
    WHERE postId=0 and v.id = c.votecount