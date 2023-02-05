const nodemailer = require('nodemailer');
const db = require('../db/db');
const ApiError = require('../exceptions/api-error')
require("dotenv").config({ path: __dirname + '/../.env' });
const uuid = require('uuid')




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
        const verify_link = uuid.v4();
        const mailOptions = {
            from: `"КиберПолигон ГУАП" <${process.env.EMAIL_NAME}>`,
            to: email,
            subject: 'Вход в сервис ГУАП',
            html: `
            <h2>Ваш пароль для входа на сайт</h2>
            ${pass}
            <hr>
            <a href="${process.env.SERVER_LINK}/verify/${verify_link}">ссылка для подтверждения почты</p>
            <hr>`
        };
        await db('unverified_emails')
            .insert({ email, verify_link })
            .then(() => {
                this.transporter.sendMail(mailOptions, (err) => {
                    if (err) {
                        console.log(err);
                        throw ApiError.BadRequest("Ошибка при отправке пароля на Email")
                    }
                })
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

    async verifyEmail(req, res, next) {
        const verify_link = req.params.verify_link;
        await db('unverified_emails')
            .select('email')
            .where({ verify_link })
            .then(emails => {
                if (!emails.length) {
                    res.status(404).send("ссылка недействительна")
                    throw ApiError.NotFoundError("ссылка недействительна")
                }
                else return emails[0]
            })
            .then((email) => {
                db.transaction(trx => {
                    db('users')
                        .transacting(trx)
                        .where(email)
                        .update({ activated: true })
                        .then(() => {
                            return db('unverified_emails')
                                .transacting(trx)
                                .where(email)
                                .del()
                        })
                        .then(trx.commit)
                        .catch(trx.rollback);
                })
            })
            .then(() => {
                return res.redirect(`${process.env.CLIENT_LINK}/login`);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

// false && delete   activated
module.exports = new EmailService()