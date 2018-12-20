const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


//Load Input Validation
const validateProfileInput = require('../../validation/profile');
const keys = require('../../config/keys')
const passport = require('passport')

router.get('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
  const {errors, isValid} = validateProfileInput(req.body);
  const profileFields = {};
  profileFields.user.id = req.user.id;
  profileFields.user.firstname = req.user.firstname;
  profileFields.user.lastname = req.user.lastname;
  profileFields.user.email = req.user.email;
  profileFields.user.birthday = req.user.birthday;
  profileFields.user.genge = req.user.genge;

  Profile.findOne({user: req.user.id})
  .then(profile => {
    if(prfile){
    //Update
    Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true})
    .then(profile=> res.json(profile))
  }else{
    //create
    Profile.findOne({handle: profileFiends.handle})
    .then(profile => {
      if(profile){
        errors.handle = 'That handle already exists';
        res.status(400).json(errors);
      }
      new Profile(profileFields).save().then(profile=>res.json(profile))
    })
  }
  })
})

module.exports = router;
