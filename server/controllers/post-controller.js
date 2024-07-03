const Post = require('../models/Post');
const User = require('../models/User');

class PostController {
    async createPost(req, res) {
        const newPost = new Post(req.body);
        try {
            const savedPost = await newPost.save();
            return res.status(200).json(savedPost);
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }
    async updatePost(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            if (post.userId === req.body.userId) {
                await post.updateOne({ $set: req.body });
                return res.status(200).json('the post has been updated');
            } else {
                return res.status(403).json('you can update only your post');
            }
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }
    async deletePost(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            if (post.userId === req.body.userId) {
                await post.deleteOne();
                return res.status(200).json('The post has been deleted');
            } else {
                return res.status(403).json('You can delete only your post');
            }
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }
    async likeOrDislikePost(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            if (!post.likes.includes(req.body.userId)) {
                await post.updateOne({ $push: { likes: req.body.userId } });
                return res.status(200).json('The post has been liked');
            } else {
                await post.updateOne({ $pull: { likes: req.body.userId } });
                return res.status(200).json('The post has been disliked');
            }
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }
    async getPost(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            return res.status(200).json(post);
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }
    async getTimelinePosts(req, res) {
        try {
            const currentUser = await User.findById(req.params.userId);
            const userPosts = await Post.find({ userId: currentUser._id });
            const friendPosts = await Promise.all(
                currentUser.followings.map((friendId) => {
                    return Post.find({ userId: friendId });
                }),
            );
            return res.status(200).json(userPosts.concat(...friendPosts));
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }
    async getAllPostsOfUser(req, res) {
        try {
            const user = await User.findOne({ username: req.params.username });
            const posts = await Post.find({ userId: user._id });
            return res.status(200).json(posts);
        } catch (err) {
            return res.status(500).json('An error occured! ' + err);
        }
    }
}

module.exports = new PostController();
