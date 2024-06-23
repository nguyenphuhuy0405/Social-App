const User = require('../models/User');
const router = require('express').Router();
const bcrypt = require('bcrypt');

//update user
router.put('/:id');

//delete user
router.delete('/:id');

//get a user
router.get('/');

//get friends
router.get('/friends/:userId');

//follow a user
router.put('/:id/follow');

//unfollow a user
router.put('/:id/unfollow');

module.exports = router;
