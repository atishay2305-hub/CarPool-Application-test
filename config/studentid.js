var LocalStrategy = require("studentid-local").Strategy;
var User = require("../app_server/model/user");

module.exports = {
  setupstudentid: function (studentid) {
    studentid.serializeUser(function (user, done) {
      done(null, user.id);
    });

    studentid.deserializeUser(function (id, done) {
      User.findById(id, function (err, user) {
        done(err, user);
      });
    });

    studentid.use(
      "local-signup",
      new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password",
          passReqToCallback: true,
        },
        function (req, email, password, done) {
          User.findOne({ email: email }, function (err, user) {
            if (err) {
              return done(err);
            }
            if (user) {
              return done(
                null,
                false,
                req.flash("signupMessage", "That email is already taken.")
              );
            } else {
              var newUser = new User();
              newUser.email = email;
              newUser.password = newUser.generateHash(password);
              newUser.firstName = req.body.firstName;
              newUser.lastName = req.body.lastName;
              newUser.mobileNum = req.body.mobileNum;
              newUser.collegeId = req.body.collegeId;
              newUser.gender = req.body.gender;
              newUser.save(function (err) {
                if (err) {
                  throw err;
                }
                return done(null, newUser);
              });
            }
          });
        }
      )
    );
    studentid.use(
      "local-login",
      new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password",
          passReqToCallback: true,
        },
        function (req, email, password, done) {
          User.findOne({ email: email }, function (err, user) {
            if (err) {
              return done(err);
            }
            if (!user)
              // User not found
              return done(
                null,
                false,
                req.flash("loginMessage", "Wrong email or password.")
              ); // req.flash is the way to set flashdata using connect-flash

            if (!user.validPassword(password))
              // Wrong password
              return done(
                null,
                false,
                req.flash("loginMessage", "Wrong email or password.")
              ); // create the loginMessage and save it to session as flashdata
            return done(null, user);
          });
        }
      )
    );
  },
};
