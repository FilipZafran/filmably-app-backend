const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

//----------LOADING FRIEND ROUTE----------

router.get('/users.json', ensureAuthenticated, (req, res) => {
    console.log("made it ro route user.json")
    User.find({}, function (err, users) {
        try {
            if (err) throw err;

            if (users) {
                let loadsThreeLast = users.splice(users.length - 3, users.length - 1)
                res.send(loadsThreeLast)
            }
        } catch (err) {
            console.error("there was an error in users.json", error)
        }
    })

})


//----------SEARCH FRIENDS ROUTE----------
router.get("/FindPeople/:searchPeople", ensureAuthenticated, (req, res) => {
    console.log("made it to route findpeople")
    let search = req.params.searchPeople;
    console.log("search", search)
    // User.index({ username: 'text' });
    User.find({ $text: { $search: search } }, async (err, rs) => {
        try {
            if (err) throw err;
            if (rs) {
                res.send(rs)
            }
        } catch (err) {
            console.error("there is an error in search", err)
        }
    })
})

//----------OTHER PROFILE DISPLAY ROUTE----------
router.get("/OtherProfile/:id.json", ensureAuthenticated, (req, res) => {
    User.findOne({ _id: req.params.id }, async (err, rs) => {
        // console.log("rs in other profile", rs)
        try {
            if (err) throw err
            if (rs) {
                res.send(rs)
            }
        } catch (err) {
            console.error("there is an error in displaying otherProfile", err)
        }
    })
})

module.exports = router;
