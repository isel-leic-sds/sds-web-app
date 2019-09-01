'use strict'

/**
 * Creates a representative object for collect results from submitted quizs.
 */

module.exports = function (type, question) {
    this.type = type
    this.question = question
    this.answers = []
}