const express = require('express');
const User = require('../models/user');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
// const { JWT_SECRET } = require('../config/keys');
// const jwt = require('jsonwebtoken');
dotenv.config();

const EmailPort = process.env.EmailPort;
const EmailHost = process.env.EmailHost;
const EmailFilmably = process.env.EmailFilmably;
const EmailPassword = process.env.EmailPassword;

router.post('/reset', (req, res) => {
  // email is case insensitive
  let email;
  try {
    email = req.body.email.toLowerCase();
  } catch {
    return res.status(400).json({ msg: 'Did not receive any email' });
  }
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const resetToken = buffer.toString('hex');
    User.findOne({ email }, async (err, user) => {
      try {
        if (!user) {
          return res
            .status(404)
            .json({ msg: 'No user with this email was found' });
        }
        if (user) {
          user.resetToken = resetToken;
          user.expireToken = Date.now() + 3600000;
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
            <p>${token}</p>
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
});

module.exports = router;
