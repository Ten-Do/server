const db = require('../../db/db');
const Storage = require('./storageController')
const uuid = require('uuid');
const path = require('path');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator')


// TODO работа с токеном

/**
 * POST: body = {email, name, surname, subscriptions} => status + message 
 * DELETE: body = {id} => status + message
 * GET (one): params = {id} => json
 * PUT: body = {id, type, title, [description, file]} => status + message
 */
//Math.random().toString(36).slice(-8);

function gen_password() {
    let password = "";
    const symbols = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789!%?*()_+=";
    for (let i = 0; i < 12; i++) {
        password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }
    return password;
}

class UsersController {
    async addUser(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }

            const { email, name, surname, subscriptions } = req.body;
            const file = req.files.studentCard;
            await db(`users`).select().where({ email }).then(candidate => {
                if (candidate.length !== 0) {
                    throw ApiError.BadRequest(`Пользователь с почтовым адресом  уже зарегистрирован`)
                }
            });

            const password = gen_password();
            const hashPass = await bcrypt.hash(password, 3);
            const fileName = await Storage.addStudentCard(file);

            await db(`users`)
                .insert({ email, name, surname, ...subscriptions, password: hashPass, student_card: fileName, activated: false, role: 'user' })
                .then(_ => { res.status(201).send({ message: "Добавление прошло успешно" }) })
                .catch(error => { res.status(501).send({ message: "База данных отклонила добавление" }); next(error) })

        } catch (error) {
            res.status(500).send({ message: "Произошла неожиданная ошибка. Пожалуйста попробуйте позже" });
            next(error);
        }
    }

    // для самого пользователя
    async updateUser(req, res, next) {
        try {
            const { id, email, name, surname, subscriptions } = req.body;
            await db('user').select('*').where('id', id)
                .then(user => {
                    db('user').where('id', id).update({ ...user, email, name, surname, ...subscriptions })
                        .then(_ => { res.status(201).send({ message: "Обновление прошло успешно" }) })
                })
                .catch(error => { res.status(501).send({ message: "Пользователь не найден" }); next(error) })
        } catch (error) {
            res.status(500).send({ message: "Произошла неожиданная ошибка. Пожалуйста попробуйте позже" });
            next(error);
        }
    }

    async getOneUser(req, res, next) {
        try {
            await db('user')
                .select('*')
                .where('id', req.params.id)
                .then(result => {
                    if (result.length) {
                        return res.status(200).send(result)
                    } else {
                        return res.status(404).send({ message: "Указанный пользователь не найден" })
                    }
                })
                .catch(error => { res.status(501).send({ message: "База данных отклонила получение" }); next(error) })
        } catch (error) {
            res.status(500).send({ message: "Произошла неожиданная ошибка. Пожалуйста попробуйте позже" });
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            await db('users')
                .where('id', req.body.id)
                .del()
                .then(_ => { res.status(200).send({ message: "Удаление прошло успешно" }) })
                .catch(error => { res.status(501).send({ message: "База данных отклонила удаление" }); next(error) })
        } catch (error) {
            res.status(500).send({ message: "Произошла неожиданная ошибка. Пожалуйста попробуйте позже" });
            next(error);
        }
    }
}

module.exports = new UsersController()