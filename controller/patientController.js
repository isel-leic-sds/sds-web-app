'use strict'
module.exports = patientController

function patientController(patientService) {

    return {
        showPatients: showPatients,
        showPatientCreateForm: showPatientCreateForm,
        sendPatientForm: sendPatientForm
    }

    function showPatients(req, res, next) {
        // patientService.getPatients(() => {
            
        // })
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