import React, { useState } from 'react';
import userImg from '../../assets/img/user-placeholder-image.png';
import './NewMessage.css'

import axios from 'axios';

function NewMessage({ user, forumId, getMessageList }) {
  const [messageContent, setMessageContent] = useState('');

  const handleSubmit = async () => {
    await axios.put(`http://localhost:4000/api/message/`, {
      "forumId": forumId,
      "userId": user._id,
      "userName": user.login,
      "text": messageContent
    })
      .then((res) => {
        setMessageContent('');
        getMessageList();
      })
      .catch((err) => console.log(err));
  }


  return (
    <div className="new-message">
      <h3>Nouvelle publication</h3>
      <div className="info-user">
        <img src={userImg} alt="user" className="user-img"/>
        <p><b>{user.login}</b></p>
      </div>
      <div className="input-message">
        <textarea name="message" placeholder="Exprimez-vous..." value={messageContent} onChange={(e) => setMessageContent(e.target.value)} required></textarea>
        <button type="submit" onClick={handleSubmit}>Envoyer</button>
      </div>
    </div>
  );
}

export default NewMessage;
