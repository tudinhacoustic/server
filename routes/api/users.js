const express = require('express');
const router = express.Router();
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Profile = require('../../models/Profile')

//Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const keys = require('../../config/keys')
const passport = require('passport')

router.post('/register', (req, res, next)=>{
  const {errors, isValid} = validateRegisterInput(req.body);

  //Check Validation
  if(!isValid){
    return res.status(400).json(errors)
  }
  User.findOne({email: req.body.email})
  .then(user=>{
    if(user){
      return res.status(400).json({email: "Email already exists"});
    }else{
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        avatar: req.body.avatar,
        password: req.body.password,
        birthday: req.body.birthday,
        genge: req.body.genge,
      });

      bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
          .then(user=>{
            res.json({
              data:{
                "message": "Register successful",
                "TYPE": "POST",
                "data": user
              }
            })

            const userProfile = new Profile({
              user: user._id
            })
            //console.log(req.user.id)
            userProfile.save()
          })
          .catch(err=>console.log(err))
        })
      })
    }
  })
})
//Login
router.post('/login', (req, res, next)=>{
const {errors, isValid} = validateLoginInput(req.body);

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email})
  .then(user=>{
    if(!user){
      errors.message = 'User not found';
      return res.status(404).json(errors);
    }

    bcrypt.compare(password, user.password)
    .then(isMatch=>{
      if(isMatch){
        //res.status(200).json({msg: 'Success'})
        //Create jwt payload
        const payload = {id: user.id, name: user.name, avatar: user.avatar }
        jwt.sign(
          payload,
          keys.secretOrKey,
          {expiresIn: 3600}, (err, token)=>{
            res.status(200).json({
              data:{
                message: "Login successful",
                TYPE:"POST",
                success: true,
                token: 'Bearer '+token
              }
              }
            )
          }
        )
      }else{
        errors.message = 'Password incorrect';
        return res.status(400).json(errors);
      }
    })
  })
})
//Mới vào trang sẽ cho người dùng Add ProfilePicture và Phonenumber
router.post('/addLastUser', passport.authenticate('jwt', {session: false}), (req, res)=>{
  const newUser = {
    avatar: req.body.avatar,
    phonenumber: req.body.phonenumber
  }
  User.findOneAndUpdate({_id: req.user.id},{$set: newUser}, {new: true})
    .then(profile => {
      res.json({
        data: {
          "message": "Add Successful",
          "TYPE":"POST",
          data: profile
        }
      })
    }).catch(err => {
      console.log('Profile không tồn tại')
    })
})
router.get('/test', passport.authenticate('jwt', {session: false}), (req, res)=>{
  res.json({
    id: req.user._id,
    firstname: req.user.firstname,
  	lastname: req.user.lastname,
  	email: req.user.email,
  	birthday: req.user.birthday,
  	genge: req.user.genge
  })
})


module.exports = router;
