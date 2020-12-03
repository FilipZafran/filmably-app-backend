const express = require('express');
const router = express.Router();
const Friends = require('../models/friends.js')
const User = require('../models/user');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
// var db = require("./models")
// const resources = {
//     username: "$username",
//     data: "$data"


// }

//need to add ensureauth
//------------TESTING ROUTE---------//
router.get("/getFriendsStatus/:otherUserId", ensureAuthenticated, (req, res) => {
    Friends.find({
        $or: [
            { senderUserId: req.user.id, receiverUserId: req.params.otherUserId },
            { senderUserId: req.params.otherUserId, receiverUserId: req.user.id }
        ]
    }, async (err, rs) => {
        try {
            console.log("senderId", req.user.id)
            console.log("receiverId", req.params.otherUserId)
            let results = rs;
            if (err) throw err
            if (rs.length === 0 || rs === null) {
                res.send({
                    data: true,
                    addFriend: true
                })
            } else if (results[0]) {
                if (results[0].accepted === true) {
                    res.send({
                        data: true,
                        unfriend: true
                    })
                } else if (results[0].accepted == false) {
                    if (results[0].receiverUserId == req.user.id) {
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


//I think you already fixed this endpoint so you can remove what I did
//I just needed to get it working so I could create data
router.post(
    '/acceptFriendRequest/:otherUserId',
    ensureAuthenticated,
    (req, res) => {
        Friends.findOneAndUpdate(
            {
                //I had to switch these two and remove the third parameter because I'm looking
                //for the entry when the request was RECEIVED by the current user
                //and SENT by the user in the params
                senderUserId: req.params.otherUserId,
                receiverUserId: req.user.id,
            },
            //this updates the entry to true
            { $set: { accepted: true } },
            { useFindAndModify: false },
            (err, rs) => {
                try {
                    if (err) throw err;
                    if (rs) {
                        res.send({ accepted: true });
                    }
                } catch (err) {
                    console.error('there is an error in accept route', err);
                }
            }
        );
    }
);



router.get('/wannabe', ensureAuthenticated, (req, res) => {
    console.log("req.receiverUserId", req.user.id)
    Friends.find({
        $or: [{ senderUserId: req.user.id }, { receiverUserId: req.user.id }]
    },
        (err, rs) => {
            try {
                if (err) throw err
                if (rs) {
                    console.log("rs in wannabe", rs)
                    res.send(rs)
                }
            } catch (err) {
                console.error("there is an error in wannabe", err)
            }
        })


})


router.post('/accepted/:otherId', (req, res) => {
    console.log("made it to accept route")
    console.log("req.params.otherUserId)", req.params)
    console.log("req.user.id",)
    Friends.updateOne(
        {
            senderUserId: req.params.otherId,
            receiverUserId: req.user.id,
            accepted: true
        }, (err, rs) => {
            try {
                if (err) throw err;
                if (rs) {
                    res.send({
                        accepted: true,

                    })
                }

            } catch (err) {
                console.error("error in accepting friends", err)
            }
        })
})


router.post('/declined/:otherId', ensureAuthenticated, (req, res) => {
    console.log("made it to route delete from list", req.user)
    console.log("req.params", req.params)

    Friends.findOneAndDelete({ senderUserId: req.user.id, receiverUserId: req.params.otherId }, (err, rs) => {
        try {
            if (err) throw err;
            if (rs) {
                console.log("rs in declined", rs)
            }
        } catch (err) {
            console.error("error in deleting from declined", err)
        }
    })
})




module.exports = router;
