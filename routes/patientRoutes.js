'use strict'
const express = require('express');
const router = express.Router();

/**
 * Patient Controller
 * @private
 */
const patientCtrl = require('../controller/patientController')()

router.get('/sds/patients', patientCtrl.showPatients)
router.get('/sds/patient/create', patientCtrl.showPatientCreateForm)
router.post('/sds/patient/create', patientCtrl.sendPatientForm)

module.exports = router;