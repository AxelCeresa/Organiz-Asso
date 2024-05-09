import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../AppContext';

import moment from 'moment';
import axios from 'axios';

import userImg from '../../../assets/img/user-placeholder-image.png';
import './Comment.css'

function Comment({ comment, getCommentList }) {
  const user = useContext(UserContext);

  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.text);
  const [editedText, setEditedText] = useState(comment.text);

  const [isModified, setIsModified] = useState(comment.modified);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(text);
  };

  const handleEditSubmit = async () => {
    setIsEditing(false);
    if (text !== editedText) {
      await axios.patch(`http://localhost:4000/api/comment/${comment._id}`, { text: editedText })
        .then((res) => {
          setText(editedText);
          setIsModified(true);
          getCommentList();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:4000/api/comment/${comment._id}`)
      .then((res) => getCommentList())
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="message-rep" id="rep">
        <div className="info-user">
          <img src={userImg} alt="user" className="user-img"/>
          <Link to={`/profile/${comment.authorId}`}> <b>{comment.authorName}</b> </Link>
          <em>&nbsp;- {moment(comment.date).format('DD/MM/YYYY HH:mm')} </em>
          {isModified && <p>&nbsp;- modifié</p>}
          <div className='edit-supp-buttons' >
            {isEditing ? (
              <button type="submit" className='confirm' onClick={handleEditSubmit}>Envoyer</button>
            ) : (
              <div>
                {comment.authorId === user._id &&
                  <button type="button" onClick={handleEdit}>Edit</button>
                }
                {(comment.authorId === user._id || user.status === 'admin') &&
                  <button type="button" onClick={handleDelete}>Delete</button>
                }
              </div>
            )}
          </div>
        </div>
        <div className="message-content">
        {isEditing ? (
          <textarea type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)}></textarea>
        ) : (
          <p>{text}</p>
        )}
        </div>
      </div>
    </div>
  );
}

export default Comment;
