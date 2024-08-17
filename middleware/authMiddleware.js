function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        // User is authenticated, proceed to the next middleware/route
        return next();
    }
    res.redirect('/login'); 
}

module.exports = isAuthenticated; 
