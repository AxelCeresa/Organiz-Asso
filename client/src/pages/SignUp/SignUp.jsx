import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SignUp.css'


function SignUp(props) {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [login, setLogin] = useState('');
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = (e) => {
    console.log("Bouton m'inscrire cliqué");
    e.preventDefault();

    if (pass1 !== pass2){
      setError("Les mots de passe saisis ne sont pas identiques");
    } else {
      setError("");

      axios.put('http://localhost:4000/api/user/register', {
          "firstname": firstname,
          "lastname": lastname,
          "login": login,
          "password": pass1
        })
        .then((res) => {
          console.log('Réponse server : ');
          console.log(res.data);
          window.location = '/login';
        })
        .catch((err) => {
          if (err.response.status === 409) {
            setError(err.response.data.message);
          } else {
            console.log(err);
          }
        });
    }
  }

  return (
    <div>
      <div className="fond">
        <div className="signup-container">
          <h2><b>Enregistrement</b></h2>
          <form action="" onSubmit={handleSignUp} className="signup-form" id="signup-form" method="POST">
            <div className="form-group-1">
                <label htmlFor="prenom">Prénom</label>
                <label htmlFor="nom">Nom</label>
            </div>
            <div className="form-group-1">
                <input type="text" id="prenom" name="prenom" onChange={(e) => setFirstName(e.target.value)} required />
                <input type="text" id="nom" name="nom" onChange={(e) => setLastName(e.target.value)} required />
            </div>
            <div className="form-group">
                <label htmlFor="login">Login</label>
                <input type="text" id="login" name="login" onChange={(e) => setLogin(e.target.value)} required />
            </div>
            <div className="login-error"></div>
            <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input type="password" id="password" name="password" onChange={(e) => setPass1(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Confirmer mot de passe</label>
                <input type="password" id="password" name="password" onChange={(e) => setPass2(e.target.value)} />
            </div>
            <div className="error">{error}</div>
            <div className="buttons">
                <button type="submit">M'inscrire</button>
                <Link to="/">Annuler</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
