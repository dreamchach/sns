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

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
}