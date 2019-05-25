'use strict'
const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://sdsAdm1n:sds1819@sds-db-4ttxz.gcp.mongodb.net/test?retryWrites=true"
const client = new MongoClient(uri, { useNewUrlParser: true })

module.exports = router;

router.post('/patient/create', function (req, res, next) {
    const patient = {
        name: req.body['first-name'],
        password: req.body['last-name']
    }
    client.connect(err => {
        const users = client.db('sds-db').collection('users')
        users.find({ "name": patient.name }).toArray(
            (error, result) => {
                if (error || result.length) {
                    client.close()
                    return res.sendStatus(error || 409);
                } else {
                users.insertOne(patient,
                    (error, result) => {
                        client.close()
                        if (error) return res.send(error)
                        else res.sendStatus(201)
                    })
                }
            })
    })
})

function validatePassword(password, expected) {
    return password === expected;
}

router.post('/login', function (req, res, next) {
    client.connect(err => {
        const users = client.db('sds-db').collection('users')
        users.find({ "name": req.body.name }).toArray(
            (error, result) => {
                client.close()
                if (error || result.length == 0 ||
                    !validatePassword(req.body.password, result[0].password) ) {
                        return res.sendStatus(error || 401)
                }
                res.sendStatus(200)
            })
    })
})