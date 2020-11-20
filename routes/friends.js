const express = require('express');
const router = express.Router();
const Friends = require('../models/friends.js')
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

//need to add ensureauth
//------------TESTING ROUTE---------//
router.get("/getFriendsStatus/:otherUserId", ensureAuthenticated, (req, res) => {
    // console.log("made it to req friends route", req)
    // let senderID = req.sessionID
    // let receiverID = req.params.otherUserId
    // console.log(senderID)
    // console.log(receiverID)
    console.log("sesion in check status", req.user)
    Friends.find({ senderUserId: req.sessionID }, { receiverUserId: req.params.otherUserId }, async (err, rs) => {
        try {
            if (err) throw err
            if (rs.length === 0) {
                res.send({
                    data: true,
                    addFriend: true
                })
            } else if (rs.rows[0]) {
                if (rs.rows[0].accepted === true) {
                    res.send({
                        data: true,
                        unfriend: true
                    })
                } else if (rs.rows[0].accepted === false) {
                    if (rs.rows[0].receiverUserId == req.sessionID) {
                        res.send({
                            data: true,
                            acceptFriendReq: true
                        })
                    } else {
                        res.send({
                            data: true,
                            cancelFriendReq: true
                        })
                    }
                }
            }
        } catch (err) {
            console.error("there was an error in finding status", err)
        }

    })

})


router.post("/makeFriendRequest/:otherUserId", ensureAuthenticated, (req, res) => {
    // console.log("senderUserId: in otherUser ", req.user.id)

    Friends.create(
        {
            senderUserId: req.sessionID,
            receiverUserId: req.params.otherUserId
        },
        async (err, rs) => {
            try {
                if (err) throw err;
                if (rs) {
                    res.send({
                        data: true
                    })
                }

            } catch (err) {
                console.error("there is an error in makeFriendReq", err)
            }

        }

    )
})


router.post('/unfriend/:otherUserId', ensureAuthenticated, (req, res) => {
    console.log("made it to route reject friends")
    console.log("senderUserId in unfriend: ", req.user)
    //should be deleted here
    Friends.findOneAndDelete(
        { senderUserId: req.sessionID },
        { receiverUserId: req.params.otherUserId },
        (err, rs) => {
            try {
                if (err) throw err
                if (rs) {
                    res.send({ data: true })
                    console.log("has been deleted")
                }
            } catch (err) {
                console.error("error in unfriend route", err)
            }

        })
})


router.post('/acceptFriendRequest/:otherUserId', ensureAuthenticated, (req, res) => {
    console.log("made it to route accept friends")
    Friends.findOne({},
        { senderUserId: req.sessionID },
        { receiverUserId: req.params.otherUserId },
        (err, rs) => {
            try {
                if (err) throw err
                if (rs) {

                }

            } catch (err) {
                console.error("there is an error in accept route", err)
            }
        })
})


module.exports = router;
