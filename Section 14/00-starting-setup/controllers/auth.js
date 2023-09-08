exports.getLogin = (req, res, next) => {
    const isLoggedIn = req.get('Cookie').split(';')[0].split('=')[1];
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        userAuthenticated: isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    // To set a cookie we'll set a header, by using setHeader
    // It takes the header name's and it's value
    // The Set-Cookie name, is a reserved name wich means it has already a default behavior, is used for setting cookies 
    res.setHeader('Set-Cookie', 'userLoggedIn=true');
    res.redirect('/');
};