const router = require('express').Router();
const messageController = require('../controllers/message.controller');

// Messages
router.get('/', messageController.getAllMessages);
router.get('/forum/:id', messageController.getAllForumMessages);
router.get('/user/:id', messageController.getAllUserMessages);
router.get('/:id', messageController.messageInfo);
router.post('/search', messageController.searchMessage);

router.put('/', messageController.postMessage);
router.patch('/:id', messageController.modifieMessage);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
