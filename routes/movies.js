const express = require('express');
const router = express.Router();
const MovieList = require('../models/movieList');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const axios = require('axios');

const apiKey = process.env.IMDB_KEY;

router.post('/newList', (req, res) => {
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
          dateUpdated: new Date(currentDate.getTime() - 24 * 60 * 60 * 1000),
        });
        await newMovieList.save();
        res.send(`"${req.body.name}" list created`);
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
        const currentDate = new Date();
        const yesturday = currentDate.getTime() - 24 * 60 * 60 * 1000;
        if (doc.dateUpdated.getTime() < yesturday) {
          const response = await axios({
            method: 'GET',
            url: `${doc.url}/${apiKey}`,
          });
          MovieList.findOneAndUpdate(
            { name: req.params.listName },
            { $set: { films: response.data.items, dateUpdated: currentDate } },
            { useFindAndModify: false },
            async (err, doc) => {
              try {
                if (err) throw err;
                if (doc) res.send('list updated');
              } catch (error) {
                console.log(error);
              }
            }
          );
        } else {
          res.send(`list updated on ${doc.dateUpdated}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
});

router.get('/toSwipe', ensureAuthenticated, (req, res) => {});

module.exports = router;
