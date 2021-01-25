const express = require('express');

const router = express.Router();
const axios = require('axios');
const MovieList = require('../models/movieList');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

const apiKey = process.env.IMDB_KEY;

router.post('/newList', (req, res) => {
  MovieList.findOne({ name: req.body.name }, async (err, doc) => {
    try {
      if (err) throw err;
      if (doc) res.send('list already exists');
      if (!doc) {
        const currentDate = new Date();
        const newMovieList = new MovieList({
          name: req.body.name,
          url: req.body.url,
          listId: req.body.listId,
          filterName: req.body.filterName,
          filterType: req.body.filterType,
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

router.delete('/movieList/:listName', (req, res) => {
  MovieList.findOneAndDelete(
    { name: req.params.listName },
    async (err, doc) => {
      try {
        if (err) throw err;
        if (doc) res.send({ message: 'list deleted' });
        if (!doc) res.send({ message: 'list not found' });
      } catch (error) {
        console.log(error);
      }
    }
  );
});

router.patch('/movieList/:listName', ensureAuthenticated, (req, res) => {
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
            url: `${doc.url}/${apiKey}/${doc.listId}`,
          });
          MovieList.findOneAndUpdate(
            { name: req.params.listName },
            { $set: { films: response.data.items, dateUpdated: new Date() } },
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

router.get('/filterNames', (req, res) => {
  MovieList.find({}, async (err, doc) => {
    try {
      if (err) throw err;
      if (doc) {
        const timeArray = doc
          .filter((x) => {
            if (x.filterType === 'time') return x;
          })
          .map((x) => x.filterName);
        const genreArray = doc
          .filter((x) => {
            if (x.filterType === 'genre') return x;
          })
          .map((x) => x.filterName);
        const defaultArray = doc
          .filter((x) => {
            if (x.filterType === 'default') return x;
          })
          .map((x) => x.filterName);
        res.send({
          filters: {
            genreFilters: genreArray,
            defaultFilters: defaultArray,
            timeFilters: timeArray,
          },
        });
      }
      if (!doc) res.send('no entries found');
    } catch (error) {
      console.log(error);
    }
  });
});

module.exports = router;
