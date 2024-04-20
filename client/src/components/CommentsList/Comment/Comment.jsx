import React from 'react';
import { Link } from 'react-router-dom';
import userImg from '../../../assets/img/user-placeholder-image.png';
import './Comment.css'

function Comment({ comment }) {
  const userName = comment.authorName;
  const text = comment.text;
  const date = comment.date;

  return (
    <div>
      <div className="message-rep" id="rep">
        <div className="info-user">
          <img src={userImg} alt="user" className="user-img"/>
          <Link to={`/profile/${comment.authorId}`}> {userName} </Link>
          <p><b>{userName}</b></p> <em>- {date} </em>
        </div>
        <div className="message-content">
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
}

export default Comment;
