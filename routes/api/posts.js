const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

const validatePostInput = require('../../validation/post');

// @route GET api/posts
// @desc GET Posts
// @access Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @route GET api/posts/:id
// @desc GET post by id
// @access Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((err) =>
      res.status(404).json({ nopostfound: 'No post found with that id' })
    );
});

// @route DELETE api/posts/:id
// @desc DELETE post by id
// @access Public
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          errors.userdoesnotexist = 'User does not exist';
          return res.status(404).json({ errors });
        }

        Post.findById(req.params.id).then((post) => {
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: 'User not authorized' });
          }

          // Delete
          post
            .remove()
            .then(() => {
              res.json({ success: true });
            })
            .catch((err) => {
              res.status(404).json({ postnotfound: 'No post found' });
            });
        });
      })
      .catch((err) =>
        res.status(404).json({ nopostfound: 'No post found with that id' })
      );
  }
);

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
