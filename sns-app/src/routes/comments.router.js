const express = require('express')
const { checkAuthenticated, checkCommentOwnership } = require('../middlewares/auth')
const router = express.Router({mergeParams : true})
const Post = require('../models/posts.model')
const Comment = require('../models/comments.model')

router.post('/', checkAuthenticated, (req, res) => {
    Post.findById(req.params.id)
        .then((post) => {
            Comment.create(req.body)
                .then((comment) => {
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    comment.save()

                    post.comments.push(comment)
                    post.save()

                    req.flash('success', '댓글이 생성되었습니다')
                    res.redirect('back')
                })
                .catch((error) => {
                    req.flash('error', '댓글을 생성 중 에러가 발생했습니다')
                    console.log(error)
                    res.redirect('/posts')
                })
        })
        .catch((error) => {
            console.log(error)
            req.flash('error', '댓글을 생성 중 에러가 발생했습니다')
            res.redirect('/posts')
        })
})

router.delete('/:commentId', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.commentId)
        .then(() => {
            req.flash('success', '댓글을 삭제했습니다')
            res.redirect('back')
        })
        .catch((error) => {
            req.flash('error', '댓글 삭제 중 에러가 발생했습니다')
            res.redirect('back')
        })
})

router.get('/:commentId/edit', checkCommentOwnership, (req, res) => {
    Post.findById(req.params.id)
        .then((post) => {
            res.render('comments/edit', {
                post : post,
                comment : req.comment
            })
        })
        .catch((error) => {
            req.flash('error', '에러가 발생했습니다')
            res.redirect('back')
        })
})

router.put('/:commentId', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.commentId, req.body)
        .then(() => {
            req.flash('success', '댓글을 수정하는데 성공했습니다')
            res.redirect('/posts')
        })
        .catch((error) => {
            req.flash('error', '댓글을 수정하는데 에러가 발생했습니다')
            res.redirect('back')
        })
})


module.exports = router