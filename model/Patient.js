'use strict'

const PatientInfo = require('./PatientInfo')

/**
 * Creates a representative object for a specified Patient.
 */

module.exports = function (obj) {
        this.sdsID = obj.sdsID
        this.name = obj.name
        this.followed_by = obj.followed_by
        if (obj.info) this.info = new PatientInfo(obj.info)
}