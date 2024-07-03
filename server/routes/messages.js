const router = require('express').Router();
const MessageController = require('../controllers/message-controller');

//create a message
router.post('/', MessageController.createMessage);

//get all messages of a conversation
router.get('/:conversationId', MessageController.getMessagesOfConversation);

module.exports = router;
