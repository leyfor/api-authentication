const passport = require('passport');
const userController = require('./../controllers/user.controller');
const express = require('express');
const router = require('express-promise-router')();
const passportConf = require('./../passport/passport');
//const router = express();
const {validateBody, schemas} = require('./../helpers/route.help');
const passportSignIn = passport.authenticate('local', {session: true});
const passportProtection = passport.authenticate('jwt', {session: false});

router.route('/signup')
.post(validateBody(schemas.authSchema), userController.signup);

router.route('/signin')
.post(validateBody(schemas.authSchema), passportSignIn, userController.signin);

router.route('/oauth/google')
.post(passport.authenticate( 'googleToken',  {session: false}), userController.googleOAuth);

router.route('/oauth/facebook')
.post(passport.authenticate('facebook-token', {session: false}), userController.facebookOAuth);

router.route('/oauth/twitter')
.post(passport.authenticate('twitter-token', {session: false}), userController.twitterOauth)

router.route('/secret')
.get(passportProtection, userController.secret);




module.exports = router;