'use strict'
const crypto = require('./../crypto')()

module.exports = userController

function userController(userService) {

    return {
        signUp: signUp,
        signIn: signIn,
        logout: logout,
        validatePassword: validatePassword
    }

    function signUp(req, res, next) {
        userService.create({
            sdsID: req.body['sdsID'],
            name: req.body['name'],
            password: crypto.encrypt(req.body['password'])
        }, (error, _) => {
            if (error) { return next(error) }
            res.redirect('/sds/home')
        })
    }

    function signIn(req, res, next) {
        userService.logIn({
            sdsID: req.body['sdsID'],
            password: crypto.encrypt(req.body['password'])
        }, (err, data) => {
            if (err) { return next(err) }
            req.logIn(data, (err) => {
                if (err) { return next(err) }
                res.cookie('user', {
                    tokenID: crypto.encrypt(data.password),
                    name: data.name,
                    sdsID: data.sdsID})
                res.redirect('/sds/home')
            })
        })
    }

    function logout(_, res) {
        res.clearCookie('user')
        res.redirect('/sds/home')
    }

    function validatePassword(password, target) {
        return password && target && crypto.decrypt(password) === crypto.decrypt(target)
    }
}