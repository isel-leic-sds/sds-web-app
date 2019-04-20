

function init() {

    const MongoClient = require('mongodb').MongoClient
    const uri = "mongodb+srv://sdsAdm1n:sds1819@sds-db-4ttxz.gcp.mongodb.net/test?retryWrites=true"
    const client = new MongoClient(uri, { useNewUrlParser: true })
    
    return {
        create
    }

    function create(patient, cb) {
        client.connect(err => {
            const users = client.db('sds-db').collection('users')
            users.insertOne(patient)
            client.close()
            cb(err)
        })
    }
}

module.exports = init;