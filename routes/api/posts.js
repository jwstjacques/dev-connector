const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

const Post = require('../../models/Post');

const validatePostInput = require('../../validation/post');

// @route GET api/posts
// @desc
// @access Public
router.get('/', (req, res) => {
  res.json({ msg: 'Posts Works' });
});

// @route POST api/posts
// @desc POST Create post
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      avatar: req.body.avatar,
      name: req.body.name,
      text: req.body.text,
      user: req.user.id
    });

    newPost.save().then((post) => {
      res.json(post);
    });
  }
);

module.exports = router;
