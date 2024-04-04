import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './SideBar.css'

function SideBar(props) {
  const [forumList, setForumList] = useState([]);

  const [showForumSubmenu, setShowForumSubmenu] = useState(false);

  const toggleForumSubmenu = () => {
    setShowForumSubmenu(!showForumSubmenu);
  };

  const getForumList = async () => {
    await axios.get('http://localhost:4000/api/forum')
      .then((res) => setForumList(res.data))
      .catch((err) => console.log(err));
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
            <Link key={index} to={`/forum/${forum._id}`}> {forum.name} </Link>
          ))}
          </div>
        )}
        <Link to='/admin'> Adminstration </Link>
      </div>
    </div>
  );
}

export default SideBar;
