import React, { useState } from 'react';
import './NewComment.css';

function NewComment({ isOpen, onClose, onSubmit, userName}) {
  const [messageContent, setMessageContent] = useState('');

  const handleSubmit = () => {
    onSubmit(messageContent);
    setMessageContent('');
  }

  if (!isOpen) return null;

  return (
    <div className="newComment-overlay">
      <div className="newComment">
        <div className="header">
          <h2>Répondre à {userName}</h2>
          <button onClick={onClose}>x</button>
        </div>
        <textarea className="newComment-input" rows="5" cols="100"
          placeholder="Écrire un commentaire..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          required
        />
        <div className="newComment-buttons">
          <button onClick={handleSubmit}>Envoyer</button>
        </div>
      </div>
    </div>
  );
}

export default NewComment;
