const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile')
const commentProfile = require('../../models/commentProfile')
//Load User Profile
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


//Load Input Validation
const validateProfileInput = require('../../validation/profile');
const validateAboutInput = require('../../validation/profile/about')
const validateExperienceInput = require('../../validation/profile/experience')
const validateEducationInput = require('../../validation/profile/education')
const validateCommentInput = require('../../validation/profile/comment')

const keys = require('../../config/keys')
const passport = require('passport')

//Lấy dữ liệu Profile
router.get('/',passport.authenticate('jwt', {session: false}), (req, res)=>{
  Profile.findOne({user: req.user.id})
  .populate('user', ['firstname', 'lastname', 'email', 'genge', 'birthday'])
  .then(profile => {
    res.json({
      data: {
        "message": "GET Profile Successful",
        "TYPE": "GET",
        "data": profile
      }
    })
  }).catch(err => res.json(err))
})

//Người dùng thêm thông tin Profile
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
  .populate('user', ['firstname', 'lastname', 'email', 'genge', 'birthday'])
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
      .populate('user', ['firstname', 'lastname', 'email', 'genge', 'birthday'])
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

//Người dùng thêm thông tin Profile About
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
      .populate('user', ['firstname', 'lastname', 'email', 'genge', 'birthday'])
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

//Người dùng thêm thông tin Profile Experience
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res, next)=>{
  const {errors, isValid} = validateExperienceInput(req.body);

  if(!isValid){
    return res.status(400).json(errors)
  }

  Profile.findOne({ user: req.user.id })
  .then(profile => {
    const newExperience = {
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    }

    //Add to exp array
    profile.experience.unshift(newExperience);

    profile.save().populate('user', ['firstname', 'lastname', 'email', 'genge', 'birthday']).then(profile => res.json({
      data: {
        "message": "Add Experience Successful",
        "TYPE": "POST",
        "data": profile
      }
    }))
  })
})

//Người dùng thêm thông tin Profile Education
router.post('/education', passport.authenticate('jwt', {session: false}), (req, res, next)=>{
  const {errors, isValid} = validateEducationInput(req.body);

  if(!isValid){
    return res.status(400).json(errors)
  }

  Profile.findOne({ user: req.user.id })
  .then(profile => {
    const newEducation = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    }

    //Add to exp array
    profile.education.unshift(newEducation);

    profile.save().populate('user', ['firstname', 'lastname', 'email', 'genge', 'birthday']).then(profile => res.json({
      data: {
        "message": "Add Education Successful",
        "TYPE": "POST",
        "data": profile
      }
    }))
  })
})

//Người dùng thêm yêu thích vào Profile
router.post('/love/:idProfile', passport.authenticate('jwt', {session: false}), (req, res, next)=>{
  const profileFields = {};
  if(req.user.id) profileFields.user = req.user.id;
  Profile.findOne({_id: req.params.idProfile})
    .then(profile => {
      if(profile.love.filter(love=>love.user.toString() === req.user.id).length > 0){

        return Profile.findOneAndUpdate({_id: req.params.idProfile}, {$pull: {'love': {user: req.user.id}}}, {new: true})
        .populate('user', ['firstname', 'lastname', 'email', 'genge', 'birthday'])
        .then(profile => res.json({
                data:{
                  "message": "Remove Love successful",
                  "TYPE": "POST",
                  "data": profile
                }
      }));
      }

      profile.love.unshift({user: req.user.id});

      profile.save()
      .then(love=>res.json({
        data:{
          "message": "Add Love successful",
          "TYPE": "POST",
          "data": profile
        }
      }))
    }).catch(err => res.json({msg: 'Profile not found'}))
})

//Add commentProfile
router.post('/postComment/:idProfile', passport.authenticate('jwt', {session: false}), (req, res)=>{
  const {errors, isValid} = validateCommentInput(req.body);

  if(!isValid){
    return res.status(400).json(errors)
  }
  const addCommentProfile = new commentProfile({
    profile: req.params.idProfile,
    user: req.user.id,
    text: req.body.text
  })

  addCommentProfile.save().then(addComment => {
    commentProfile.findOne({_id: addComment._id, user: req.user.id}).populate('user', ['firstname', 'lastname', 'email', 'genge', 'birthday']).then(profile =>
      {res.json({        data: {
                "message": "Add Comment Profile Successful",
                "TYPE": "POST",
                data: addComment
              }})
      })
  })
})
//Edit comment
router.post('/editComment/:idComment', passport.authenticate('jwt', {session: false}), (req, res)=>{
  const {errors, isValid} = validateCommentInput(req.body);

  if(!isValid){
    return res.status(400).json(errors)
  }
  commentProfile.findOneAndUpdate({_id: req.params.idComment, user: req.user.id},{$set: {text: req.body.text }}, {new: true})
  .populate('user', ['firstname', 'lastname', 'email', 'genge', 'birthday'])
  .then(profile => res.json({
    data: {
      "message": "Edit Comment Profile Successful",
      "TYPE": "POST",
      "data": profile
    }
  })).catch(err => {
    res.json({
      data:{
        "message": "User not valid or CommentProfile not found",
        "TYPE": "POST"
      }
    })
  })
})

router.post('/addLoveCommentProfile/:idCommentProfile', passport.authenticate('jwt', {session: false}), (req, res)=>{
  const profileFields = {};
  if(req.user.id) profileFields.user = req.user.id;
  commentProfile.findOne({_id: req.params.idCommentProfile}).populate('user', ['firstname', 'lastname', 'email', 'genge', 'birthday'])
    .then(profile => {
      if(profile.love.filter(love=>love.user.toString() === req.user.id).length > 0){

        return commentProfile.findOneAndUpdate({_id: req.params.idCommentProfile}, {$pull: {'love': {user: req.user.id}}},{new: true})
        .populate('user', ['firstname', 'lastname', 'email', 'genge', 'birthday'])
        .then(profile => res.json({
                data:{
                  "message": "Remove Love successful",
                  "TYPE": "POST",
                  "data": profile
                }
      }));
      }

      profile.love.unshift({user: req.user.id});

      profile.save()
      .then(love=>res.json({
        data:{
          "message": "Add Love successful",
          "TYPE": "POST",
          "data": profile
        }
      }))
    }).catch(err => res.json({msg: 'Profile not found'}))
})

module.exports = router;
