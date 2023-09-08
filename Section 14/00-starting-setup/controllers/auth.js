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
    req.session.userLoggedIn = true;
    res.redirect('/');
};