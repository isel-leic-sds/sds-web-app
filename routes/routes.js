'use strict'

/**
 * Module that contains the main set of routes.
 * @module routes
 */

 /**
 * Module dependencies.
 * @private
 */
var fs = require('fs')
const express = require("express")
const path = require("path")
const favicon = require('serve-favicon')
const bodyParser = require("body-parser")
const hbs = require('hbs')

/**
 * Routes dependencies.
 * @private
 */
const cinemas = require('./cineRoutes')
const movies  = require('./movRoutes')

/**
 * Creates an express application instance and initiates it with the set of supported routes.
 * @param {API_KEY} - The API_KEY.
 * @param {cinemas.CinemaStore} - The repository instance to be used
 * @return {express.Application} - The newly created application
 */
module.exports = function() {
    const app = express()

    /** view engine */
    app.set('views', path.join(__dirname, '../views'))
    app.set('view engine', 'hbs')
    hbs.registerPartials(path.join(__dirname + '/../views/partials'))

    app.use(favicon(path.join(__dirname, '../public/images', 'favicon.ico')))
    app.use(express.static(path.join(__dirname, '../public')))
    app.use('/public/',express.static(path.join(__dirname, '../public')))
    app.use(express.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: false}))

    app.get('/' ,(req, resp, next) => resp.render('layout'))

    /*app.get('/admin', (req, resp, next) => {
        console.log(`Servicing ${req.method} ${req.originalUrl}`)
        resp.render('admin')
    })*/

    app.use(cinemas)
    app.use(movies)

    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
    
        // render the error page
        res.status(err.status || 500);
        res.render('error');
    })

    return app
}