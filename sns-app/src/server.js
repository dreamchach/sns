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

// ejs 라이브러리와 같이 js를 html로 변환하는 라이브러리를 연동
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// 정적 파일 제공
app.use('/static', express.static(path.join(__dirname, 'public')))

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

// backend 최초 실행 시 사용되는 함수
app.listen(port, () => {
    console.log('backend is ready')
    console.log('port', port)
})