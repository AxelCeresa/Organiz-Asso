import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../AppContext';
import { Link } from 'react-router-dom';
import moment from 'moment';

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

  const [isModified, setIsModified] = useState(message.modified);

  const handleEdit = () => {
    console.log("Bouton d'édition cliqué");
    setIsEditing(true);
    setEditedText(text);
  };

  const toggleVisibility = () => {
    console.log('Bouton commentaires cliqué');
    setIsVisible(!isVisible);
  };

  const toggleNewComment = () => {
    console.log('Bouton nouveau commentaire cliqué');
    setIsNewCommentOpen(!isNewCommentOpen);
  };

  const handleCommentSubmit = async (messageContent) => {
    console.log('Bouton envoyer commentaire cliqué');
    await axios.put(`http://localhost:4000/api/comment`, {
      "messageId": message._id,
      "userId": user._id,
      "userName": user.login,
      "text": messageContent
    })
      .then((res) => {
        console.log('Réponse server : ');
        console.log(res.data);
        getCommentList();
        toggleNewComment();
      })
      .catch((err) => console.log(err));

  };

  const handleEditSubmit = async () => {
    console.log('Bouton envoyer edition cliqué');
    setIsEditing(false);
    if (text !== editedText) {
      await axios.patch(`http://localhost:4000/api/message/${message._id}`, { text: editedText })
        .then((res) => {
          console.log('Réponse server : ');
          console.log(res.data);
          setText(editedText);
          setIsModified(true);
          getMessageList();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDelete = async () => {
    console.log('Bouton delete cliqué');
    await axios.delete(`http://localhost:4000/api/message/${message._id}`)
      .then((res) => {
        console.log('Réponse server : ');
        console.log(res.data);
        getMessageList();
      })
      .catch((err) => console.log(err));
  };

  const getCommentList = async () => {
    console.log('Chargement des commentaires');
    setCommentList([]);
    await axios.get(`http://localhost:4000/api/comment/message/${message._id}`)
      .then((res) => {
        console.log('Réponse server : ');
        console.log(res.data);
        setCommentList(res.data);
      })
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
  const date = moment(message.date).format('DD/MM/YYYY HH:mm');


  return (
    <div>
      <div className="message-og">
        <div className="info-user">
          <img src={userImg} alt="user" className="user-img"/>
          <Link to={`/profile/${message.authorId}`}> <b>{userName}</b> </Link>
          <em>&nbsp;- {date} </em>
          {isModified && <p>&nbsp;- modifié</p>}
          <div className='edit-supp-buttons' >
            {isEditing ? (
              <button type="submit" className='confirm' onClick={handleEditSubmit}>Envoyer</button>
            ) : (
              <div>
                {message.authorId === user._id &&
                  <button type="button" onClick={handleEdit}>Edit</button>
                }
                {(message.authorId === user._id || user.status === 'admin') &&
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
            <p>{messageContent}</p>
          )}
        </div>
        <div className="message-info">
          {commentList.length > 0 && <button type="button" onClick={toggleVisibility}>{commentList.length} 💬</button>}
          <button type="button" onClick={toggleNewComment}><b>+</b></button>
        </div>
      </div>
      <NewComment isOpen={isNewCommentOpen} onClose={toggleNewComment} onSubmit={handleCommentSubmit} userName={userName}/>
      {isVisible && <CommentsList commentList={commentList} getCommentList={getCommentList} />}
    </div>
  );
}

export default Message;
