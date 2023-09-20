const Post = require('../models/posts.model')
const Comment = require('../models/comments.model')
const User = require('../models/users.model')

// Protected Route
function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

// Public Route
function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/posts')
    }
    next()
}

function checkPostOwnerShip (req, res, next) {
    if(req.isAuthenticated()){
        Post.findById(req.params.id)
            .then((post) => {
                if(!post) {
                    req.flash('error', '포스트가 없습니다')
                    res.redirect('back')
                } else {
                    if (post.author.id.equals(req.user._id)) {
                        req.post = post
                        next()                        
                    } else {
                        req.flash('error', '권한이 없습니다')
                        res.redirect('back')
                    }
                }
            })
            .catch((error) => {
                req.flash('error', '에러가 발생했습니다')
                res.redirect('back')
            })
    }else {
        req.flash('error', '로그인을 먼저 해주세요')
        res.redirect('/login')
    }
}

function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.commentId)
            .then((comment) => {
                if(comment.author.id.equals(req.user._id)) {
                    req.comment = comment
                    next()
                }
                else {
                    req.flash('error', '권한이 없습니다')
                    res.redirect('back')
                }
            })
            .catch((error) => {
                req.flash('error', '댓글을 찾는 도중에 에러가 발생했습니다')
                res.redirect('back')
            })
    } else {
        req.flash('error', '로그인을 해주세요')
        res.redirect('/login')
    }
}

function checkIsMe(req, res, next) {
    if(req.isAuthenticated()) {
        User.findById(req.params.id)
            .then((user) => {
                if(user._id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash('error', '권한이 없습니다')
                    res.redirect('/profile/' + req.params.id)
                }
            })
            .catch((error) => {
                req.flash('error', '유저를 찾는데 에러가 발생했습니다')
                res.redirect('/profile/' + req.params.id)
            })
    } else {
        req.flash('error', '먼저 로그인을 해주세요')
        res.redirect('/login')
    }
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
    checkPostOwnerShip,
    checkCommentOwnership,
    checkIsMe
}