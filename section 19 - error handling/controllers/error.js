exports.get404 = (req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404', userAuthenticated: req.session.userLoggedIn });
};

exports.get403 = (req, res, next) => {
    res.status(403).render('403', { pageTitle: 'Forbiden access', path: '/403', userAuthenticated: req.session.userLoggedIn });
};

exports.get500 = (req, res, next) => {
    res.status(500).render('500', { pageTitle: 'Server internal error', path: '/500', userAuthenticated: req.session.userLoggedIn });
};