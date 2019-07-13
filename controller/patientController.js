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
        let obj = {}
        if (req.cookies.user) {
            obj.username = req.cookies.user.name
        }
        patientService.getPatients(req.cookies.user.sdsID,
            (error, data) => {
                if (error) return next(error)
                obj.patientsList = data
                obj.hasPatients = data.length > 0
                obj.target = req.session.target
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
            sdsID: req.body['sdsID'],
            name: req.body['name'],
            followed_by: req.user.sdsID,
            password: crypto.encrypt(req.body['password']),
            info: {
                dateOfBirth: req.body['dateOfBirth'],
                nif: req.body['nif'],
                contact: {
                    name: req.body['contact-name'],
                    phoneNumber: req.body['contact-phoneNumber']
                }
            }
        }, (error, data) => {
            if (error) return next(error)
            res.redirect('/sds/patients')
        })
    }
}