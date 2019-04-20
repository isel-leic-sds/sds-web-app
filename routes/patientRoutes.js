const express = require('express');
const router = express.Router();
const patients = require('./../api/patientService')()


router.get('/sds/patient/create', function(req, res, next) {
    res.render('patientForm');
});

router.post('/sds/patient/create', function(req, res, next) {
    patients.create(
        patient = {
            name: req.body['first-name'],
            password: req.body['last-name']
        },
        (error, data) => {
            if(error) return next(error)
            res.redirect('/');
        }
    );
});

module.exports = router;