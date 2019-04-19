var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/sds/home');
});

router.get('/sds/home', function(req, res, next) {
  res.render('home');
});

module.exports = router;