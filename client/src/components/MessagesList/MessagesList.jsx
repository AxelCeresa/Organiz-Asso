import React from 'react';
import Message from './Message/Message'
import './MessagesList.css'

function MessagesList({ user, messageList }) {
  return (
    <div className="message-list">
      <h3>Publications récentes</h3>
      {messageList.map((message, index) => (
        <Message key={index} user={user} message={message} />
      ))}
    </div>
  );
}

export default MessagesList;
