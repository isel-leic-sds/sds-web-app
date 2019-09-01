'use strict'
const request = require('request')

module.exports = patientService

function patientService() {

    return {
        getPatients: getPatients,
        create: create,
        getClinicalHistory: getClinicalHistory
    }

    function getPatients(followed_by, cb) {
        request.get({
            url:    `https://sds-web-app.herokuapp.com/sds/api/v1/patients/${followed_by}`,
            // url: `http://localhost:3000/sds/api/v1/patients/${followed_by}`,
        }, (error, httpResponse, body) => {
            if (error) return cb(error)
            if (httpResponse.statusCode !== 200) return cb(new Error('Não foi possível aceder aos seus pacientes. Contacte um administrador.'))
            cb(null, JSON.parse(body))
        })
    }

    function create(patient, cb) {
        request.post({
            url:    'https://sds-web-app.herokuapp.com/sds/api/v1/patient',
            // url:    'http://localhost:3000/sds/api/v1/patient',
            form:   patient
        }, (error, httpResponse, body) => {
            if (error) return cb(error)
            if (httpResponse.statusCode !== 201) return cb(new Error('Este paciente não pode ser adicionado :('))
            cb(null, JSON.parse(body))
        })
    }

    function getClinicalHistory(params, cb) {
        const month = params.today["month"]
        const year = params.today["year"]
        request.get({
            // url: `https://sds-web-app.herokuapp.com/sds/api/v1/patients/history/${params.patientId}?month=${month}&year=${year}`
            url: `http://localhost:3000/sds/api/v1/patients/history/${params.patientId}?month=${month}&year=${year}`
        }, (error, httpResponse, body) => {
            if (error) return cb(error)
            if (body == "null") return cb(new Error('Este paciente ainda não possuí historial clínico.')) // TODO - this code is ugly
            cb(null, JSON.parse(body))
        })
    }
}
