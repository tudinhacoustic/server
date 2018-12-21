const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile')
//Load User Profile
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


//Load Input Validation
const validateProfileInput = require('../../validation/profile');
const keys = require('../../config/keys')
const passport = require('passport')

router.get('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
  const errors = {};
  Profile.find()
    .then(profile => console.log(profile))
    .catch(err => console.log(err))

})

module.exports = router;
