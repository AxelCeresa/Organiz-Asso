import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css'

function Login (props) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:4000/api/user/login', {
      "login": login,
      "password": password
    }, { withCredentials: true, credentials: 'include' })
      .then((res) => { window.location = '/forum/6602f9c2391f27f96e5f84e4' })
      .catch((err) => {
        if (err.response.status === 403) {
          setError(err.response.data.message);
        } else {
          console.log(err);
        }
      });
  };

  return (
    <div>
      <div className="fond">
        <div className="login-container">
          <h2><b>Ouvrir une session</b></h2>
          <form action="" onSubmit={handleLogin} id ="login-form" className="login-form" method="post">
              <div className="form-group">
                  <label htmlFor="login">Login</label>
                  <input type="text" id="login" name="login" value={login} onChange={(e) => setLogin(e.target.value)} required />
              </div>
              <div className="form-group">
                  <label htmlFor="password">Mot de passe</label>
                  <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="error">{error}</div>
              <div className="buttons">
                  <button type="submit" className="connexion-button">Connexion</button>
                  <Link to="/signup">Enregistrement</Link>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
