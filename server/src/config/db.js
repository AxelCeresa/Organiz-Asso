const { MongoClient } = require('mongodb');
const url = "mongodb+srv://axelCeresa:Hicko94!@cluster0.ird5nik.mongodb.net/Organiz-Asso";

let db = null;
let client = null;

const MongoStore = require('connect-mongo');

// Créer un magasin de sessions pour MongoDB
const store = MongoStore.create({
    mongoUrl: url,
    collectionName: 'sessions' // Nom de la collection où stocker les sessions
});

// Fonction pour ouvrir la connexion à MongoDB
async function connectToMongoDB() {
  try {
    if (!client) {
      client = await MongoClient.connect(url);
      db = client.db('Organiz-Asso');
      console.log("Connected to MongoDB");
    }
    return db
  } catch (err) {
    console.log("Failed to connect to MongoDB : ", err);
    throw err;
  }
}

// Fonction pour fermer la connexion à MongoDB
async function closeMongoDBConnection() {
    try {
        if (client) {
            await client.close();
            console.log('Disconnected from MongoDB');
            db = null;
            client = null;
        }
    } catch (err) {
        console.error('Failed to disconect from MongoDB :', err);
        throw err;
    }
}

module.exports = { connectToMongoDB, closeMongoDBConnection, store};
