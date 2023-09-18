const Post = require('../models/posts.model')

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

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
    checkPostOwnerShip
}