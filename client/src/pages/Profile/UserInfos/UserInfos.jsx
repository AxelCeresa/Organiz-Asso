import React from 'react';
import moment from 'moment';
import userImg from '../../../assets/img/user-placeholder-image.png'
import './UserInfos.css'

function UserInfos({ user }) {
  return (
    <div>
      {user === null ? (
        <p>Chargement du profil</p>
      ) : (
        <div className="profile-info">
          <h3>Profil Utilisateur</h3>
          <div className="info">
            <div className="list">
              <p><strong>Prénom :</strong> {user.firstname}</p>
              <p><strong>Nom :</strong> {user.lastname}</p>
              <p><strong>Login :</strong> {user.login}</p>
              <p><strong>Date de création :</strong> {moment(user.date).format('DD/MM/YYYY HH:mm')}</p>
              <p><strong>Statut :</strong> {user.status}</p>
            </div>
            <img src={userImg} alt="user" className="profile-user-img"/>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserInfos;
