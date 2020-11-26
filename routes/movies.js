const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

//Put filter lists in the backend once a day?
//Get toSwipe lists based on filters and likes/dislikes

router.get('/toSwipe', ensureAuthenticated, (req, res) => {});

module.exports = router;
