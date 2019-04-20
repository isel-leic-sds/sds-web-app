

function init() {

    const request = require('request');

    return {
        create
    }

    function create(patient, cb) {
        request.post({
            url:'http://localhost:3000/sds/api/patient/create',
            form: patient
        }, (error, httpResponse, body) => {
            if (error) return cb(error)
            if (httpResponse.statusCode !== 201) return cb(new Error('User was not sucessfully created!'))
            cb(null, body)
        })
    }
}

module.exports = init;