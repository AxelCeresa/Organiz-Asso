import React from 'react';
import { Link } from 'react-router-dom';

import Message from '../../../MessagesList/Message/Message';
import './SearchResult.css';

function SearchResult({ isOpen, onClose, userList, messageList }) {
  if (!isOpen) return null;

  const handleClick = () => {
    console.log('Lien vers profil utilisateur cliqué');
  }

  return (
    <div className="search-result-overlay">
      <div className="search-result-container">
        <div className="search-result-header">
          <h2>Résultat recherche</h2>
          <button onClick={onClose}>x</button>
        </div>
        {(userList.length === 0 && messageList.length === 0) ? (
          <p>Aucuns résultats</p>
        ) : (
          <div className='search-result-data'>
            <div className='users'>
              {userList.map((user, index) => (
                <p><Link key={index} to={`/profile/${user._id}`} onClick={handleClick}> <b>{user.login}</b> </Link></p>
              ))}
            </div>
            <div className='messages'>
              {messageList.map((message, index) => (
                <Message key={index} message={message} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResult;
