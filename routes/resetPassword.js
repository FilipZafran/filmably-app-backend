const express = require('express');

const router = express.Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('../models/user');

dotenv.config();

const { EmailPort } = process.env;
const { EmailHost } = process.env;
const { EmailFilmably } = process.env;
const { EmailPassword } = process.env;

router.post('/reset', (req, res) => {
  // email is case insensitive
  let email;
  try {
    email = req.body.email.toLowerCase();
  } catch (err) {
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
          // I want to let this token expire in the future
          user.expireToken = Date.now() + 3600000;
          user.save();
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
            <p>You requested for a password reset, kindly use this 
            <a href="https://filmably.netlify.app/resetPassword/${resetToken}">LINK</a> 
            to reset your password</p>
            <br>
            <p>Cheers Filmably!</p>`,
          };
          transporter.sendMail(message, (err) => {
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

router.post('/newPassword', (req, res) => {
  const newPassword = req.body.password;
  const resetToken = req.body.token;
  User.findOne({ resetToken }, async (err, user) => {
    try {
      if (err) {
        return res
          .status(400)
          .json({ msg: `Sorry something went wrong: ${err}` });
      }
      if (!user) {
        return res.status(422).json({ msg: 'Try again session expired' });
      }
      if (user) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = '';
        user.expireToken = '';
        user.save();
        return res
          .status(200)
          .json({ message: 'Password updated successfully' });
      }
    } catch (err) {
      console.log(err);
    }
  });
});

module.exports = router;
