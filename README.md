# Organiz-Asso

Projet de l'UE LU3IN017 - Technologies du Web.
Axel CERESA - 21103270
Daba KONE - 

Frontend en React et Backend en NodeJs avec express.  
Base de données avec MongoDB.

## Installation

Une fois les fichiers téléchargés, dans un terminal faire un `npm install` dans le répertoire `/server` et dans le répertoire `/client` pour installer les dépendences nécéssaires.

1. **Base de donnée :** Pour relier la base de donnée au backend, modifier coté server dans le fichier `/config/db.js` la ligne 2 `const url = "url_mongodb";` par le lien de votre base de données MongoDB. Créer une base de données Organiz-Asso et y importer les collections sous format .json présente dans le répertoire `Collections`.

## BACKEND

### Architecture des fichiers :
Dans le dossier `/server` se trouve tous les fichiers réalisant le backend de notre application le point d'entré est `index.js`, `app.js` lance le server et fait appel à `api.js` qui gère toutes les routes de notre backend.
1. **`/config` :** Contient le fichier `db.js` qui définie les fonctions utilisées dans notre application pour se connecter et se déconnecter de la base de données. Elle sont appelées dans le fichier `db.middleware.js`.
2. **`/controllers` :** Contient les fichiers définissant toutes les actions possibles sur notre base de données appelé en callback des différentes routes de notre application. Chaque fichier correspond aux fonctions liées à une entité spécifique (ex: user, forum, message, etc...). Ces fonctions font appels aux méthodes des classes définis dans les fichiers de `/entities`.
3. **`/entities` :** Contient les fichiers définissant les classes de chaque entitiés de notre application (user, forum, message, comment). Les méthodes déffinis dans ses classes effectue les requêtes auprès de la base de données MongoDB donnée en paramètres.
4. **`/middleware` :** Contient les middlewares `checkUser` et `requireAuth` utilisés à la racine de notre server pour sécuriser les requêtes et restreindres leur accès uniquement à un utilisateur connécté (dont une session express à été créée). Les middlewares `connectDBMiddleware` et `closeDBMiddleware`.
5. **`/routes` :** Contient les fichiers deffinissant les routes des requêtes server de notre application pour chaque famille de services.


## FRONTEND

### Architecture des fichiers :
Dans le dossier `/client` se trouve tous les fichiers réalisant le frontend de notre application le point d'entré est `index.js`, qui fait appel au composant `<App/>` qui gères le routage de notre application avec 'react-router-dom'.
1. **`/public` :** Contient le fichier `index.html` dans lequel est fait le render des composants react de l'application.
2. **`/assets/img` :** Contient les images/logo temporairement utilisés dans l'application.
3. **`/components` :** Contient les fichiers définissant les différents composants appelés dans les pages de notre application react. Ces composants disposent chacun de leur fichier CSS correspondant. `AppContext.js` est le composant englobant toute notre application et permet de stocker dans une variable accessible dans tout nos composant les informations de session de l'utilisateur connecté. 
4. **`/pages` :** Contient les fichiers deffinissant les composants des pages de l'application, chacune d'elles appellent les composants définis dans le dossier `/components`.


## BASE DE DONNÉES
La base de données est définit grâce à MongoDB.

### Définition des collections :

**users** : 
```json
{
   "_id" : ObjectId,
   "login" : String,
   "password" : String,
   "lastname" : String,
   "firsname" : String,
   "status" : String
}
```
Avec les champs _id de type `ObjectId` (généré automatiquement lors de l'ajout d'un document dans la base de donnée) et login, password, lastname, firsname, status, de type `String`.  
A savoir que le password est cryté à l'aide de la bibliothèque `bcrypt` avant l'ajout dans la base de données.  Le status d'un user est initialisé de base à "member".

**forums** : 
```json
{
   "_id" : "objectId('6602f9c2391f27f96e5f84e4')",
   "name" : "Forum membres",
   "acces" : [ "member", "admin" ]
}
```
Avec les champs _id de type `ObjectId`, name de type `String` et acces une liste de `String`.  Acces définit les status de user pouvant voir et ecrire dans le forum.  

**messages** : 
```json
{
   "_id" : "objectId('66047529ae1a22ee065d71ec')", // Pas obligatoire à mettre dans le message
   "forumId" : "6602f9c2391f27f96e5f84e4",
   "userId" : "6602f45a954659e97353c359",
   "userName" : "Dupond", 
   "date" : "2024-03-27T19:36:09.108+00:00", // Pas obligatoire à mettre dans le message
   "text" : "Ceci est un premier message",
   "modified" : false // Pas obligatoire à mettre dans le message
}
```
Avec les champs _id de type `ObjectId`, forumId, authorId, authorName et text de type `String`. Le champs date est de type `Date` et modified est de type `Boolean`.  

**comments** : 
```json
{
   "_id" : "objectId('66047529ae1a22ee065d82ab')",
   "messageId" : "66047529ae1a22ee065d71ec",
   "authorId" : "6602f45a954659e97353c359",
   "authorName" : "Dupond",
   "date" : "2024-03-27T19:36:09.108+00:00",
   "text" : "Ceci est un premier commentaire",
   "modified" : false
}
```
Avec les champs _id de type `ObjectId`, messageId, authorId, authorName et text de type `String`. Le champs date est de type `Date` et modified est de type `Boolean`.    

**sessions** : Est généré automatiquement par express-session et contient l'id de la session et le cookie associé.  


## Lancement

Pour lancer le serveur, se placer dans le dossier `/server` et exécuter la commande `npm start` dans un terminal. Cela lancera le serveur à l'adresse `http://localhost:4000` par défaut.  
Pour lancer le client, se placer dans le dossier `/client` et exécuter la commande `npm start` dans un terminal. Cela compilera et lancera le client à l'adresse `http://localhost:3000` par défaut (le navigateur s'ouvre automatiquement).  

Après avoir paramettré la base de donnée dans le serveur, normalement le formulaire d'enregistrement fonctionne et créer bien l'utilisateur dans la DB. De même le formulaire de login fonctionne et fait bien la comparaison avec les infos de la DB pour faire la connexion.
