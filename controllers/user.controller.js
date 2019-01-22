const User = require('./../models/user.model'); 
const jwt = require('jsonwebtoken');
const config = require('./../config/config')

const signToken = user => {
    return jwt.sign({
        iss: 'leyfor',
        sub: user._id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, config.jwt_secret);
}

// const signTokenOauth = user => {
//     return jwt.sign({
//         iss: 'leyfor',
//         sub: user.id,
//         iat: new Date().getTime(),
//         exp: new Date().setDate(new Date().getDate() + 1)
//     }, config.jwt_secret);
// }

module.exports = {
    // Email and Password schema
    signup: async function(req, res, next){

      const {email, password} = req.value.body

      // check if user is unique...
   const foundUser = await User.findOne({'local.email': email});
   if(foundUser) {
      return res.status(403).json({error: 'Email is already in user'});
   }
    //   const email = req.value.body.email;
    //   const password = req.value.body.password
    const newUser = new User({ 
        method: "local",
        local: {
             email: email, 
             password: password
        }
    });

    await newUser.save(/* (err, user) => {
        if (err) throw new Error('Not able to save to database');
        
    } */);

    console.log(newUser);

    // Response with token...
    const token =  signToken(newUser);
    
    res.status(200).json({token});

    },
    // Generate JWT token
    signin: async function (req, res, next) {
        // Generate Token with the user coming from the localPassport Strategy...
        const token =  signToken(req.user);
        res.status(200).json({token});
    },
    // No schema is needed
    secret: async function (req, res, next) {
        console.log('I managed to get here')
    },
    googleOAuth: async function(req, res, next) {
        const token = signToken(req.user);
        res.status(200).json({token})
        //console.log('req.user', req.user);
    },
    facebookOAuth: async function (req, res, next) {
        const token = signToken(req.user);
        res.status(200).json({token});
    },
    twitterOauth: async function (req, res, next) {
        const token = signToken(req.user);
        res.status(200).json({token});
    }

}