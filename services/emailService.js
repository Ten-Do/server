const nodemailer = require('nodemailer')
const ApiError = require('../exceptions/api-error')
require("dotenv").config({ path: __dirname + '/../.env' });




class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_NAME,
                pass: process.env.EMAIL_PASS
            }
        })
    }

    async sendPass(email, pass) {
        const mailOptions = {
            from: `"КиберПолигон ГУАП" <${process.env.EMAIL_NAME}>`,
            to: email,
            subject: 'Вход в сервис ГУАП',
            html: `
                <h2>Ваш пароль для входа на сайт</h2>
                ${pass}
            `
        };

        this.transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.log(err);
                throw ApiError.BadRequest("Ошибка при отправке пароля на Email")
            }
        })
    }

    async sendIsVerified(email, isVerified) {
        const mailOptions = {
            from: `"КиберПолигон ГУАП" <${process.env.EMAIL_NAME}>`,
            to: email,
            subject: 'Верификация КиберПолигон',
            html: isVerified ? `
            <h2>Аккаунт верифицирован!<br>Чувствуй себя как дома</h2>
            ` : `
            <h2>Аккаунт не прошел верификацию!<br>У вас нет доступа</h2>
            `
        };

        this.transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.log(err);
                throw ApiError.BadRequest("Ошибка при отправке информации о верификации на Email пользователя")
            }
        })
    }
}

module.exports = new EmailService()