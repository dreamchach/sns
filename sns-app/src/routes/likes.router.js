const express = require('express')
const router = express.Router({mergeParams : true})
const { checkAuthenticated } = require('../middlewares/auth')
const Post = require('../models/posts.model')

router.put('/', checkAuthenticated, (req, res) => {
    Post.findById(req.params.id)
        .then((post) => {
            if(post.likes.find((like) => like === req.user._id.toString())) {
                const updatedLikes = post.likes.filter((like) => like !== req.user._id.toString())
                Post.findByIdAndUpdate(post._id, {likes : updatedLikes})
                    .then(() => {
                        req.flash('success', '좋아요를 업데이트 했습니다')
                        res.redirect('back')
                    })
                    .catch((error) => {
                        req.flash('error', '좋아요를 업데이트하는데 에러가 발생했습니다')
                        res.redirect('back')
                    })
            } else {
                Post.findByIdAndUpdate(post._id, {likes : post.likes.concat([req.user._id])})
                    .then(() => {
                        req.flash('success', '좋아요를 업데이트 했습니다')
                        res.redirect('back')
                    })
                    .catch((error) => {
                        req.flash('error', '좋아요를 업데이트하는데 에러가 발생했습니다')
                        res.redirect('back')
                    })
            }
        })
        .catch((error) => {
            req.flash('error', '포스트를 찾지 못했습니다')
            res.redirect('back')
        })
})

module.exports = router