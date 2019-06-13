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
patientRoutes.get('/sds/patient/create', patientController.showPatientCreateForm)
patientRoutes.post('/sds/patient/create', patientController.sendPatientForm)