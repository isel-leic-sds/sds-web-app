'use strict'
const express = require('express');
const patientRoutes = express.Router();

const patientService = require('./../service/patientService')()

module.exports = patientRoutes;

/**
 * Patient Controller
 * @private
 */
const patientController = require('../controller/patientController')(patientService)

patientRoutes.get('/sds/patients', patientController.showPatients)
patientRoutes.get('/sds/patientForm', patientController.showPatientCreateForm)
patientRoutes.post('/sds/patientForm', patientController.sendPatientForm)
patientRoutes.get('/sds/patients/history/:patientId', patientController.showClinicalHistory)