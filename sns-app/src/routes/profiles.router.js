const express = require('express')
const router = express.Router({mergeParams : true})
const { checkAuthenticated } = require('../middlewares/auth')
const Post = require('../models/posts.model')
const User = require('../models/users.model')

router.get('/', checkAuthenticated, (req, res) => {
    Post.find({'author.id' : req.params.id})
        .populate('comments')
        .sort({createdAt : -1})
        .exec()
        .then((posts) => {
            User.findById(req.params.id)
                .then((user) => {
                    res.render('profile/index', {
                        posts : posts,
                        user : user
                    })
                })
                .catch((error) => {
                    req.flash('error', '없는 유저입니다')
                    res.redirect('back')
                })
        })
        .catch((error) => {
            req.flash('error', '게시물을 가져오는데 실패했습니다')
            res.redirect('back')
        })
})

module.exports = router