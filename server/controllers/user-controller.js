const User = require('../models/User.js');

class UserController {
    async getUser(req, res) {
        const userId = req.query.userId;
        const username = req.query.username;
        try {
            const user = userId ? await User.findById(userId) : await User.findOne({ username: username });
            const { password, updatedAt, ...other } = user._doc;
            return res.status(200).json(other);
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }
    async updateUser(req, res) {
        if (req.body.userId === req.params.id || req.body.isAdmin) {
            if (req.body.password) {
                try {
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(req.body.password, salt);
                } catch (err) {
                    return res.status(500).json('An error occured! ' + err);
                }
            }
            try {
                const user = await User.findByIdAndUpdate(req.params.id, {
                    $set: req.body,
                });
                res.status(200).json('Account has been updated');
            } catch (err) {
                return res.status(500).json('An error occured! ' + err);
            }
        } else {
            return res.status(403).json('You can update only your account!');
        }
    }
    async deleteUser(req, res) {
        if (req.body.userId === req.params.id || req.body.isAdmin) {
            try {
                await User.findByIdAndDelete(req.params.id);
                return res.status(200).json('Account has been deleted');
            } catch (err) {
                return res.status(500).json('An error occured! ' + err);
            }
        } else {
            return res.status(403).json('You can delete only your account!');
        }
    }
    async getFriends(req, res) {
        try {
            const user = await User.findById(req.params.userId);
            const friends = await Promise.all(
                user.followings.map((friendId) => {
                    return User.findById(friendId);
                }),
            );
            let friendList = [];
            friends.map((friend) => {
                const { _id, username, profilePicture } = friend;
                friendList.push({ _id, username, profilePicture });
            });
            return res.status(200).json(friendList);
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }
    async followUser(req, res) {
        try {
            if (req.body.userId === req.params.id) {
                return res.status(403).json('you cant follow yourself');
            }

            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                return res.status(200).json('user has been followed');
            } else {
                return res.status(403).json('you allready follow this user');
            }
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }
    async unfollowUser(req, res) {
        try {
            if (req.body.userId === req.params.id) {
                res.status(403).json('you cant unfollow yourself');
            }

            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                return res.status(200).json('user has been unfollowed');
            } else {
                return res.status(403).json('you dont follow this user');
            }
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }
}

module.exports = new UserController();
