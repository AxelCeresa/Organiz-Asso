import React from 'react';
import UserInfos from './UserInfos/UserInfos';
import './UserList.css';

function UserList({ isOpen, onClose, onSubmit, userList, getUserList}) {
  if (!isOpen) return null;

  return (
    <div className="user-list-overlay">
      <div className="user-list-container">
        <div className="user-list-header">
          <h2>Liste des utilisateurs</h2>
          <button onClick={onClose}>x</button>
        </div>
        {userList.length === 0 ? (
          <p>Aucuns utilisateurs</p>
        ) : (
          userList.map((user, index) => (
            <UserInfos key={index} user={user} getUser={getUserList} />
          ))
        )}
      </div>
    </div>
  );
}

export default UserList;
