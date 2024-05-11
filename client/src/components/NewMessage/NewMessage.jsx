import React, { useContext, useState } from 'react';
import { UserContext } from '../AppContext';

import userImg from '../../assets/img/user-placeholder-image.png';
import './NewMessage.css'

import axios from 'axios';

function NewMessage({ forumId, getMessageList }) {
  const [messageContent, setMessageContent] = useState('');
  const user = useContext(UserContext);

  const handleSubmit = async () => {
    console.log('Bouton envoyer message cliqué');
    await axios.put(`http://localhost:4000/api/message/`, {
      "forumId": forumId,
      "userId": user._id,
      "userName": user.login,
      "text": messageContent
    })
      .then((res) => {
        console.log('Réponse server : ');
        console.log(res.data);
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
