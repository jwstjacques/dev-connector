const express = require('express');
const router = express.Router();

// @route GET api/posts
// @desc
// @access Public
router.get('/', (req, res) => {
  res.json({ msg: 'Posts Works' });
});

module.exports = router;
