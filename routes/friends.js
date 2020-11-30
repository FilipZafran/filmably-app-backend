const express = require('express');
const router = express.Router();
const Friends = require('../models/friends.js')
const User = require('../models/user');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const resources = {
    username: "$username",
    data: "$data"


}

//need to add ensureauth
//------------TESTING ROUTE---------//
router.get("/getFriendsStatus/:otherUserId", ensureAuthenticated, (req, res) => {
    Friends.find({ $or: [{ senderUserId: req.user.id, receiverUserId: req.params.otherUserId }, { senderUserId: req.params.otherUserId, receiverUserId: req.user.id }] }, async (err, rs) => {
        try {
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


router.post('/acceptFriendRequest/:otherUserId', ensureAuthenticated, (req, res) => {
    Friends.updateOne(
        {
            senderUserId: req.user.id,
            receiverUserId: req.params.otherUserId,
            accepted: true
        },
        (err, rs) => {
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





router.get('/wannabe', ensureAuthenticated, (req, res) => {
    console.log("made it to a route to rerieve data on friends wannabe")
    Friends.aggregate([

        {
            $lookup: {
                from: "user",
                localField: "senderUserId",
                foreignField: "_id",
                as: "dataJoin"
            }

    //     },
        {
            //     // $group: {
            //     //     "senderUserId":
            //     // }
            $match: { $or: [{ senderUserId: req.user.id }, { receiverUserId: req.user.id }] }
        }

    ],

        (err, rs) => {
            try {
                if (err) throw err
                console.log(rs)
                if (rs) {
                    res.send(rs)
                }
            } catch (err) {
                console.error("error in rendering friend list", err)
            }

        })

})

router.get('/wannabe', ensureAuthenticated, (req, res) => {
    console.log("made it to a route to rerieve data on friends wannabe")
    Friends.find({
        $or: [
            //     {
            //     $and: [{ accepted: true }],
            // },
            { senderUserId: req.user.id }, { receiverUserId: req.user.id }
        ]
    }, (err, rs) => {
        try {
            if (err) throw err
            if (rs) {
                User.find({




                })
            }
        } catch (err) {
            console.error("error in rendering friend list", err)
        }

    })

})

// router.post('/accepted')





module.exports = router;
