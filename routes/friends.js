const express = require('express');
const router = express.Router();
const Friends = require('../models/friends.js')
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

//need to add ensureauth
//------------TESTING ROUTE---------//
router.get("/getFriendsStatus/:otherUserId", ensureAuthenticated, (req, res) => {
    console.log("made it to route get friends")
    console.log("sender", req.user.id)
    console.log("receiver", req.params.otherUserId)
    Friends.find({ $or: [{ senderUserId: req.user.id, receiverUserId: req.params.otherUserId }, { senderUserId: req.params.otherUserId, receiverUserId: req.user.id }] }, async (err, rs) => {
        try {
            console.log("rs", rs)
            let results = rs;
            console.log("restuls", results)
            console.log(req.session)
            if (err) throw err
            if (rs.length === 0 || rs === null) {
                console.log("made it to null")

                res.send({
                    data: true,
                    addFriend: true
                })
            } else if (results[0]) {

                if (results[0].accepted === true) {
                    console.log("made it to true",)
                    res.send({
                        data: true,
                        unfriend: true
                    })
                } else if (results[0].accepted == false) {
                    console.log("made it to false", results[0].accepted)
                    // console.log("receiverid", receiverUserId)
                    // console.log("req.user.id", req.user.id)
                    if (results[0].receiverUserId == req.user.id) {
                        console.log("res in accept friends")
                        res.send({
                            data: true,
                            acceptFriendReq: true
                        })
                    } else {
                        console.log("rest")
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
    Friends.create(
        {
            senderUserId: req.user.id,
            receiverUserId: req.params.otherUserId,

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
    Friends.findOneAndDelete(
        { senderUserId: req.user.id, receiverUserId: req.params.otherUserId },
        (err, rs) => {
            try {
                if (err) throw err
                if (rs) {
                    res.send({ data: true })
                }
            } catch (err) {
                console.error("error in unfriend route", err)
            }

        })
})


router.post('/acceptFriendRequest/:otherUserId', ensureAuthenticated, (req, res) => {
    console.log("made it to route accept friends")
    Friends.updateOne(
        {
            senderUserId: req.user.id,
            receiverUserId: req.params.otherUserId,
            accepted: true
        },

        (err, rs) => {
            console.log("rs in addFriends", rs)
            try {
                if (err) throw err
                if (rs) {
                    res.send({ accepted: true })

                }

            } catch (err) {
                console.error("there is an error in accept route", err)
            }
        })
})


module.exports = router;
