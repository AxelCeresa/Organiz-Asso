import React from 'react';
import moment from 'moment';
import axios from 'axios';
import './DemandeInfos.css';

function DemandeInfos({ user, getDemande, getUser}) {
  const handleAccept = async () => {
    console.log('Bouton accepter demande cliqué');
    await axios.patch(`http://localhost:4000/api/user/verifie/${user._id}`)
      .then((res) => {
        console.log('Réponse server : ');
        console.log(res.data);
        getDemande();
        getUser();
      })
      .catch((err) => console.log(err));
  };

  const handleDeny = async () => {
    console.log('Bouton refuser demande cliqué');
    await axios.delete(`http://localhost:4000/api/user/${user._id}`)
      .then((res) => {
        console.log('Réponse server : ');
        console.log(res.data);
        getDemande();
      })
      .catch((err) => console.log(err));
  };

  const firstName = user.firstname;
  const lastName = user.lastname;
  const userName = user.login;
  const date = moment(user.date).format('DD/MM/YYYY HH:mm');

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
