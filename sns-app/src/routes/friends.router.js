const express = require('express')
const { checkAuthenticated } = require('../middlewares/auth')
const router = express.Router()
const User = require('../models/users.model')

router.get('/', checkAuthenticated, async (req, res) => {
    await User.find({})
        .then((users) => {
            res.render('friends/index', {
                users : users
            })
        })
        .catch((error) => {
            req.flash('error', '유저를 가져오는데 에러가 발생했습니다')
            res.redirect('/posts')
        })
})

router.put('/:id/add-friend', checkAuthenticated, (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            console.log(user.friendsRequests.concat([req.user._id]))
            User.findByIdAndUpdate(user._id, {friendsRequests : user.friendsRequests.concat([req.user._id])})
                .then(() => {
                    req.flash('success', '친구 추가 성공했습니다')
                    res.redirect('back')
                })
                .catch((error) => {
                    req.flash('error', '친구 추가하는데 에러가 발생했습니다')
                    res.redirect('back')
                })
        })
        .catch((error) => {
            req.flash('error', '유저가 없거나 유저를 찾는데 실패했습니다')
            res.redirect('back')
        })
})

router.put('/:firstId/remove-friend-request/:secondId', checkAuthenticated, (req, res) => {
    User.findById(req.params.firstId)
        .then((user) => {
            const filteredFriendsRequests = user.friendsRequests.filter((friendId) => friendId !== req.params.secondId)
            User.findByIdAndUpdate(user._id, {friendsRequests : filteredFriendsRequests})
                .then(() => {
                    req.flash('success', '친구 요청 취소를 성공했습니다')
                    res.redirect('back')
                })
                .catch((error) => {
                    req.flash('error', '친구 요청 취소를 하는데 에러가 발생했습니다')
                    res.redirect('back')
                })
        })  
        .catch((error) => {
            req.flash('error', '유저를 찾지 못했습니다')
            res.redirect('back')
        })
})

router.put('/:id/accept-friend-request', checkAuthenticated, (req, res) => {
    User.findById(req.params.id)
        .then((senderUser) => {
            User.findByIdAndUpdate(senderUser._id, {friends : senderUser.friends.concat([req.user.id])})
                .then(() => {
                    User.findByIdAndUpdate(req.user._id, {
                        friends : req.user.friends.concat([senderUser._id]),
                        friendsRequests : req.user.friendsRequests.filter((friendId) => friendId !== senderUser._id.toString())
                    })
                        .then(() => {
                            req.flash('success', '친구 추가를 성공했습니다')
                            res.redirect('back')
                        })
                        .catch((error) => {
                            req.flash('error', '친구 추가하는데 실패했습니다')
                            res.redirect('back')
                        })  
                })
                .catch((error) => {
                    req.flash('error', '친구를 추가하는데 실패했습니다')
                    res.redirect('back')
                })
        })
        .catch((error) => {
            req.flash('error', '유저를 찾지 못했습니다')
            res.redirect('back')
        })
})

router.put('/:id/remove-friend', checkAuthenticated, (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            User.findByIdAndUpdate(user._id, {friends : user.friends.filter((friendId) => friendId !== req.user._id.toString())})
                .then(() => {
                    console.log(req.user)
                    User.findByIdAndUpdate(req.user._id, {friends : req.user.friends.filter((friendId) =>friendId !== req.params.id.toString())})
                        .then(() => {
                            req.flash('success', '친구 삭제하는데 성공했습니다')
                            res.redirect('back')
                        })
                        .catch((error) => {
                            req.flash('error', '친구 취소하는데 실패했습니다')
                            res.redirect('back')
                        })
                })
                .catch((error) => {
                    req.flash('error', '친구를 삭제하는데 실패했습니다')
                    res.redirect('back')
                })
        })
        .catch((error) => {
            req.flash('error', '유저를 찾는데 실패했습니다')
            res.redirect('back')
        })
})

module.exports = router