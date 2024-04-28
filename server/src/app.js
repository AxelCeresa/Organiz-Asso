const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express();


app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


// Détermine le répertoire de base
const basedir = path.normalize(path.dirname(__dirname));
console.debug(`Base directory: ${basedir}`);


// Config cors
app.use(cors({
  origin: "http://localhost:3000",
  methods: ['POST', 'PUT', 'GET', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  credentials: true
}));


// Config session
const session = require('express-session');
const { store } = require('./config/db'); // Importez le magasin de sessions ici

app.use(session({
  name: "usid",
  secret: "place_holder_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie:{
    maxAge: 3600000, // Durée de vie du cookie (1h)
    secure: false, // Définir sur true si utilisation de HTTPS
    httpOnly: false, // Empêche l'accès au cookie via Javascript coté client
    sameSite: 'None'
  },
  store: store
}));

const { connectDBMiddleware } = require('./middleware/db.middleware');

// Fait appel à l'api pour gérer les requçetes
const api = require('./api.js')
app.use('/api', connectDBMiddleware, api.default());


const { closeMongoDBConnection } = require('./config/db');
// Gestion de la fermeture du serveur
process.on('SIGINT', async () => {
  try {
    // Fermeture de la connexion à la base de données avant de quitter
    await closeMongoDBConnection();
    console.log('\nConnexion à la base de données fermée. Arrêt du serveur.');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la fermeture du serveur:', error);
    process.exit(1);
  }
});

module.exports = app;
