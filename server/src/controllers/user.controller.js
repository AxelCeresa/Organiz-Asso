const Users = require("../entities/users.js");

module.exports.getAllUsers = async (req, res) => {
  try {
    db_users = await req.db.collection("users");
    const users = new Users.default(db_users);

    // Récuprère la liste des users
    await users.getAll()
      .then((rep) => res.status(200).json(rep))
      .catch((err) => res.status(err.status).json(err))

  } catch (err) {
    // Toute autre erreur
    res.status(500).json({
        message: "Erreur interne",
        details: (err || "Erreur inconnue").toString()
    });
  }
};

module.exports.userInfos = async (req, res) => {
  // Récupère l'id passé en paramettre
  let userID = req.params.id;
  try {
    const db_users = await req.db.collection('users');
    const users = new Users.default(db_users);

    // Si l'id du user n'existe pas
    if(! await users.existsId(userID)) {
        res.status(400).json({ status: 400, message: "ID inconnu :" + userID });
        return;
    }

    // Id correct
    await users.get(userID)
      .then((rep) => res.status(200).json(rep))
      .catch((err) => res.status(err.status).json(err));

  } catch (err) {
    // Toute autre erreur
    res.status(500).json({
        message: "Erreur interne",
        details: (err || "Erreur inconnue").toString()
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  // Récupère l'id passé en paramettre
  let userID = req.params.id;
  try {
    const db_users = await req.db.collection("users");
    const users = new Users.default(db_users);

    // Si l'id du user n'existe pas
    if(! await users.existsId(userID)) {
        res.status(400).json({ status: 400, message: "ID inconnu :" + userID });
        return;
    }

    // Id correct
    await users.delete(userID)
      .then((rep) => res.status(200).json(rep))
      .catch((err) => res.status(err.status).json(err));

  } catch (err) {
    // Toute autre erreur
    res.status(500).json({
        message: "Erreur interne",
        details: (err || "Erreur inconnue").toString()
    });
  }
};

module.exports.switchUserStatus = async (req, res) => {
  // Récupère l'id passé en paramettre
  let userID = req.params.id;
  try {
    const db_users = await req.db.collection('users');
    const users = new Users.default(db_users);

    // Si l'id du user n'existe pas
    if(! await users.existsId(userID)) {
        res.status(400).json({ status: 400, message: "ID inconnu :" + userID });
        return;
    }

    // Id correct
    await users.switchStatus(userID)
      .then((rep) => res.status(200).json(rep))
      .catch((err) => res.status(err.status).json(err));

  } catch (err) {
    // Toute autre erreur
    res.status(500).json({
        message: "Erreur interne",
        details: (err || "Erreur inconnue").toString()
    });
  }
};

module.exports.verifieUser = async (req, res) => {
  // Récupère l'id passé en paramettre
  let userID = req.params.id;
  try {
    const db_users = await req.db.collection('users');
    const users = new Users.default(db_users);

    // Si l'id du user n'existe pas
    if(! await users.existsId(userID)) {
        res.status(400).json({ status: 400, message: "ID inconnu :" + userID });
        return;
    }

    // Id correct
    await users.verifieUser(userID)
      .then((rep) => res.status(200).json(rep))
      .catch((err) => res.status(err.status).json(err));

  } catch (err) {
    // Toute autre erreur
    res.status(500).json({
        message: "Erreur interne",
        details: (err || "Erreur inconnue").toString()
    });
  }
};

module.exports.getNotVerifiedUsers = async (req, res) => {
  try {
    db_users = await req.db.collection("users");
    const users = new Users.default(db_users);

    // Récuprère la liste des users
    await users.getNotVerifiedUsers()
      .then((rep) => res.status(200).json(rep))
      .catch((err) => res.status(err.status).json(err))

  } catch (err) {
    // Toute autre erreur
    res.status(500).json({
        message: "Erreur interne",
        details: (err || "Erreur inconnue").toString()
    });
  }
};
