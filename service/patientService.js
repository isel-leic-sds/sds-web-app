'use strict'
const request = require('request');

module.exports = patientService

function patientService() {

    return {
        getPatients: getPatients,
        create: create
    }

    function getPatients() {
        request.get({
            url: 'http://localhost:3000/sds/api/v1/patients'
        })
    }

    function create(patient, cb) {
        request.post({
            // url:'https://sds-web-app.herokuapp.com/sds/api/v1/patient/create',
            url:'http://localhost:3000/sds/api/v1/patient/create',
            form: patient
        }, (error, httpResponse, body) => {
            if (error) return cb(error)
            if (httpResponse.statusCode !== 201) return cb(new Error('User was not sucessfully created!'))
            cb(null, body)
        })
    }
}