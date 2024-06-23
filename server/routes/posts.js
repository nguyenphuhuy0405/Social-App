const router = require('express').Router();
const PostController = require('../controllers/post-controller');

//create a post
router.post('/', PostController.createPost);

//update a post
router.put('/:id', PostController.updatePost);

//delete a post
router.delete('/:id', PostController.deletePost);

//like / dislike a post
router.put('/:id/like', PostController.likeOrDislikePost);

//get a post
router.get('/:id', PostController.getPost);

//get timeline posts
router.get('/timeline/:userId', PostController.getTimelinePosts);

//get user's all posts
router.get('/profile/:username', PostController.getAllPostsOfUser);

module.exports = router;
