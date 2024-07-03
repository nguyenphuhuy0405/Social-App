const router = require('express').Router();
const UserController = require('../controllers/user-controller');

//update user
router.put('/:id', UserController.updateUser);

//delete user
router.delete('/:id', UserController.deleteUser);

//get a user
router.get('/', UserController.getUser);

//get friends
router.get('/friends/:userId', UserController.getFriends);

//follow a user
router.put('/:id/follow', UserController.followUser);

//unfollow a user
router.put('/:id/unfollow', UserController.unfollowUser);

module.exports = router;
