const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'omaralhoori1@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Hello world.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'omaralhoori1@gmail.com',
        subject: 'Sorry to see you!',
        text: `Sorry to the app, ${name}. good bye world.`
    })
}

module.exports = {
    sendWelcomeEmail ,
    sendCancelationEmail
}