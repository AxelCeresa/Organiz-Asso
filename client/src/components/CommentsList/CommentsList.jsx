import React from 'react';
import Comment from './Comment/Comment'

function CommentsList({ commentList }) {
  return (
    <div className="commentsList">
      {commentList.map((comment, index) => (
        <Comment key={index} comment={comment}/>
      ))}
    </div>
  );
}

export default CommentsList;
