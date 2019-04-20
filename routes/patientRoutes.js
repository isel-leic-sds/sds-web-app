const express = require('express');
const router = express.Router();
const patients = require('../service/patientService')()

module.exports = router;

router.get('/sds/patient/create', function(req, res, next) {
    res.render('patientForm')
});

router.post('/sds/patient/create', function(req, res, next) {
    patients.create(patient = req.body,
        (error, data) => {
            if(error) return next(error)
            res.redirect('/')
        }
    )
})