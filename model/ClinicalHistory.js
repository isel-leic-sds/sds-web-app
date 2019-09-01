'use strict'

/**
 * Creates a representative object for a specified clinical history.
 */

module.exports = function (obj) {
    function parseDate() {
        const date = obj.name.split('-')
        const month = date[0]
        const year = date[1]
        return {
            month: month,
            year: year
        }
    }

    function parseHeaders() {
        return obj.clinicalHistory.map(o => o.question)
    }

    function parseAnswers() {
        const tableAnswers = []
        const date = obj.name;
        obj.clinicalHistory.forEach(item => {
            item.answers.forEach(ans => {
                ans.userAnswer.forEach(day => {
                    if (!tableAnswers[day]) {
                        tableAnswers[day] = []
                        tableAnswers[day].push(`${day}-${date}`)
                    }
                    tableAnswers[day].push(ans.answer)
                })
            })
        })
        return tableAnswers
    }

    this.date = parseDate()
    this.headers = parseHeaders()
    this.answers = parseAnswers()
}