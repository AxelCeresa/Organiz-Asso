const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');

// auth
router.put("/register", authController.register);
router.post("/login", authController.login);
router.delete("/logout", authController.logout);


// DataBase
router.get('/', userController.getAllUsers);
router.get('/verifie', userController.getNotVerifiedUsers);
router.get('/:id', userController.userInfos);
router.delete('/:id', userController.deleteUser);
router.patch('/status/:id', userController.switchUserStatus);
router.patch('/verifie/:id', userController.verifieUser);


module.exports = router;
