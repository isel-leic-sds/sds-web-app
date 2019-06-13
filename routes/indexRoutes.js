'use strict'
const express = require('express');
const router = express.Router();

module.exports = router;

router.get('/', function(req, res, next) {
  res.redirect('/sds/home');
});

router.get('/sds/home', function(req, res, next) {
  let obj = {}
  if (req.cookies.user) {
    obj.username = req.cookies.user.name
  }
  res.render('home', obj);
});

router.get('/sds/about_us', function(req, res, next) {
  let obj = {}
  if (req.cookies.user) {
    obj.username = req.cookies.user.name
  }
  res.render('about', obj);
})