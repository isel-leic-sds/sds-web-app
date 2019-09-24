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
const quiz_doc = 'quiz'

const Patient = require('./../model/Patient')
const PatientInfo = require('./../model/PatientInfo')
const QuizResult = require('./../model/QuizResult')
const QuestionResult = require('./../model/QuestionResult')
const Answer = require('./../model/Answer')

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
    const patient = new Patient(req.body)
    patient.password = req.body['password']
    const patientInfo = new PatientInfo(req.body)
    patientInfo.sdsID = patient.sdsID
    connect((client) => {
        const patients = client.db(db_name).collection(patients_doc)
        const patient_info = client.db(db_name).collection(patients_info_doc)
        patients.findOne({ "sdsID": req.body['sdsID'] }, (error, data) => {
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
                patient_info.insertOne(patientInfo, (patient_info_error, patient_info_data) => {
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
        client.db(db_name).collection(patients_doc).findOne({ "sdsID": req.params.sdsID }, (error, data) => {
            if (error) {
                client.close()
                res.sendStatus(error)
            }
            const patient = new Patient(data)
            client.db(db_name).collection(patients_info_doc).findOne({ "sdsID": req.params.sdsID }, (error, info) => {
                if (error) {
                    client.close()
                    res.sendStatus(error)
                }
                patient.info = new PatientInfo(info)
                res.json(patient)
            })
        })
    }, next)
})

router.post('/patient/ans/:sdsId', function (req, res, next) {
    const datetime = new Date();
    connect((client) => {
        const user = req.params.sdsId
        const quizs = client.db(db_name).collection(user)
        const quiz = JSON.parse(req.body.quiz)
        const docName = `${datetime.getMonth()+1}-${datetime.getFullYear()}`
        const day = datetime.getDay()+1
        quizs.findOne({"name": docName}, (error, data) => {
            if (error) {
                client.close()
                return next(error)
            }
            if (!data) {
                const quizResult = getQuizResult(quiz, docName, day)
                quizs.insertOne(quizResult, (insertError, insertData) => {
                    if (insertError) {
                        client.close()
                        return next(insertError)
                    }
                    console.log(`Quiz for ${user} was successfully submitted!`)
                    res.statusCode = 201
                    res.json(insertData)
                })
            }
            else {
                updateClinicalHistory(quiz, data, day)            
                quizs.replaceOne({"name": docName}, data, (updateError, updateData) => {
                    if (updateError) {
                        client.close()
                        return next(updateError)
                    }
                    console.log(`Quiz for ${user} was successfully submitted!`)
                    res.statusCode = 201
                    res.json(updateData)
                })
            }                       
        })
    }, next)
})

function updateClinicalHistory(quiz, data, day) {
    quiz.questions.forEach(question => {
        const result = data.clinicalHistory.find(elem => elem.question == question.question)                
        switch (question.type) {
            case 'Binary':
                updateBinaryAndSeekBar(result, question, day)
                break
            case 'SeekBar':
                updateBinaryAndSeekBar(result, question, day)
                break
            case 'Schedule':
                updateSchedule(result, day)
                break
            default:
                console.log('Question type does not exists.')
        }
    })
}

function getQuizResult(quiz, docName, day) {
    const quizResult = new QuizResult(docName)
    quiz.questions.forEach(question => {
        const questionResult = new QuestionResult(question.type, question.question)             
        switch (question.type) {
            case 'Binary':
                createBinary(questionResult, question, day)
                quizResult.clinicalHistory.push(questionResult)
                break
            case 'SeekBar':
                createSeekBar(questionResult, question, day)
                quizResult.clinicalHistory.push(questionResult)
                break
            case 'Schedule':
                createSchedule(questionResult, question, day)
                quizResult.clinicalHistory.push(questionResult)
                break
            default:
                console.log('Question type does not exists.')
            }
    })
    return quizResult
}

function updateSchedule(result, day) {
    result.answers[0].userAnswer.push(day)
}

function updateBinaryAndSeekBar(result, question, day) {
    const answer = result.answers.find(elem => elem.answer == question.userAnswer.finalAnswer)
    answer.userAnswer.push(day)
}

function createSchedule(questionResult, question, day) {
    questionResult.answers.push(new Answer(question.userAnswer.finalAnswer, []))
    updateSchedule(questionResult, day)
}

function createSeekBar(questionResult, question, day) {
    const count = parseInt(question.answerOptions.option1, 10);
    for (var i = 0; i <= count; i++) {
        questionResult.answers.push(new Answer(i.toString(), []))
    }
    updateBinaryAndSeekBar(questionResult, question, day)
}

function createBinary(questionResult, question, day) {
    questionResult.answers.push(new Answer(question.answerOptions.option1, []))
    questionResult.answers.push(new Answer(question.answerOptions.option2, []))
    updateBinaryAndSeekBar(questionResult, question, day)  
}

router.get('/patient/quiz/:name', function(req, res, next) {
    connect((client) => {
        client.db(db_name).collection(quiz_doc).findOne({ "name" : req.params.name }, (error, data) => {
            if(error) {
                client.close()
                res.sendStatus(error)
            }
            res.json(data)
        })
    }, next)
})

router.get('/patients/history/:sdsId', function(req, res, next) {
    connect((client) => {
        client.db(db_name).collection(req.params.sdsId).findOne({ "name" : `${req.query.month}-${req.query.year}` }, (error, data) => {
            if(error) {
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
            let isValid = data && userController.validatePassword(req.body.password, data.password)
            if (error || !isValid) {
                client.close()
                return res.sendStatus(error || 401)
            }
            res.json(data)
        })
    }, next)
})