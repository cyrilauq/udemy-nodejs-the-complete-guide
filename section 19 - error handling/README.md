## Using nodemailer with gmail
To be able to use nodemailer is tried different things.
At first, I just used my mail and password, and it didn't work.
Then I created a new project in the google console and added new OAuth credentials, that didn't works at all too.
Then I try just using an email and create an application password and that works!
Here how i did:
1. I enabled 2-Step authentification (on this page: https://myaccount.google.com/security)
2. Once it's done, I set up a new app password(on this page: https://myaccount.google.com/u/2/apppasswords)
    - In the dropdown, i selected the "Other" choice
    - Then clicked on the "Generate" button
    - Finally I copy the displayed code

So here is some basic code you can use:
But first you need to run this command if you don't have nodemailer
```sh
npm install --save nodemailer
```

```js
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'you-mail',
        pass: 'the-generated-password-you-previously-copied'
    }
});

var mailOptions = {
    from: 'you-mail',
    to: 'another-mail',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
```

## Set up
When you've cloned this project, you'll need to create a ".env" file for it to work.
I store some critical information in it.
It will look like this: 
```sh
APP_PASSWORD = 'the-generated-password-you-previously-copied'
MAIL_SENDER = 'you-mail'
TOKEN_BITS_COUNT = 42 (the number you want)
```

## Validation

The validation process use the "express-validator" library and you can find some informations about it here: https://express-validator.io/docs