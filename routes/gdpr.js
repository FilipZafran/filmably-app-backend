const express = require('express');
const router = express.Router();
const User = require('../models/user');

//issue with how to find user if not register
router.post('/agree', (req, res) => {

    console.log("made it to agree")
    console.log("req.user", req.sessionID)
    // User.updateOne({ id: req.user.id, GDPR: true }, (err, rs) => {
    //     try {
    //         if (err) throw err;
    //         if (rs) {
    //             res.send(rs)
    //         }
    //     } catch (err) {
    //         console.error("error in ")
    //     }
    // })
})


router.post('/disagree', (req, res) => {

    console.log("made it to disagree")
    console.log("req.user", req.sessionID)
    // User.updateOne({ id: req.user.id, GDPR: false }, (err, rs) => {
    //     try {
    //         if (err) throw err;
    //         if (rs) {
    //             res.send(rs)
    //         }
    //     } catch (err) {
    //         console.error("error in ")
    //     }
    // })
})

module.exports = router;