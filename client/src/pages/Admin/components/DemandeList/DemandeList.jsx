import React from 'react';
import DemandeInfos from './DemandeInfos/DemandeInfos';
import './DemandeList.css';

function DemandeList({ isOpen, onClose, demandeList, getDemandeList, getUserList}) {
  if (!isOpen) return null;

  return (
    <div className="demande-list-overlay">
      <div className="demande-list-container">
        <div className="demande-list-header">
          <h2>Liste des demandes</h2>
          <button onClick={onClose}>x</button>
        </div>
        {demandeList.length === 0 ? (
          <p>Aucunes demandes</p>
        ) : (
          demandeList.map((user, index) => (
            <DemandeInfos key={index} user={user} getDemande={getDemandeList} getUser={getUserList}/>
          ))
        )}
      </div>
    </div>
  );
}

export default DemandeList;
