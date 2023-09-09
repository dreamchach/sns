const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()
const port = 4000
const path = require('path')

// .env 파일 사용
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({extended : false}))

// 정적 파일 제공
app.use('/static', express.static(path.join(__dirname, 'public')))

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