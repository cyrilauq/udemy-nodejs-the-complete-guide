require('dotenv').config();

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const { validationResult } = require('express-validator');

const envConfig = process.env;

const sender = `${envConfig.MAIL_SENDER}`;
const HASH_SALT = 12;

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

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    const user = await User.findOne({ email: email });
    if(!errors.isEmpty()) {
        return res
            .status(422)
            .render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: errors.array()[0].msg
            }); // returns response that tells that the validation failed
    }
    req.session.userLoggedIn = true;
    req.session.user = user;
    // We call save mthod because, before redirecting the user we need to be sure that the information are in the session
    return req.session.save(err => {
        console.log(err);
        res.redirect('/');
    });
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
    const name = req.body.name;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res
            .status(422)
            .render('auth/signup', {
                path: '/signup',
                pageTitle: 'Signup',
                errorMessage: errors.array()[0].msg
            }); // returns response that tells that the validation failed
    }
    bcrypt.hash(password, HASH_SALT)
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
    // To make it more secure we'll send a mail to reset the password to the user and in the provided link we'll have a token.
    // The token will be generated with TOKEN_BITS_COUNT bits.
    // the method randomBytes has a callback with to argument, an error (with eventually an error message) and a buffer (will contains the random bytes)
    crypto.randomBytes(parseInt(envConfig.TOKEN_BITS_COUNT), (err, buffer) => {
        if(err) {
            console.log(err);
            return res.redirect('/reset-pwd');
        }
        const token = buffer.toString('hex');
        User.findOne({
            email: req.body.email
        })
            .then(user => {
                if(!user) {
                    req.flash('error', 'No user found for the given mail.')
                    return res.redirect('/reset-pwd');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + (100 * 60 * 60);
                return user.save()
                    .then(user => {                        
                        res.redirect('/');
                        var mailOptions = {
                            from: 'shop@node-complete.com',
                            to: user.email,
                            subject: 'Password reset',
                            html: `
                            <h1>Password reset</h1>
                            <p>You requested a password reset</p>
                            <p>Click this <a href="http://localhost:3000/reset-pwd/${token}">link</a> to set a new password</p>
                            <p>(If you didn't requested it ignore the mail)</p>
                            `
                        };
                        
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                    });
            })
            .catch(error => {
                console.log(error);
            });
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    // We'll search after a user for the given token and check if the token is valid.
    User.findOne({
        resetToken: token,
        resetTokenExpiration: {
            $gt: Date.now() // With "$gt" will verify that the field it greater than the value 
        }
    })
        .then(user => {
            if(!user) {
                req.flash('error', 'Invalid token.')
                return res.redirect('/reset-pwd');
            }
            const message = req.flash('error');
            res.render('auth/new-pwd', {
                path: '/reset-pwd',
                pageTitle: 'Update password',
                errorMessage: message.length > 0 ? message[0] : null,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch();
};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.newPassword;
    const newPasswordConfirmation = req.body.newPasswordConfirmation;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: {
            $gt: Date.now() // With "$gt" will verify that the field it greater than the value 
        },
        _id: userId
    })
        .then(user => {
            if(!user) {
                req.flash('error', 'Invalid token.')
                return res.redirect('/reset-pwd');
            }
            resetUser = user;
            return bcrypt.hash(newPassword, HASH_SALT);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
            var mailOptions = {
                from: 'shop@node-complete.com',
                to: resetUser.email,
                subject: 'Password reset',
                html: `
                <h1>Password reset</h1>
                <p>Congratulation, you successfully reset your password!!!</p>
                <p>(If you didn't reset your password please change it now)</p>
                `
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
};