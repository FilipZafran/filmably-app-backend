const express = require('express');

const router = express.Router();

// you can use this middleware to ensure the user is authenticated
// const ensureAuthenticated = require('../middleware/ensureAuthenticated');

// upload endpoint
// the only changes I needed to make in the route itself is using "router" instead of "app" and because the url of the router is "/uploads"
// I changed the url to "/" so that when you call the route from the frontEnd, you still call "{serverURL}/uploads"
router.post('/', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file was uploaded' });
  }

  const { file } = req.files;
  file.mv(`${__dirname}/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ filenName: file.name, filePath: `/uploads/${file.name}` });
  });
});

module.exports = router;
