'use strict'

const SosContact = require('./SosContact')

/**
 * Creates a representative object for a specified Patient.
 * @return {Patient::information} - Returned the patient information.
 */

module.exports = function (obj) {
        this.dateOfBirth = obj.dateOfBirth
        this.nif = obj.nif
        this.contact = new SosContact(obj.contact)
        this.quiz = obj.quiz || 'gen1'
        this.followed_by = obj.followed_by
}