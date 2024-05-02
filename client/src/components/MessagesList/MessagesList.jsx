import React from 'react';
import Message from './Message/Message'
import './MessagesList.css'

function MessagesList({ messageList, getMessageList }) {
  return (
    <div className="message-list">
      <h3>Publications récentes</h3>
      {messageList.map((message, index) => (
        <Message key={index} message={message} getMessageList={getMessageList} />
      ))}
    </div>
  );
}

export default MessagesList;
