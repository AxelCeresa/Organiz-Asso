import React, { useContext } from 'react';
import Cookies from 'js-cookie';
import { UserContext } from '../../AppContext';

import axios from 'axios';
import userImg from '../../../assets/img/user-placeholder-image.png';
import './NavigationPanel.css'

function NavigationPanel() {
  const user = useContext(UserContext);

  const handleLogout = async () => {
    const usidCookie = Cookies.get('usid');
    await axios.delete('http://localhost:4000/api/user/logout',
    {
      headers: {
        "SessionId": usidCookie.match(/^..([^.]*)/)[1]
      }
    })
      .then((res) => {
        Cookies.remove('usid');
        window.location = '/';
      })
      .catch((err) => console.log(err));
  }

  const handleProfil = () => {
    window.location = `/profile/${user._id}`;
  }

  return (
    <div className="nav-container">
      <img src={userImg} alt="user" className="logo-img" />
      <div id="menu" className="nav">
        <div>
          <button className="navButton" onClick={ handleProfil }>Mon profil</button>
        </div>
        <div>
          <button className="navButton" onClick={ handleLogout }>Déconnexion</button>
        </div>
      </div>
    </div>
  );
}

export default NavigationPanel;
