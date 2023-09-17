const express = require('express')
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth')
const mainRouter = express.Router()

mainRouter.get('/', checkAuthenticated, (req, res) => {
    res.render('posts/index')
})
mainRouter.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('auth/login')
})
mainRouter.get('/signup', checkNotAuthenticated, (req, res) => {
    res.render('auth/signup')
})

module.exports = mainRouter