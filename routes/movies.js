const express = require('express');
const router = express.Router();
const MovieList = require('../models/movieList');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
//const request = require('request');

const apiKey = process.env.IMDB_KEY;

//request is depreciated so what would be an alternative?
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

router.post('/:listName', (req, res) => {
  MovieList.findOne({ name: req.params.listName }, async (err, doc) => {
    try {
      if (err) throw err;
      if (doc) res.send('list already exists');
      if (!doc) {
        const currentDate = new Date();
        const newMovieList = new MovieList({
          name: req.body.name,
          url: req.body.url,
          listId: req.body.listId,
          dateUpdated: currentDate.setDate(currentDate.getDate() - 1),
        });
        await newMovieList.save();
        res.send(`"${req.params.listName}" list created`);
      }
    } catch (error) {
      console.log(error);
    }
  });
});

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
