'use strict'
const crypto = require('./../crypto')()

module.exports = patientController

function patientController(patientService) {

    return {
        showPatients: showPatients,
        showPatientCreateForm: showPatientCreateForm,
        sendPatientForm: sendPatientForm
    }

    function showPatients(req, res, next) {
        patientService.getPatients({user: req.cookies.user.sdsID},
            (error, data) => {
                if (error) return next(error)
                let obj = {}
                if (req.cookies.user) {
                  obj.username = req.cookies.user.name
                }
                obj.patientsList = data
                obj.hasPatients = data.length
                res.render('patientList', obj)
            }
        )
    }

    function showPatientCreateForm(req, res, next) {
        let obj = {}
        if (req.cookies.user) {
          obj.username = req.cookies.user.name
        }
        res.render('patientForm', obj)
    }

    function sendPatientForm(req, res, next) {
        let obj = {}
        if (req.cookies.user) {
          obj.username = req.cookies.user.name
        }
        patientService.create({
            name: req.body['name'],
            sdsID: req.body['sdsID'],
            password: crypto.encrypt(req.body['password']),
            responsible: req.cookies.user.sdsID,
            dateOfBirth: req.body['dateOfBirth'],
            nif: req.body['nif'],
            contact: {
                name: req.body['contact-name'],
                phoneNumber: req.body['contact-phoneNumber']
            }
        },
            (error, _) => {
                if (error) return next(error)
                res.redirect('/sds/patients')
            }
        )
    }
}