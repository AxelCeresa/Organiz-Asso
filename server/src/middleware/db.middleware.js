const { connectToMongoDB, closeMongoDBConnection } = require('../config/db');

// Middleware pour se connecter à MongoDB
module.exports.connectDBMiddleware = async (req, res, next) => {
  try {
    req.db = await connectToMongoDB(); // Stocke la connexion MongoDB dans req.db
    next();
  } catch (error) {
    res.status(500).json({ message: 'Erreur interne du serveur', details: error});
  }
};

// Middleware pour fermer la connexion à MongoDB
module.exports.closeDBMiddleware = async (req, res, next) => {
  try {
    await closeMongoDBConnection(); // Ferme la connexion MongoDB
    next();
  } catch (error) {
    res.status(500).json({ message: 'Erreur interne du serveur', details: error});
  }
};
