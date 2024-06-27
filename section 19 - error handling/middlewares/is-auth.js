module.exports = (req, res, next) => {
    if(!req.session.userLoggedIn) {
        return res.status(401).render('401', { pageTitle: 'Forbiden access', path: '/401' });
    }
    next();
};