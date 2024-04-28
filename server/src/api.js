const express = require('express');
const router = express.Router();

const usersRoutes = require('./routes/user.routes');
const forumsRoutes = require('./routes/forum.routes');
const messagesRoutes = require('./routes/message.routes');
const commentsRoutes = require('./routes/comment.routes');

const { checkUser, requireAuth } = require('./middleware/auth.middleware');

function init(db) {
  // Middleware de logging
  router.use((req, res, next) => {
    if (req.method !== "OPTIONS"){
      console.log('\nAPI: method %s, path %s', req.method, req.path);
      console.log('Body', req.body);
    }
    next();
  });


  // Middleware de verification de session
  router.get('*', checkUser);
  router.get('/uid', requireAuth, (req, res) => {
    res.status(200).json({ user: res.locals.user });
  });


  // Routes
  router.use('/user', usersRoutes);
  router.use('/forum', forumsRoutes);
  router.use('/message', messagesRoutes);
  router.use('/comment', commentsRoutes);

  return router;
}

exports.default = init;
