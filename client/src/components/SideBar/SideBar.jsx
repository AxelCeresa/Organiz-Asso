import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../AppContext';

import axios from 'axios';
import './SideBar.css'

function SideBar(props) {
  const user = useContext(UserContext);
  const [forumList, setForumList] = useState([]);
  const [showForumSubmenu, setShowForumSubmenu] = useState(false);

  const toggleForumSubmenu = () => {
    setShowForumSubmenu(!showForumSubmenu);
  };

  const getForumList = async () => {
    console.log('Chargement de la liste des forums');
    await axios.get('http://localhost:4000/api/forum')
      .then((res) => {
        console.log('Réponse server : ');
        console.log(res.data);
        setForumList(res.data);
      })
      .catch((err) => console.log(err));
  }

  const afficheForum = (forum, index) => {
    console.log('Bouton affiche liste forums cliqué');
    if (forum.acces.includes(user.status)) {
      return <Link key={index} to={`/forum/${forum._id}`}> {forum.name} </Link>;
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      getForumList();
    }, 1);

    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <Link to={`/forum/6602f9c2391f27f96e5f84e4`}> Accueil</Link>
        <button onClick={toggleForumSubmenu}>Forums</button>
        {showForumSubmenu && (
          <div className="submenu">
          {forumList.map((forum, index) => (
            afficheForum(forum, index)
          ))}
          </div>
        )}
        {user.status === 'admin' && <Link to='/admin'> Adminstration </Link>}
      </div>
    </div>
  );
}

export default SideBar;
