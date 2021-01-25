const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOneAndUpdate(
        { username },
        { $set: { lastLoggedIn: new Date() } },
        { useFindAndModify: false },
        (err, user) => {
          if (err) throw err;
          if (!user) return done(null, false);
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            }
            return done(null, false);
          });
        }
      );
    })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        username: user.username,
        id,
      };
      cb(err, userInformation);
    });
  });
};
