'use strict'
const express = require('express')
const userRoutes = express.Router()
const passport = require('passport')
const userService = require('./../service/userService')()

module.exports = userRoutes;

/**
 * User Controller
 * @private
 */
const userController = require('../controller/userController')(userService)


userRoutes.post('/signup', userController.signUp)
userRoutes.post('/signin', userController.signIn)
userRoutes.get('/logout', userController.logout)

passport.serializeUser(function(user, cb) {
    cb(null, user.sdsID)
})
  
passport.deserializeUser(function(sdsID, cb) {
    userService.findById({ sdsID: sdsID }, function(err, user) {
        cb(err, user);
    });
})