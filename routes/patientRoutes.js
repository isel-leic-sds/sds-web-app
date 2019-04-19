const express = require('express');
const router = express.Router();
const patients = require('./../api/patientService')()


router.get('/sds/patient/create', function(req, res, next) {
    res.render('patientForm');
});

router.post('/sds/patient/create', function(req, res, next) {
    patients.create(null);
});

module.exports = router;