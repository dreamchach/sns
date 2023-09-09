const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy
const User = require("../models/users.model");
const user = {
    usernameField : 'email',
    passwortField : 'password'
}
const GoogleStrategy = require('passport-google-oauth20').Strategy

const localStrategyConfig = new LocalStrategy(user, (email, password, done) => {
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
})
const googleStrategyConfig = new GoogleStrategy({
    clientID : process.env.googleClientID,
    clientSecret : process.env.googleClientSecret,
    callbackURL : '/auth/google/callback',
    scope: ['email', 'profile']
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({googleId : profile.id})
        .then((existingUser) => {
            if(existingUser) {
                return done(null, existingUser)
            } else {
                const user = new User()
                
                user.email = profile.emails[0].value
                user.googleId = profile.id
                user.save()
                    .then(() => {
                        done(null, user)
                    })
                    .catch((error) => {
                        console.log(error)
                        if(error) return done(error)
                    })
            }
        })
        .catch((error) => {
            if(error) return done(error)
        })
})

passport.serializeUser((user, done) => {
    done(null, user.id)
})
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user)
        })
})

passport.use('local', localStrategyConfig)
passport.use('google', googleStrategyConfig)