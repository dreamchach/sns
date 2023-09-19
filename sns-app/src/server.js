const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()
const config = require('config')
const serverConfig = config.get('server')
const port = serverConfig.port
const path = require('path')
const passport = require('passport')
const cookieSession = require('cookie-session')
const mainRouter = require('./routes/main.router')
const usersRouter = require('./routes/users.router')
const postsRouter = require('./routes/posts.router')
const commentsRouter = require('./routes/comments.router')
const profileRouter = require('./routes/profiles.router')
const likeRouter = require('./routes/likes.router')
const friendsRouter = require('./routes/friends.router')
const flash = require('connect-flash')
const methodOverride = require('method-override')

// .env 파일 사용
require('dotenv').config()

// token 생성
const cookieEncryptionKey = process.env.cookieSession

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

// connect-flash 미들웨어에 등록
app.use(flash())

// method-override 미들웨어 등록
app.use(methodOverride('_method'))

// ejs 라이브러리와 같이 js를 html로 변환하는 라이브러리를 연동
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')))

// connect-flash 이용
app.get('/send', (req, res) => {
    req.flash('post success', '포스트가 생성되었습니다')
    res.redirect('/receive')
})
app.get('/receive', (req, res) => req.flash('post success')[0])
app.use((req, res, next) => {
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    res.locals.currentUser = req.user
    next()
})
// router
app.use('/', mainRouter)
app.use('/auth', usersRouter)
app.use('/posts', postsRouter)
app.use('/posts/:id/comments', commentsRouter)
app.use('/profile/:id', profileRouter)
app.use('/friends', friendsRouter)
app.use('/posts/:id/like', likeRouter)

// mongoDB 연동
mongoose.connect(process.env.mongoDB_URI)
    .then(() => {
        console.log('mongoDB connected')
    })
    .catch((error) => {
        console.log(error)
    })

// express error handling
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.send(error.message || 'Error Occurred')
})

// 시작페이지를 login페이지로 redirect
app.get((req, res) => {
    console.log('hello world')
})

// backend 최초 실행 시 사용되는 함수
app.listen(port, () => {
    console.log('backend is ready')
    console.log('port', port)
})