require('dotenv').config();

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const envConfig = process.env;

const sender = `${envConfig.MAIL_SENDER}`;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: sender,
    pass: `${envConfig.APP_PASSWORD}`
  }
});

const User = require('../models/user');

// To render an error message on the forms we use flash
// To give it information we need to use the req.flash() method, it takes two arguments, the first is the "key" of the stored item and the second is the item we want to store
// To retrieve the message we'll use req.flash() method, but with one arguments(the key of the item we want to retrieve) and it'll give us what stored with this key

exports.getLogin = (req, res, next) => {
    const message = req.flash('error');
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message.length > 0 ? message[0] : null
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
        email: email
    })
        .then(user => {
            if(!user) {
                req.flash('error', 'Invalide email.');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if(doMatch) {
                        req.session.userLoggedIn = true;
                        req.session.user = user;
                        // We call save mthod because, before redirecting the user we need to be sure that the information are in the session
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalide password.');
                    res.redirect('/login');
                })
                .catch(error => {
                    console.log(error);
                    res.redirect('/login');
                });
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    // We'll destroy the session and if we want we can pass a function to the method so we can do something after the destroy of the session
    req.session.destroy(() => {
        res.redirect('/');
    });
};

exports.getSignup = (req, res, next) => {
    const message = req.flash('error');
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message.length > 0 ? message[0] : null
    })
};

exports.postSignup = (req, res, next) => {
    const password = req.body.password;
    const email = req.body.email;
    const confirmPassword = req.body.confirmPassword;
    const name = req.body.name;
    User.findOne({
        email: email
    })
        .then(user => {
            if(user) {
                req.flash('error', 'User already exists.');
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPasseword => {
                    const newUser = new User({
                        email: email,
                        password: hashedPasseword,
                        name: name,
                        cart: []
                    });
                    return newUser.save();
                })
                .then(result => {
                    res.redirect('/login');

                    var mailOptions = {
                        from: 'shop@node-complete.com',
                        to: email,
                        subject: 'Welcom to our shop!',
                        text: 'You successfully signed up!'
                    };
                    
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        })
        .catch(error => {
            console.log(error);
        })
};

exports.getResetPassword = (req, res, next) => {
    const message = req.flash('error');
    res.render('auth/reset-pwd', {
        path: '/reset-pwd',
        pageTitle: 'Reset password',
        errorMessage: message.length > 0 ? message[0] : null
    });
}

exports.postResetPassword = (req, res, next) => {
    
}