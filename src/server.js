const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()
const port = 4000
const path = require('path')

// .env 파일 사용
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({extended : false}))

// ejs 라이브러리와 같이 js를 html로 변환하는 라이브러리를 연동
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// 정적 파일 제공
app.use('/static', express.static(path.join(__dirname, 'public')))

// ejs파일들 렌더링
app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/signup', (req, res) => {
    res.render('signup')
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