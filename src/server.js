const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()
const port = 4000
const path = require('path')
const User = require('./models/users.model')
const passport = require('passport')
const cookieSession = require('cookie-session')
const { checkAuthenticated, checkNotAuthenticated } = require('./middlewares/auth')
const cookieEncryptionKey = 'superSecret-key'

// .env 파일 사용
require('dotenv').config()

// token 생성
app.use(cookieSession({
    keys : [cookieEncryptionKey]
}))
// register regenerate & save after the cookieSession middleware initialization
app.use(function(request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
})

// passport 미들웨어에 등록
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')

app.use(express.json())
app.use(express.urlencoded({extended : false}))

// ejs 라이브러리와 같이 js를 html로 변환하는 라이브러리를 연동
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// 정적 파일 제공
app.use('/static', express.static(path.join(__dirname, 'public')))

// ejs파일들 렌더링
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login')
})
app.get('/signup', checkNotAuthenticated, (req, res) => {
    res.render('signup')
})
app.get('/', checkAuthenticated, (req, res) => {
    res.render('index')
})

// api 생성
app.post('/signup', async(req, res) => {
    console.log(req.body)
    
    const user = new User(req.body)
    try {
        await user.save()
        return res.status(200).send('success')
    } catch (error) {
        console.log(error)
    }
})
app.post('/login', (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        if(error) return next(error)
        if(!user) return res.json({msg : info})

        req.logIn(user, function (error) {
            if(error) return next(error)
            res.redirect('/')
        })
    })(req, res, next)
})

// mongoDB 연동
mongoose.connect(process.env.mongoDB_URI)
    .then(() => {
        console.log('mongoDB connected')
    })
    .catch((error) => {
        console.log(error)
    })

// backend 최초 실행 시 사용되는 함수
app.listen(port, () => {
    console.log('backend is ready')
})