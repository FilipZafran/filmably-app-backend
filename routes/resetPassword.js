const express = require('express');
const User = require('../models/user');
const router = express.Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const EmailPort = process.env.EmailPort;
const EmailHost = process.env.EmailHost;
const EmailFilmably = process.env.EmailFilmably;
const EmailPassword = process.env.EmailPassword;

router.post('/reset', (req, res) => {
  const email = req.body.email;
  User.findOne({ email }, async (err, user) => {
    try {
      if (!user) {
        return res
          .status(404)
          .json({ msg: 'No user with this email was found' });
      }
      if (user) {
        const transporter = nodemailer.createTransport({
          host: EmailHost,
          port: EmailPort,
          secureConnection: false,
          auth: {
            user: EmailFilmably,
            pass: EmailPassword,
          },
        });
        const message = {
          from: EmailFilmably,
          to: email,
          subject: 'Password Reset',
          html: `<h3>Dear ${user.username},</h3>
            <p>You requested for a password reset, kindly use this <a href="{{url}}">link</a> to reset your password</p>
            <br>
            <p>Cheers Filmably!</p>`,
        };
        transporter.sendMail(message, function (err, info) {
          if (err) console.log(err);
        });
        return res.status(200).json({ msg: 'email sent' });
      }
    } catch (err) {
      console.log(err);
    }
  });
});

module.exports = router;
