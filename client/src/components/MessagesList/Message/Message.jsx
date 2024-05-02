import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../AppContext';
import { Link } from 'react-router-dom';

import CommentsList from '../../CommentsList/CommentsList';
import NewComment from '../../NewComment/NewComment';
import axios from 'axios';
import userImg from '../../../assets/img/user-placeholder-image.png';
import './Message.css'

function Message({ message, getMessageList }) {
  const user = useContext(UserContext);
  
  const [commentList, setCommentList] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isNewCommentOpen, setIsNewCommentOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(message.text);
  const [editedText, setEditedText] = useState(message.text);


  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(text);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleNewComment = () => {
    setIsNewCommentOpen(!isNewCommentOpen);
  };

  const handleCommentSubmit = async (messageContent) => {
    await axios.put(`http://localhost:4000/api/comment`, {
      "messageId": message._id,
      "userId": user._id,
      "userName": user.login,
      "text": messageContent
    })
      .then((res) => {
        getCommentList();
        toggleNewComment();
      })
      .catch((err) => console.log(err));

  };

  const handleEditSubmit = async () => {
    setIsEditing(false);
    if (text !== editedText) {
      await axios.patch(`http://localhost:4000/api/message/${message._id}`, { text: editedText })
        .then((res) => {
          setText(editedText);
          getMessageList();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:4000/api/message/${message._id}`)
      .then((res) => getMessageList())
      .catch((err) => console.log(err));
  };


  const getCommentList = async () => {
    await axios.get(`http://localhost:4000/api/comment/message/${message._id}`)
      .then((res) => setCommentList(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getCommentList();
    }, 1);

    return () => clearTimeout(timer);
  }, []);


  const userName = message.authorName;
  const messageContent = message.text;
  const date = message.date;


  return (
    <div>
      <div className="message-og">
        <div className="info-user">
          <img src={userImg} alt="user" className="user-img"/>
          <Link to={`/profile/${message.authorId}`}> <b>{userName}</b> </Link>
          <em>- {date} </em>
          <div className='edit-supp-buttons' >
            {isEditing ? (
              <button type="submit" className='confirm' onClick={handleEditSubmit}>Envoyer</button>
            ) : (
              <div>
                {message.authorId === user._id &&
                  <button type="button" onClick={handleEdit}>Edit</button>
                }
                {(message.authorId === user._id || user.status === 'admin') &&
                  <button type="button" onClick={handleDelete}>Del</button>
                }
              </div>
            )}
          </div>
        </div>
        <div className="message-content">
          {isEditing ? (
            <textarea type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)}></textarea>
          ) : (
            <p>{messageContent}</p>
          )}
        </div>
        <div className="message-info">
          {commentList.length > 0 && <button type="button" onClick={toggleVisibility}>{commentList.length} commentaires</button>}
          <button type="button" onClick={toggleNewComment}>+ Ajouter un commentaire</button>
        </div>
      </div>
      <NewComment isOpen={isNewCommentOpen} onClose={toggleNewComment} onSubmit={handleCommentSubmit} userName={userName}/>
      {isVisible && <CommentsList commentList={commentList} getCommentList={getCommentList} />}
    </div>
  );
}

export default Message;
