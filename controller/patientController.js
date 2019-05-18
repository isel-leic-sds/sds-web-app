'use strict'

const patientService = require('./../service/patientService')()

module.exports = function () {

    return {
        showPatients,
        showPatientCreateForm,
        sendPatientForm
    }

    function showPatients(req, res, next) {
        res.render('patientList')
    }

    function showPatientCreateForm(req, res, next) {
        res.render('patientForm')
    }

    function sendPatientForm(req, res, next) {
        patientService.create(req.body,
            (error, data) => {
                if(error) return next(error)
                res.redirect('/')
            }
        )
    }
}