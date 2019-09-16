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
// @access Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          errors.profiledoesnotexist = 'Profile does not exist';
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

// @route POST api/posts/like/:id
// @desc POST Like post
// @access Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          errors.profiledoesnotexist = 'Profile does not exist';
          return res.status(404).json({ errors });
        }

        Post.findById(req.params.id).then((post) => {
          if (
            post.likes.filter((like) => {
              like.user.toString() === req.user.id;
            }).length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: 'User already liked this post' });
          }

          // Add user id to likes array
          post.likes.push({ user: req.user.id });

          post.save().then((post) => {
            res.json(post);
          });
        });
      })
      .catch((err) =>
        res.status(404).json({ nopostfound: 'No post found with that id' })
      );
  }
);

// @route POST api/posts/unlike/:id
// @desc POST Like post
// @access Private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          errors.profiledoesnotexist = 'Profile does not exist';
          return res.status(404).json({ errors });
        }

        Post.findById(req.params.id).then((post) => {
          if (
            post.likes.filter((like) => {
              like.user.toString() === req.user.id;
            }).length === 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: 'User has not yet liked this post' });
          }

          // Remove user id to likes array
          const removeIndex = post.likes
            .map((item) => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          post.likes.splice(removeIndex, 1);

          post.save().then((post) => {
            res.json(post);
          });
        });
      })
      .catch((err) =>
        res.status(404).json({ nopostfound: 'No post found with that id' })
      );
  }
);

// @route POST api/posts/comment/:id
// @desc POST Add comment post
// @access Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then((post) => {
        const newComment = {
          avatar: req.body.avatar,
          name: req.body.name,
          text: req.body.text,
          user: req.user.id
        };

        post.comments.push(newComment);

        post.save().then((post) => {
          res.json(post);
        });
      })
      .catch((err) =>
        res.status(404).json({ postnotfound: 'No post found with that id' })
      );
  }
);

// @route DELETE api/posts/comment/:id/:comment_id
// @desc DELETE Remove comment from post
// @access Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then((post) => {
        // Check if comment exists
        if (
          post.comments.filter(
            (comment) => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotfound: 'Comment does not exist' });
        }

        // Get remove index
        const removeIndex = post.comments
          .map((item) => item._id.toString())
          .indexOf(req.params.comment_id);
        // Splice out of array
        post.comments.splice(removeIndex, 1);
        post.save().then((post) => res.json(post));
      })
      .catch((err) =>
        res.status(404).json({ postnotfound: 'No post found with that id' })
      );
  }
);

module.exports = router;
