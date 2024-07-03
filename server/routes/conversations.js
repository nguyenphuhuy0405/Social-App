const router = require('express').Router();
const ConversationController = require('../controllers/conversation-controller');

//create a conversation
router.post('/', ConversationController.createConversation);

//get conversations of a user
router.get('/:userId', ConversationController.getConversationOfUser);

//get conversation of two users
router.get('/find/:firstUserId/:secondUserId', ConversationController.getConversationOfTwoUsers);

module.exports = router;
