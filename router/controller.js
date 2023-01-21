const userService = require('../service/user');
const knex = require('../db/db');
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')


class controller {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }

            const userData = await userService.registration(req.body, req.files.img);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json({ userData, message: 'Вы успешно подали заявку на регистрацию' });
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);

        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async gettingTasks(req, res, next) {
        try {
            const { category, page } = req.query;
            const email = req.user.email;
            const tasks = await userService.gettingTasks(email, category, page);

            return res.json(tasks);
        } catch (e) {
            next(e);
        }

    }

    async getTask(req, res, next) {
        try {
            const { task } = req.query;
            const Task = await userService.getTask(task);

            return res.json(Task);
        } catch (e) {
            next(e);
        }

    }

    async scoreBoard(req, res, next) {
        try {
            const { category } = req.query;
            const email = req.user.email;
            const userData = await userService.scoreBoard(email, category);
            return res.json(userData);
        } catch (e) {
            next(e);
        }

    }

    async profile(req, res, next) {
        try {
            await knex('users')
                .select('id', 'name')
                .then((users) => {
                    return res.json(users);
                })
                .catch((err) => {
                    console.error(err);
                    return res.json({ success: false, message: 'An error occurred, please try again later.' });
                })
        } catch (e) {
            next(e);
        }
    }

    async administration(req, res, next) {
        try {
            await knex('users')
                .select('id', 'name')
                .then((users) => {
                    return res.json(users);
                })
                .catch((err) => {
                    console.error(err);
                    return res.json({ success: false, message: 'An error occurred, please try again later.' });
                })
        } catch (e) {
            next(e);
        }
    }

}


module.exports = new controller()