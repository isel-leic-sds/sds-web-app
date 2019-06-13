'use strict'
 /**
 * Module dependencies.
 * @private
 */
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const bodyParser = require("body-parser")
const logger = require('morgan')
const hbs = require('hbs')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

/**
 * Routes dependencies.
 * @private
 */
const indexRouter = require('./routes/indexRoutes')
const userRouter = require('./routes/userRoutes')
const patientsRouter = require('./routes/patientRoutes')
const api_v1 = require('./api/sdsApi_v1')

const app = express()

module.exports = app

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
app.use(session({secret: 'sds', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

app.use('/sds/api/v1', api_v1)

app.use(indexRouter)
app.use(patientsRouter)
app.use(userRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(error, req, res, next) {
  let obj = {}
  if (req.cookies.user) {
    obj.username = req.cookies.user.name
  }
  // set locals, only providing error in development  
  res.locals.message = error.message
  res.locals.error = req.app.get('env') === 'development' ? error : {}

  // render the error page
  res.status(error.status || 500)
  res.render('error', obj)
})