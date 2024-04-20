import React from 'react';
import axios from 'axios';
import './DemandeInfos.css';

function DemandeInfos({ user, getDemande, getUser}) {
  const handleAccept = async () => {
    await axios.patch(`http://localhost:4000/api/user/verifie/${user._id}`)
      .then((res) => {
        getDemande();
        getUser();
      })
      .catch((err) => console.log(err));
  };

  const handleDeny = async () => {
    await axios.delete(`http://localhost:4000/api/user/${user._id}`)
      .then((res) => {
        getDemande();
      })
      .catch((err) => console.log(err));
  };

  const firstName = user.firstname;
  const lastName = user.lastname;
  const userName = user.login;
  const date = user.date;

  return (
    <div className="demande-infos-container">
      <div className="infos">
        <h3>{userName}</h3>
        <p>{firstName} {lastName} - {date}</p>
      </div>
      <div className="options">
        <button className="modify-button" onClick={handleAccept}>Accepter</button>
        <button className="delete-button" onClick={handleDeny}>Refuser</button>
      </div>
    </div>
  );
}

export default DemandeInfos;
