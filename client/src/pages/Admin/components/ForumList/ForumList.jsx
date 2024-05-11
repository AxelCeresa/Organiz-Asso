import React, { useState } from 'react';
import ForumInfos from './ForumInfos/ForumInfos';
import axios from 'axios';
import './ForumList.css';

function ForumList({ isOpen, onClose, forumList, getForumList }) {
  const [isCreateForum, setIsCreateForum] = useState(false);
  const [forumName, setForumName] = useState('');
  const [access, setAccess] = useState([]);

  const [error, setError] = useState('');

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setAccess([...access, value]);
    } else {
      setAccess(access.filter(item => item !== value));
    }
  };

  const handleSubmit = async (e) => {
    console.log('Bouton créer nouveau forum cliqué');
    e.preventDefault();

    if (!forumName || !access){
      setError('Tous les champs sont nécessaires');
      return;
    }

    await axios.put('http://localhost:4000/api/forum', {
      "name": forumName,
      "acces": access
    })
      .then((res) => {
        console.log('Réponse server : ');
        console.log(res.data);
        setForumName('');
        setAccess([]);
        setIsCreateForum(false);
        getForumList();
      })
      .catch((err) => {
        if (err.response.data.status === 409){
          setError('Nom déjà utilisé');
        } else { console.log(err); }
      });
  };

  const handleClick = () => {
    setIsCreateForum(true)
  };


  if (!isOpen) return null;

  return (
    <div className="forum-list-overlay">
      <div className="forum-list-container">
        <div className="forum-list-header">
          <h2>Liste des Forums</h2>
          <button onClick={onClose}>x</button>
        </div>
        {forumList.length === 0 ? (
          <p>Aucuns forums</p>
        ) : (
          forumList.map((forum, index) => (
            <ForumInfos key={index} forum={forum} getForum={getForumList} />
          ))
        )}

        {isCreateForum
          ? (
            <form className="newForum-form">
              <div className="infos">
                <label htmlFor="forumName">Nom du forum : </label>
                <input type="text" id="forumName" value={forumName} onChange={(e) => setForumName(e.target.value)} required />
                <label>Accès :</label>
                <input type="checkbox" id="member" value="member" onChange={handleCheckboxChange} />
                <label htmlFor="member">Member</label>
                <input type="checkbox" id="admin" value="admin" onChange={handleCheckboxChange} />
                <label htmlFor="admin">Admin</label>
              </div>

              <p className="error">{error}</p>

              <div className="options">
                <button className="newForum-button" type="submit" onClick={handleSubmit}>Confirmer</button>
              </div>
            </form>
          ) : (
            <div className="options">
              <button className="newForum-button" onClick={handleClick}>Nouveau forum</button>
            </div>
          )}

      </div>
    </div>
  );
}

export default ForumList;
