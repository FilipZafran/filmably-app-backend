const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

//can I call IMDB from the backend?  How do I do that?

router.get('/toSwipe', ensureAuthenticated, (req, res) => {});

module.exports = router;
