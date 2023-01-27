const nodemailer = require('nodemailer')
const ApiError = require('../exceptions/api-error')

const devAccount = nodemailer.createTestAccount()
const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 465,
    secure: true,
    auth: {
        user: devAccount.user,
        pass: devAccount.pass
    }
})



class EmailService {
    async sendPass(email, pass) {
        const mailOptions = {
            from: '"КиберПолигон ГУАП" <suai@cuberpolygon.com>', // sender address
            to: email,
            subject: 'Вход в сервис ГУАП', // Subject line
            html: `
                <h2>Ваш пароль для входа на сайт</h2>
                ${pass}
            `
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) throw ApiError.BadRequest(`Ошибка при отправке пароля на Email`);
        })
    }

    async sendIsVerified(email, isVerified) {
        const mailOptions = {
            from: '"КиберПолигон ГУАП" <suai@cuberpolygon.com>', // sender address
            to: email,
            subject: 'Верификация КиберПолигон', // Subject line
            html: isVerified ? `
            <h2>Аккаунт верифицирован!<br>Чувствуй себя как дома</h2>
            ` : `
            <h2>Аккаунт не прошел верификацию!<br>У вас нет доступа</h2>
            `
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) throw ApiError.BadRequest(`Ошибка при отправке пароля на Email`);
        })
    }
}

module.exports = new EmailService()