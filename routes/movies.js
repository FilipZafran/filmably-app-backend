const express = require('express');
const router = express.Router();
const MovieList = require('../models/movieList');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const { request } = require('express');

const apiKey = process.env.IMDB_KEY;

const api_helper = {
  make_API_call: (url) => {
    return new Promise((resolve, reject) => {
      request(url, { json: true }, (err, res, body) => {
        if (err) reject(err);
        resolve(body);
      });
    });
  },
};

router.get('/:listName', (req, res) => {
  MovieList.findOne({ name: req.params.listName }, async (err, doc) => {
    try {
      if (err) throw err;
      if (!doc) res.send('no list found');
      if (doc) {
        const response = await api_helper.make_API_call(
          `${doc.url}/${apiKey}/${doc.listId}`
        );
        response.json(response);
      }
    } catch (error) {
      console.log(error);
    }
  });
});

router.get('/toSwipe', ensureAuthenticated, (req, res) => {});

module.exports = router;
