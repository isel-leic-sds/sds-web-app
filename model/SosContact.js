'use strict'

/**
 * Creates a representative object for a Sos Contact.
 * @return {Contact::information} - Returned the patient Sos Contact information.
 */

module.exports = function (obj) {
        this.name = obj.name
        this.phoneNumber = obj.phoneNumber
}