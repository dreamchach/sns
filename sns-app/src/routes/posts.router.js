const express = require('express')
const { checkAuthenticated } = require('../middlewares/auth')
const router = express.Router()
const Post = require('../models/posts.model')
const multer = require('multer')
const path = require('path')
const Comment = require('../models/comments.model')

const storageEngine = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, path.join(__dirname, '../public/assets/images'))
    },
    filename : (req, file, callback) => {
        callback(null, file.originalname)
    }
})
const upload = multer({storage : storageEngine}).single('image')
router.post('/', checkAuthenticated, upload, (req, res, next) => {
    let desc = req.body.desc
    let image = req.file ? req.file.filename : ''

    Post.create({
        image : image,
        description : desc,
        author : {
            id : req.user._id,
            username : req.user.username
        }
    }).then((post) => res.redirect('back'))
    .catch((error) => next(error))
})

router.get('/', checkAuthenticated, (req, res) => {
    Post.find()
        .populate('comments')
        .sort({createdAt : -1})
        .exec()
        .then((posts) => {
            res.render('posts/index', {
                posts : posts,
                currentUser : req.user
            })
        })
        .catch((error) => console.log(error))
})

module.exports = router