import React from 'react';
import Comment from './Comment/Comment'

function CommentsList({ commentList, getCommentList }) {
  return (
    <div className="commentsList">
      {commentList.map((comment, index) => (
        <Comment key={index} comment={comment} getCommentList={getCommentList} />
      ))}
    </div>
  );
}

export default CommentsList;
