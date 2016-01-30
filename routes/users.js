'use strict';

var Firebase = require('firebase');
var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');

var User = require('../models/user');

var ref = new Firebase('https://userjt.firebaseio.com/');

router.post('/register', function(req, res, next) {
  ref.createUser(req.body, function(err, userData) {
    if(err) return res.status(400).send(err);
    User.create(userData, function(err, savedUser) {
      res.send(err || savedUser);
    });
  });
});

router.post('/login', function(req, res, next) {
  ref.authWithPassword(req.body, function(err, authData) {
    if(err) return res.status(400).send(err);
    User.findOne({uid: authData.uid}, function(err, user) {
      if(err){
        console.log(err)
      }
      if(!user){
        console.log(user)
      }

      var token = user.generateToken();
      res.cookie('mytoken', token).send();
      
    });
  });
});

router.put('/zip', authMiddleware, function(req, res) {
  User.findById(req.user._id, function(err, user) {
    user.zip.push(req.body.zip);
    user.save(function(err, savedUser) {
      res.send(err || savedUser);
    });
  });
});

router.get('/allZips', authMiddleware, function(req, res) {
  User.findById(req.user._id, function(err, user) {
    res.send(user.zip);
  });
});

router.get('/weather', authMiddleware, function(req, res) {
  //// logged in,   req.user
  User.findById(req.user._id, function(err, user) {
    res.send(user);
  });
});

router.get('/logout', function(req, res, next) {
  res.clearCookie('mytoken').redirect('/');
});


module.exports = router;
