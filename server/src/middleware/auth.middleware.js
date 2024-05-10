const Users = require("../entities/users.js");
const { store } = require('../config/db'); // Importez le magasin de sessions

module.exports.checkUser = async (req, res, next) => {
  try {
    // Vérifie si l'utilisateur est connecté
    const sessionId = req.headers['sessionid'];
    let userid = null;

    if (sessionId) {
      await store.get(sessionId, async (err, session) => {
          if (err || !session) {
              console.log({ status: 404, message: 'Erreur : Session introuvable' });
          } else {
              // Extraire le champ `userid` de la session
              userid = session.userid;

              if (userid) {
                  const db_users = await req.db.collection("users");
                  const users = new Users.default(db_users);
                  let user = await users.get(userid);
                  res.locals.user = user;
              } else {
                  // Si l'utilisateur n'est pas connecté
                  res.locals.user = null;
                  res.clearCookie('usid');
              }
          }
          next();
      });
    } else {
        // Si aucun sessionId n'est présent
        res.locals.user = null;
        res.clearCookie('usid');
        next();
    }
  } catch (err) {
    // En cas d'erreur, renvoie une erreur interne
    res.status(500).json({
      message: "Erreur interne",
      details: (err || "Erreur inconnue").toString()
    });
  }
};


module.exports.requireAuth = async (req, res, next) => {
  try {
    if (res.locals.user) {
      next();
    } else {
      res.status(401).json({ status: 401, message: 'Erreur : Utilisateur non authentifié' })
    }
  } catch (err) {
    // En cas d'erreur, renvoie une erreur interne
    res.status(500).json({
      message: "Erreur interne",
      details: (err || "Erreur inconnue").toString()
    });
  }
};
