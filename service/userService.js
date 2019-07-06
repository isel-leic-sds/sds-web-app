'use strict'
const request = require('request')

module.exports = userService

function userService() {

    return {
        create: create,
        logIn: logIn,
        findById: findById
    }

    function create(data, cb) {
        request.post({
            url:'https://sds-web-app.herokuapp.com/sds/api/v1/user/create',
            // url:'http://localhost:3000/sds/api/v1/user/create',
            form: data
        }, (error, httpResponse, body) => {
            if (error) return cb(error)
            if (httpResponse.statusCode !== 201) return cb(new Error ('A sua conta não foi criada com sucesso :('))
            cb(null, body)
        })
    }

    function logIn(data, cb) {
        request.post({
            url:'https://sds-web-app.herokuapp.com/sds/api/v1/login',
            // url:'http://localhost:3000/sds/api/v1/login',
            form: data
        }, (error, httpResponse, body) => {
            if (error) return cb(error)
            if (httpResponse.statusCode !== 200) return cb(new Error('Credenciais Inválidas!'))
            cb(null, JSON.parse(body))
        })
    }

    function findById(data, cb) {
        request.post({
            url:'https://sds-web-app.herokuapp.com/sds/api/v1/user',
            // url:'http://localhost:3000/sds/api/v1/user',
            form: data
        }, (error, httpResponse, body) => {
            if (error) return cb(error)
            if (httpResponse.statusCode !== 200) return cb(new Error('Credenciais Inválidas!'))
            cb(null, JSON.parse(body))
        })
    }
}