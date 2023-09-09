const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy
const User = require("../models/users.model");
const user = {
    usernameField : 'email',
    passwortField : 'password'
}

passport.serializeUser((user, done) => {
    done(null, user.id)
})
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user)
        })
})

passport.use('local', new LocalStrategy(user, (email, password, done) => {
    User.findOne({email : email.toLocaleLowerCase()})
    .then((user) => {
        if(!user) {
            return done(null, false, {msg : `email ${email} not found`})
        }
        user.comparePassword(password, (error, isMatch) => {
            if(error) return done(error)
            if(isMatch) return done(null, user)

            return done(null, false, {msg : 'Invalid email or password'})
        })
    })
    .catch((error) => {
        if(error) return done(error)
    })
    
    /*
    mongoose v5.0부터 콜백함수가 지원되지 않기 때문에 수정

    User.findOne({
        email : email.toLocaleLowerCase()
    }, (error, user) => {
        if(error) return done(error)
        if(!user) {
            return done(null, false, {msg : `email ${email} not found`})
        }

        user.comparePassword(password, (error, isMatch) => {
            if(error) return done(error)
            if(isMatch) return done(null, user)

            return done(null, false, {msg : 'Invalid email or password'})
        })
    })
    */
}))