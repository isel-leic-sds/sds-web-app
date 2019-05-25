const express = require('express');
const router = express.Router();

module.exports = router;

router.get('/', function(req, res, next) {
  res.redirect('/sds/home');
});

router.get('/sds/home', function(req, res, next) {
  res.render('home');
});