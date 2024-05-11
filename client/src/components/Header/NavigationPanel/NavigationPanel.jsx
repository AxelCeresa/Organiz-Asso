import React, { useContext } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

import { UserContext } from '../../AppContext';

import axios from 'axios';
import userImg from '../../../assets/img/user-placeholder-image.png';
import './NavigationPanel.css'

function NavigationPanel() {
  const user = useContext(UserContext);

  const handleLogout = async () => {
    console.log('Bouton déconnexion cliqué');
    const usidCookie = Cookies.get('usid');
    await axios.delete('http://localhost:4000/api/user/logout',
    {
      headers: {
        "SessionId": usidCookie.match(/^..([^.]*)/)[1]
      }
    })
      .then((res) => {
        console.log('Réponse server : ');
        console.log(res.data);
        Cookies.remove('usid');
        window.location = '/';
      })
      .catch((err) => console.log(err));
  }

  const handleClick = () => {
    console.log('Bouton profil cliqué');
  }

  return (
    <div className="nav-container">
      <img src={userImg} alt="user" className="logo-img" />
      <div id="menu" className="nav">
        <Link to={`/profile/${user._id}`} className='navButton' onClick={handleClick}>&nbsp;&nbsp;Mon profil </Link>
        <button className="navButton" onClick={ handleLogout }>Déconnexion</button>
      </div>
    </div>
  );
}

export default NavigationPanel;
