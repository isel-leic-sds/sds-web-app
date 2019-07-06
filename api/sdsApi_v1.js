'use strict'
const express = require('express')
const router = express.Router()

const MongoClient = require('mongodb').MongoClient
const url = process.env.MONGODB_URI || "mongodb+srv://sdsAdm1n:sds1819@sds-db-4ttxz.gcp.mongodb.net/test?retryWrites=true"
const useNewUrlParser = { useNewUrlParser: true }

const db_name = 'sds-db'
const users_doc = 'users'
const patients_doc = 'patients'
const patients_info_doc = 'patients_info'

module.exports = router;

/**
 * Services
 * @private
 */
const patientService = require('./../service/patientService')()
const userService = require('./../service/userService')()

/**
 * Controllers
 * @private
 */
const userController = require('../controller/userController')(userService)
const patientController = require('../controller/patientController')(patientService)

function connect(success, next) {
    MongoClient.connect(url, useNewUrlParser, (err, client) => {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
            return next(err)
        }
        success(client)
    })
}

/**
 * Patients
 */
router.get('/patients/:followedBy', function (req, res, next) {
    connect((client) => {
        const patientsList = client.db(db_name).collection(patients_doc)
        patientsList.find({ "followed_by": req.params.followedBy }).toArray((error, data) => {
            if (error) {
                client.close()
                return res.sendStatus(error)
            }
            res.json(data)
        })
    }, next)
})

router.post('/patient', function (req, res, next) {
    const patient = {
        sdsID: req.body['sdsID'],
        name: req.body['name'],
        password: req.body['password'],
        followed_by: [
            req.body['followed_by']
        ]
    }
    const info = {
        sdsID: req.body['sdsID'],
        dateOfBirth: req.body['dateOfBirth'],
        nif: req.body['nif'],
        contact: {
            name: req.body['contact']['name'],
            phoneNumber: req.body['contact']['phoneNumber']
        }
    }
    connect((client) => {
        const patients = client.db(db_name).collection(patients_doc)
        const patient_info = client.db(db_name).collection(patients_info_doc)
        patients.findOne({ "sdsID": patient.sdsID }, (error, data) => {
            if (error || data) {
                client.close()
                return res.sendStatus(error || 409)
            }
            const session = client.startSession({ readPreference: { mode: "primary" } })
            session.startTransaction({ readConcern: { level: "local" }, writeConcern: { w: "majority" } })
            patients.insertOne(patient, (patients_error, _) => {
                if (patients_error) {
                    client.close()
                    return next(patients_error)
                }
                patient_info.insertOne(info, (patient_info_error, patient_info_data) => {
                    if (patient_info_error) {
                        session.abortTransaction()
                        session.endSession()
                        client.close()
                        return next(patient_info_error)
                    }
                    session.commitTransaction()
                    session.endSession()
                    console.log(`Patient ${patient_info_data.ops[0].sdsID} has been created!`)
                    res.statusCode = 201
                    res.json(patient)
                })
            })
        })
    }, next)
})

router.get('/patient/validate', function (req, res, next) {
    connect((client) => {
        client.db(db_name).collection(patients_doc).findOne({ "sdsID": req.query.sdsID }, (error, data) => {
            if (error) {
                client.close()
                res.sendStatus(error)
            }
            res.json(data)
        })
    }, next)
})

router.get('/patient/:sdsID', function (req, res, next) {
    connect((client) => {
        client.db(db_name).collection(patients_info_doc).findOne({ "sdsID": req.params.sdsID }, (error, data) => {
            if (error) {
                client.close()
                res.sendStatus(error)
            }
            res.json(data)
        })
    }, next)
})

/**
 * User
 */
router.post('/user', function (req, res, next) {
    connect((client) => {
        const users = client.db(db_name).collection(users_doc)
        users.findOne({ "sdsID": req.body.sdsID }, (error, data) => {
            if (error || data) {
                client.close()
                return res.sendStatus(error || 409)
            }
            users.insertOne(req.body, (error, data) => {
                if (error) {
                    client.close()
                    return next(error)
                }
                console.log(`User ${data.ops[0].sdsID} has been created!`)
                res.sendStatus(201)
            })
        })
    }, next)
})

/**
 * Authentication
 */
router.post('/users', function (req, res, next) {
    connect((client) => {
        const users = client.db(db_name).collection(users_doc)
        users.findOne(req.body, (error, data) => {
            if (error) {
                client.close()
                return res.sendStatus(error)
            }
            res.json(data)
        })
    }, next)
})

router.post('/login', function (req, res, next) {
    connect((client) => {
        const users = client.db(db_name).collection(users_doc)
        users.findOne({ "sdsID": req.body.sdsID }, (error, data) => {
            let isValid = userController.validatePassword(req.body.password, data.password)
            if (error || !isValid) {
                client.close()
                return res.sendStatus(error || 401)
            }
            res.json(data)
        })
    }, next)
})

router.post('/patient/login', function (req, res, next) {
    connect((client) => {
        const patients = client.db(db_name).collection(patients_doc)
        patients.findOne({ "sdsID": req.body.sdsID }, (error, data) => {
            let isValid = userController.validatePassword(req.body.password, data.password)
            if (error || !isValid) {
                client.close()
                return res.sendStatus(error || 401)
            }
            res.json(data)
        })
    }, next)
})