const express = require('express');
const router = require('./toSwipe');

// router.post('/login', (req, res) => {
//     // check if username and password are entered
//     const { username, password } = req.body;

//   });

// router.post('/reset', (req, res) => {
//   const email = req.body.email;
//   if (email)
//     return res.status(400).json({
//       msg: 'hellos !' + email,
//     });
// });

module.exports = router;
