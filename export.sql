SELECT message,count(votes.point_id) INTO OUTFILE '/tmp/result.text' FIELDS TERMINATED BY ','  FROM votes,points WHERE points.id = votes.point_id GROUP BY votes.point_id; 
