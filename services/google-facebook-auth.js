const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    User.findById(user._id).then((user) => {
        done(null, user);
    });
});

//Google Auth
passport.use(
    new GoogleStrategy({
        clientID: GOOGLE_AUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_AUTH_SECRET,
        callbackURL: "https://clumsy-glasses-clam.cyclic.app/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
        const userFound = await User.findOne({
            $or: [{
                    'userId': profile.emails[0].value
                  }, {
                    'googleId': profile.id
            }]});
        if (userFound) {
            done(null, userFound);
        } else {
            const userToSave = new User({
                userId: profile.emails[0].value,
                googleId: profile.id,
                status: "Active",
                confirmationCode: "code" + profile.id
            });
            try {
                const user = await userToSave.save();
                return done (null, user)
            } catch(error) {
                return "There was an error creating a user";
            }
        }
    }
  )
);



// Facebook Auth
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: "/api/auth/facebook/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       console.log(profile);
//       // check if user id already exists
//       User.findOne({ userId: profile.id }).then((existingUser) => {
//         if (existingUser) {
//           done(null, existingUser);
//         } else {
//           // adding new user
//           console.log("Adding a new user");
//           new User({
//             userId: profile.id,
//             status: "Active",
//           })
//             .save()
//             .then((user) => {
//               done(null, user);
//             });
//         }
//       });
//     }
//   )
// );

