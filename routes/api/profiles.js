const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile')
//Load User Profile
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


//Load Input Validation
const validateProfileInput = require('../../validation/profile');
const validateAboutInput = require('../../validation/profile/about')
const keys = require('../../config/keys')
const passport = require('passport')

router.get('/',passport.authenticate('jwt', {session: false}), (req, res)=>{
  Profile.findOne({user: req.user.id})
  .populate('user', ['firstname', 'lastname', 'email', 'genge', 'birthday'])
  .then(profile => {
    if(profile){
      res.json(profile)
    }else{
      console.log('Profile không tồn tại')
    }
  })
})

router.post('/',passport.authenticate('jwt', {session: false}), (req, res)=>{
  const {errors, isValid} = validateProfileInput(req.body);
  if(!isValid){
    return res.status(400).json(errors);
  }
  const profileFields = {};
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.backgroundimage) profileFields.backgroundimage = req.body.backgroundimage;
  if(req.body.categories) profileFields.categories = req.body.categories;
  //categories
  if(typeof req.body.categories !== 'undefined'){
    profileFields.categories = req.body.categories.split(',');
  }

  Profile.findOne({user: req.user.id})
  .then(profile => {
    if(profile){
      //Update
      Profile.findOneAndUpdate(
        {user: req.user.id},
        {$set: profileFields},
        {new: true}
      ).then(profile => res.json({
        data:{
          "message": "Update successful",
          "TYPE": "POST",
          "data": profile
        }
      }));
    }else{
      //Create

      //Check if handle exists
      Profile.findOne({handle: profileFields.handle})
        .then(profile => {
          if(profile){
            errors.message = 'That handle already exists';
            res.status(400).json(errors);
          }

          //save profile
          new Profile(profileFields).save().then(profile=>{
            res.json({
              data:{
                "message": "Create Profile successful",
                "TYPE": "POST",
                "data": profile
              }
            })
          })
        })
    }
  })

})

router.post('/about',passport.authenticate('jwt', {session: false}), (req, res)=>{
  const {errors, isValid} = validateAboutInput(req.body);
  if(!isValid){
    return res.status(400).json(errors);
  }
  const profileFields = {};
  if(req.user.id) profileFields.user = req.user.id;
  if(req.body.description) profileFields.description = req.body.description;
  if(req.body.address) profileFields.address = req.body.address;
  if(req.body.phonenumber) profileFields.phonenumber = req.body.phonenumber;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.job) profileFields.job = req.body.job;

  Profile.findOne({user: req.user.id})
  .then(profile => {
    if(profile.about.length > 0){
      //Update
      Profile.findOneAndUpdate({user: req.user.id}, {$set: {about: [profileFields]}}, {new: true})
      .then(profile => res.json({
              data:{
                "message": "Update Profile About successful",
                "TYPE": "POST",
                "data": profile
              }
	  }));
    }else{
      //Create
          profile.about.unshift(profileFields)
          profile.save().then(profile=>{
            res.json({
              data:{
                "message": "Create Profile About successful",
                "TYPE": "POST",
                "data": profile
              }
            })
          })
    }
  })

})


module.exports = router;
