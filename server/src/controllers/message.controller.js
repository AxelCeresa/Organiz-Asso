const Message = require("../entities/message.js");

module.exports.postMessage = async (req, res) => {
  const { forumId, userId, userName, text } = req.body;

  if (!forumId || !userId || !userName || !text) {
    res.status(400).json({ message: "Requête invalide : Tous les champs doivent être remplit" });
    return;
  }

  try {
    const messages = new Message.default(req.db);

    await messages.create(forumId, userId, userName, text)
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

module.exports.searchMessage = async (req, res) => {
  try {
    const messages = new Message.default(req.db);

    const { text, startDate, endDate } = req.body;

    await messages.searchMessage(text, startDate, endDate)
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

module.exports.getAllMessages = async (req, res) => {
  try {
    const messages = new Message.default(req.db);

    await messages.getAll()
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

module.exports.getAllForumMessages = async (req, res) => {
  let forumId = req.params.id;

  try {
    const messages = new Message.default(req.db);

    await messages.getAllfromForum(forumId)
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

module.exports.getAllUserMessages = async (req, res) => {
  let userId = req.params.id;

  try {
    const messages = new Message.default(req.db);

    await messages.getAllfromUser(userId)
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

module.exports.messageInfo = async (req, res) => {
  let messageId = req.params.id;

  try {
    const messages = new Message.default(req.db);

    await messages.get(messageId)
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

module.exports.deleteMessage = async (req, res) => {
  let messageId = req.params.id;

  try {
    const messages = new Message.default(req.db);

    // Si l'id du forum n'existe pas
    if(! await messages.existsId(messageId)) {
        res.status(400).json({ status: 400, message: "Erreur : ID inconnu :" + messageId });
        return;
    }

    await messages.delete(messageId)
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

module.exports.modifieMessage = async (req, res) => {
  let messageId = req.params.id;
  let { text } = req.body;

  try {
    const messages = new Message.default(req.db);

    // Si l'id du forum n'existe pas
    if(! await messages.existsId(messageId)) {
        res.status(400).json({ status: 400, message: "Erreur : ID inconnu :" + messageId });
        return;
    }

    await messages.modifie(messageId, text)
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
