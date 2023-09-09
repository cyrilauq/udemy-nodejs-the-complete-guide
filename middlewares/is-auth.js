module.exports = (req, res, next) => {
    if(!req.session.userLoggedIn) {
        return res.status(403).render('403', { pageTitle: 'Forbiden access', path: '/403' });
    }
    next();
};