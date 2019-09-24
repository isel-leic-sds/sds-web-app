'use strict'

/**
 * Creates a representative object for a specified Patient.
 */

module.exports = function (obj) {
        this.sdsID = obj.sdsID
        this.name = obj.name
        this.followed_by = obj.followed_by
}