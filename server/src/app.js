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
const MongoStore = require('connect-mongo');
app.use(session({
  name: "usid",
  secret: "place_holder_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie:{
    maxAge: 3600000, // Durée de vie du cookie (1h)
    secure: false, // Définir sur true si utilisation de HTTPS
    httpOnly: true, // Empêche l'accès au cookie via Javascript coté client
    sameSite: 'None'
  },
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://axelCeresa:Hicko94!@cluster0.ird5nik.mongodb.net/Organiz-Asso",
  })
}));



const { checkUser, requireAuth } = require('./middleware/auth.middleware');
// Middleware de verification de session
//app.get('*', checkUser);
//app.get('/uid', requireAuth, (req, res) => {
//  res.status(200).json({ userid: res.locals.user._id.toString() });
//});



// Fait appel à l'api pour gérer les requçetes
const api = require('./api.js')
app.use('/api', api.default());


// Démarre le serveur
app.on('close', () => {
});
module.exports = app;
