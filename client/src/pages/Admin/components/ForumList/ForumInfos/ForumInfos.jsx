import React, { useState } from 'react';
import axios from 'axios';
import './ForumInfos.css';

function ForumInfos({ forum, getForum }) {
  const [isEditing, setIsEditing] = useState(false);
  const [acces, setAcces] = useState(forum.acces);
  const [editedAccess, setEditedAccess] = useState(forum.acces);

  const [error, setError] = useState('');


  const [name, setName] = useState(forum.name);
  const [editedName, setEditedName] = useState(forum.name)

  const handleEdit = () => {
    setIsEditing(true);
    setEditedAccess(acces);
    setError('');
  };

  const handleConfirm = async () => {
    setIsEditing(false);
    if (acces !== editedAccess) {
      await axios.patch(`http://localhost:4000/api/forum/acces/${forum._id}`, { acces: editedAccess })
        .then((res) => {
          setAcces(editedAccess);
          setError('');
          getForum();
        })
        .catch((err) => {
          if (err.response.data.status === 409){
            setError('Les accès au forum ne peuvent pas être modifiés');
            setEditedAccess(acces);
          } else { console.log(err) }
        });
    }


    if (name !== editedName) {
      await axios.patch(`http://localhost:4000/api/forum/name/${forum._id}`, { name: editedName })
        .then((res) => {
          setName(editedName);
          setError('');
          getForum();
        })
        .catch((err) => {
          if (err.response.data.status === 409){
            setError(err.response.data.message);
            setEditedName(name);
          } else { console.log(err) }
        });
    }
  };

  const handleCheckboxChange = (role) => {
    const updatedAccess = editedAccess.includes(role)
      ? editedAccess.filter(item => item !== role)
      : [...editedAccess, role];
    setEditedAccess(updatedAccess);
  };



  const handleDelete = async () => {
    await axios.delete(`http://localhost:4000/api/forum/${forum._id}`)
      .then((res) => {
        setError('');
        getForum();
      })
      .catch((err) => {
        if (err.response.data.status === 409){
          setError('Le forum ne peut pas être supprimé')
        } else { console.log(err) }
      });
  };

  return (
    <div className="forum-infos-container">
        {isEditing ? (
          <div className="infos">
            <div className="name">
              <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)}/>
            </div>
            <p>Accès : </p>
            <div className="checkboxes">
              <input type="checkbox" id="member" checked={editedAccess.includes("member")} onChange={() => handleCheckboxChange("member")} />
              <label htmlFor="member">Member</label>
              <input type="checkbox" id="admin" checked={editedAccess.includes("admin")} onChange={() => handleCheckboxChange("admin")} />
              <label htmlFor="admin">Admin</label>
            </div>
        </div>
      ) : (
        <div className="infos">
          <div className="name">
            <h3>{name}</h3>
          </div>
          <p>Accès : </p>
          <div className="checkboxes">
            <input type="checkbox" id="member" checked={acces.includes("member")} disabled />
            <label htmlFor="member">Member</label>
            <input type="checkbox" id="admin" checked={acces.includes("admin")} disabled />
            <label htmlFor="admin">Admin</label>
          </div>
        </div>
      )}

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

export default ForumInfos;
