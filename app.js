const createError = require('http-errors')
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const hbs = require('hbs')

const indexRouter = require('./routes/routes')
const patientsRouter = require('./routes/patientRoutes')
const apiPatient = require('./api/patientApi')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
hbs.registerPartials(path.join(__dirname + '/views/partials'))

app.use(favicon(path.join(__dirname + '/public/images/favicon', 'sds-web-favicon.ico')))
app.use('/public/', express.static(path.join(__dirname, '/public')))

app.use(logger('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(cookieParser())

app.use('/sds/api/v1/patient', apiPatient)

app.use(indexRouter)
app.use(patientsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development  
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app