const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    console.log(req.session.userLoggedIn);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        userAuthenticated: req.session.userLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    // To set a cookie we'll set a header, by using setHeader
    // It takes the header name's and it's value
    // The Set-Cookie name, is a reserved name wich means it has already a default behavior, is used for setting cookies 
    // We can set the expires date juste by addinge "; Expires=" and the date after our cookie's value
    // We can set the how long it will be there juste by addinge "; Max-Age=" and the value after our cookie's value
    // We can set where the cookie data will be send juste by addinge "; Domain=" and the domain after our cookie's value
    // We can set a cookie to be used only if the page is secure (using HTTPS) by writing "; Secure" after our cookie's value
    // We can set a cookie to be only use in http request by writing "; HttpOnly" after our cookie's value, it will ensure that we can't access it's value through js or via client codes
    User.findById("64f9a4caa0b3495535d49017")
        .then(user => {
            req.session.user = user;
            req.session.userLoggedIn = true;
            res.redirect('/');
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    // We'll destroy the session and if we want we can pass a function to the method so we can do something after the destroy of the session
    req.session.destroy(() => {
        res.redirect('/');
    });
};