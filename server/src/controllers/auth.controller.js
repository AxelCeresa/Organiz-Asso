const session = require('express-session');
const Users = require("../entities/users.js");

const { store } = require('../config/db'); // Importez le magasin de sessions

module.exports.register = async (req, res) => {
  const { login, password, lastname, firstname } = req.body;

  if (!login || !password || !lastname || !firstname) {
    res.status(400).json({ status: 400, message: "Requête invalide : Tous les champs doivent être remplit" });
    return;
  }

  try {
    db_users = await req.db.collection("users");
    const users = new Users.default(db_users);

    // Si le login du user existe déjà
    if(await users.existsLogin(login)) {
        res.status(409).json({ status: 409, message: "Erreur : Login déjà utilisté" });
        return;
    }

    await users.create(login, password, lastname, firstname)
      .then((rep) => res.status(201).send(rep))
      .catch((err) => res.status(500).send(err));

  } catch (err) {
    // Toute autre erreur
    res.status(500).json({
        message: "Erreur interne",
        details: (err || "Erreur inconnue").toString()
    });
  }
};

module.exports.login = async (req, res) => {
  const { login, password } = req.body;

  try {
      db_users = await req.db.collection("users");
      const users = new Users.default(db_users);

      // Erreur sur la requête HTTP
      if (!login || !password) {
          res.status(400).json({ status: 400, message: "Requête invalide : login et password nécessaires" });
          return;
      }

      let userid = await users.checkpassword(login, password);

      if (! userid) {
        // Faux login : destruction de la session et Erreur
        req.session.destroy((err) => { });
        res.status(403).json({ status: 403, message: "Erreur : Login et/ou mot de passe invalide" });
        return;
      }

      if (! await users.isVerified(userid)) {
        // Utilisateur non vérifié
        req.session.destroy((err) => { });
        res.status(403).json({ status: 403, message: "Erreur : Compte non vérifié par un administrateur" });
        return;
      }

      // Crée une session
      req.session.regenerate(function (err) {
        if (err) {
          res.status(500).json({ status: 500, message: "Erreur Interne", details: err });
        } else {
          req.session.userid = userid;
          res.status(200).json({ status: 200, message: "Login et mot de passe acceptés" });
        }
      });


  } catch (err) {
      // Toute autre erreur
      res.status(500).json({
          message: "Erreur interne",
          details: (err || "Erreur inconnue").toString()
      });
  }
};


module.exports.logout = async (req, res) => {
  try {
    // Vérifie si l'utilisateur est connecté
    const sessionId = req.headers['sessionid'];
    console.log(sessionId);

    if (sessionId){
      // Supprime la session du magasin
      store.destroy(sessionId, (err) => {
        if (err) {
          res.status(500).json({ status: 500, message: "Erreur lors de la déconnexion", details: err });
        } else {
          // Si la suppression de la session est réussie
          res.cookie('usid', '', { maxAge: 1 });
          res.status(200).json({ status: 200, message: "Déconnexion effectuée" });
        }
      });
    } else {
      // Si l'utilisateur n'est pas connecté
      res.cookie('usid', '', { maxAge: 1 });
      res.status(401).json({ status: 401, message: "Utilisateur non connecté" });
    }
  } catch (err) {
    // Gérer les erreurs
    res.status(500).json({
        message: "Erreur interne",
        details: (err || "Erreur inconnue").toString()
    });
  }
};
