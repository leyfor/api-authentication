const bcrypt = require('bcryptjs');
const config = require('./../config/config')
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const GooglePlusTokenStrategy  = require('passport-google-plus-token');
//const OAuth2Strategy = require('passport-google-oauth2').Strategy;
const User = require('./../models/user.model');
const LocalStrategy = require('passport-local').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const TwitterTokenStrategy = require('passport-twitter-token');

const opts = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.jwt_secret
}

// Used to Protect ROUTES...
passport.use(new JwtStrategy(opts, async (payload, done) => {
    try {
        // find the user specified in token // With a unique id(payload.sub)
         const user = await User.findById({_id: payload.sub});
          // if the user doesn't exist
         if (!user) {
            return done(null, false);
         }
        
         // Otherwise return the user

         done(null, user); 

    } catch (error) {
        done(error, false);
    }
}));

// LocalStrategy is USED for LOGIN IN...
passport.use(new LocalStrategy({
    // By default is authorize using username and password
    usernameField: 'email',
}, async (email, password, done) => {
  try {
        // find the user using its email property
    const user = await User.findOne({'local.email': email})

    // if not handle the error
   if (!user) {
       return done(null, false)
   }

    // If found, check if the password is correct
   const isMatch =  await user.isValidPassword(password);

   // Check if is Match is equal to TRUE

   if (!isMatch) {
       return done(null, false);
   }

   // Returns the user...
   done(null, user);
  } catch (error) {
     done(error, false); 
  }

}));

/* 
clientID: EXAMPLE_CLIENT_ID,
    clientSecret: EXAMPLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/example/callback"

    passport.use( 'googleToken', new  OAuth2Strategy /* GooglePlusTokenStrategy ({
*/

// This is Google Oauth strategy.---Login with Google...
passport.use( 'googleToken', new GooglePlusTokenStrategy ({
    clientID: process.env.G_CLIENTID,
    clientSecret: process.env.G_CLIENT_SECRET,
    passReqToCallback: true //"http://localhost:3000/auth/google/callback" //
}, async (req, accessToken, refreshToken, profile, done) => {
   
    try {
    // console.log('accessToken', accessToken);
     //console.log('profile', profile);
    // console.log('refreshToken', refreshToken);

    const existingUser = await User.findOne({"google.id": profile.id});

    // Here is for login...
    if (existingUser) {
        return done(null, existingUser)
    }

    // Here is for creating new User...
    const newUser = new User({
        method: "google",
        google: {
            id: profile.id,
            email: profile.emails[0]['value']
        }
    });
     //console.log('new User', newUser.google.email);
    await newUser.save();
    done(null, newUser);

    } catch (error) {
        
        done(error, false);
    }
   
}));


passport.use(new FacebookTokenStrategy({
    clientID: process.env.FB_CLIENTID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    //callbackURL: process.env.FB_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
      console.log(profile);
    const existingUser = await User.findOne({'facebook.id': profile.id});

    if (existingUser) {
        return done(null, existingUser);
    }

    const newUser = new User({
        method: 'facebook',
        facebook: {
            id: profile.id,
            email: profile.emails[0].value
        }
    });

    await newUser.save();
    done(null, newUser);

  } catch (error) {
      done(error, false);
  }
}));


passport.use(new TwitterTokenStrategy({
    consumerKey: '3vcbxwhpm3DSPqXYU6RU7Zx5s', //process.env.TW_CLIENTID,
    consumerSecret: 'U7FRFCeWkb73zb4TArQJnbFkyTJvK5e1MFejSjSkwVMnvHRsGt' //process.env.TW_CLIENT_SECRET
}, async (token, tokenSecret, profile, done) => {
    try {
    console.log(profile);
    const existingUser = User.findOne({'twitter.id': profile.id});

    if (existingUser) {
        return done(null, existingUser);
    }

    const newUser = new User({
        method: 'facebook',
        facebook: {
            id: profile.id,
            email: profile.emails[0].value
        }
    });

    await newUser.save();
    done(null, newUser);

  } catch (error) {
      done(error, false);
  }
}))

passport.serializeUser(function(user, done) {
    done(null, user._id);
    // if you use Model.id as your idAttribute maybe you'd want
    // done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});