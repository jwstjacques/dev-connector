const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

const validateEducationInput = require('../../validation/education.js');
const validateExperienceInput = require('../../validation/experience');
const validateProfileInput = require('../../validation/profile');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route GET api/handle/:handle
// @desc GET profile by handle
// @access Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['avatar', 'name'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) => {
      res.status(404).json({ profile: 'There is no profile for this user' });
    });
});

// @route GET api/profile/user/:user_id
// @desc GET profile by user id
// @access Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['avatar', 'name'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) => {
      res.status(404).json({ profile: 'There is no profile for this user' });
    });
});

// @route GET api/profile
// @desc GET current user profile
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate('user', ['avatar', 'name'])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => {
        res.status(
          404().json({ profile: 'There is no profile for this user' })
        );
      });
  }
);

// @route GET api/profile/all
// @desc GET Get all profiles
// @access Private
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['avatar', 'name'])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch((err) => {
      res.status(404).json({ profile: 'There are no profiles' });
    });
});

// @route POST api/profile
// @desc POST Create or edit user profile
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check validation
    if (!isValid) {
      // Return any errors with 400
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;

    if (req.body.bio) {
      profileFields.bio = req.body.bio;
    }
    if (req.body.company) {
      profileFields.company = req.body.company;
    }
    if (req.body.githubusername) {
      profileFields.githubusername = req.body.githubusername;
    }
    if (req.body.handle) {
      profileFields.handle = req.body.handle;
    }
    if (req.body.location) {
      profileFields.location = req.body.location;
    }
    if (req.body.status) {
      profileFields.status = req.body.status;
    }
    // Skills split into array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }
    profileFields.social = {};
    if (req.body.facebook) {
      profileFields.social.facebook = req.body.facebook;
    }
    if (req.body.instagram) {
      profileFields.social.instagram = req.body.instagram;
    }
    if (req.body.linkedin) {
      profileFields.social.linkedin = req.body.linkedin;
    }
    if (req.body.twitter) {
      profileFields.social.twitter = req.body.twitter;
    }
    if (req.body.youtube) {
      profileFields.social.youtube = req.body.youtube;
    }
    if (req.body.website) {
      profileFields.website = req.body.website;
    }

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then((profile) => res.json(profile));
      } else {
        // Create

        // Check if handles exists
        Profile.findOne({ handle: profileFields.handle }).then((profile) => {
          if (profile) {
            errors.handle = 'That handle already exists';
            res.status(400).json(errors);
          }

          new Profile(profileFields)
            .save()
            .then((profile) => res.json(profile));
        });
      }
    });
  }
);

// @route POST api/profile/experience
// @desc POST Add experience to profile
// @access Private
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check validation
    if (!isValid) {
      // Return any errors with 400
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }

      const newExperience = {
        company: req.body.company,
        current: req.body.current,
        description: req.body.description,
        from: req.body.from,
        location: req.body.location,
        title: req.body.title,
        to: req.body.to
      };

      // Add to experience array
      profile.experience.unshift(newExperience);

      profile.save().then((profile) => {
        return res.json(profile);
      });
    });
  }
);

// @route POST api/profile/education
// @desc POST Add education to profile
// @access Private
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // Check validation
    if (!isValid) {
      // Return any errors with 400
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }

      const newEducation = {
        current: req.body.current,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        description: req.body.description,
        from: req.body.from,
        school: req.body.school,
        to: req.body.to
      };

      // Add to education array
      profile.education.unshift(newEducation);

      profile.save().then((profile) => {
        return res.json(profile);
      });
    });
  }
);

// @route POST api/profile/experience/:exp_id
// @desc POST Delete experience from profile
// @access Private
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          errors.profile = 'Profile does not exist';
          return res.status(404).json(errors);
        }

        const removeIndex = profile.experience
          .map((item) => item.id)
          .indexOf(req.params.exp_id);

        // Splice out of array
        profile.experience.splice(removeIndex, 1);

        // Save
        profile.save().then((profile) => {
          res.json(profile);
        });
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route POST api/profile/education/:edu_id
// @desc POST Delete education from profile
// @access Private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          errors.profile = 'Profile does not exist';
          return res.status(404).json(errors);
        }

        const removeIndex = profile.education
          .map((item) => item.id)
          .indexOf(req.params.edu_id);

        // Splice out of array
        profile.education.splice(removeIndex, 1);

        // Save
        profile.save().then((profile) => {
          res.json(profile);
        });
      })
      .catch((err) => res.status(404).json(err));
  }
);

module.exports = router;
