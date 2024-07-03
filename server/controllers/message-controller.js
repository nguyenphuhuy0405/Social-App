const Message = require('../models/Message');

class MessageController {
    async createMessage(req, res) {
        const { conversationId, sender, text } = req.body;
        const newMessage = new Message({
            conversationId,
            sender,
            text,
        });
        try {
            const savedMessage = await newMessage.save();
            return res.status(200).json(savedMessage);
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }
    async getMessagesOfConversation(req, res) {
        try {
            const messages = await Message.find({
                conversationId: req.params.conversationId,
            });
            return res.status(200).json(messages);
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }
}

module.exports = new MessageController();
