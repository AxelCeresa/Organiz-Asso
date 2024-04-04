import React, { useState } from 'react';
import axios from 'axios';
import './UserInfos.css';

function UserInfos(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(props.user.status);
  const [editedStatus, setEditedStatus] = useState(props.user.status);

  const [error, setError] = useState('');


  const userName = props.user.login;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedStatus(status);
    setError('');
  };

  const handleConfirm = async () => {
    setIsEditing(false);
    if (status === editedStatus) {
      setError('');
    } else {
      await axios.patch(`http://localhost:4000/api/user/status/${props.user._id}`, { status: editedStatus })
        .then((res) => {
          setStatus(editedStatus);
          setError('');
          props.getUser();
        })
        .catch((err) => {
          if (err.response.data.status === 409){
            setError('Le status d\'un admin peut pas être modifié')
          } else { console.log(err) }
        });
    }
  };

  const handleCheckboxChange = (s) => {
    setEditedStatus(s);
  };



  const handleDelete = async () => {
    await axios.delete(`http://localhost:4000/api/user/${props.user._id}`)
      .then((res) => {
        setError('');
        props.getUser();
      })
      .catch((err) => {
        if (err.response.data.status === 409){
          setError('Le user ne peut pas être supprimé')
        } else { console.log(err) }
      });
  };

  return (
    <div className="user-infos-container">
      <div className="infos">
        <div className="userName">
          <h3>{userName}</h3>
        </div>
        <p>Status : </p>
        {isEditing ? (
        <div className="checkboxes">
          <input type="checkbox" id="member" checked={editedStatus === "member"} onChange={() => handleCheckboxChange("member")} />
          <label htmlFor="member">Member</label>
          <input type="checkbox" id="admin" checked={editedStatus === "admin"} onChange={() => handleCheckboxChange("admin")} />
          <label htmlFor="admin">Admin</label>
        </div>
      ) : (
        <div className="checkboxes">
          <input type="checkbox" id="member" checked={status === "member"} disabled />
          <label htmlFor="member">Member</label>
          <input type="checkbox" id="admin" checked={status === "admin"} disabled />
          <label htmlFor="admin">Admin</label>
        </div>
      )}
      </div>

      <p className="error">{error}</p>

      {isEditing ? (
        <div className="options">
          <button className="confirm-button" onClick={handleConfirm}>Confirmer</button>
        </div>
      ) : (
        <div className="options">
          <button className="modify-button" onClick={handleEdit}>Modifier</button>
          <button className="delete-button" onClick={handleDelete}>Supprimer</button>
        </div>
      )}

    </div>
  );
}

export default UserInfos;
