const Conversation = require('../models/Conversation');

class ConversationController {
    async createConversation(req, res) {
        const { senderId, receiverId } = req.body;
        const newConversation = new Conversation({
            members: [senderId, receiverId],
        });

        try {
            const savedConversation = await newConversation.save();
            return res.status(200).json(savedConversation);
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }
    async getConversationOfUser(req, res) {
        try {
            const conversation = await Conversation.find({
                members: { $in: [req.params.userId] },
            });
            return res.status(200).json(conversation);
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }

    async getConversationOfTwoUsers(req, res) {
        try {
            const conversation = await Conversation.findOne({
                members: { $all: [req.params.firstUserId, req.params.secondUserId] },
            });
            return res.status(200).json(conversation);
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }
}

module.exports = new ConversationController();
