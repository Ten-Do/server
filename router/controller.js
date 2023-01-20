const userService = require('../service/user');
const knex = require('../db/knexfile');
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')


class controller {
    async registration(req, res, next){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации',errors.array()))
            }

            const userData = await userService.registration(req.body,req.files.img);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 24*60*60*1000, httpOnly: true});
            return res.json(userData);
        }catch (e) {
            next(e);
        }
    }

    async login(req, res, next){
        try {
            const {email,password } = req.body;
            const userData = await userService.login(email,password);

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 24*60*60*1000, httpOnly: true});
            return res.json(userData);
        }catch (e) {
            next(e);
        }
    }

    async logout(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);

        }catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 24*60*60*1000, httpOnly: true});
            return res.json(userData);
        }catch (e) {
            next(e);
        }
    }

    async gettingTasks(req, res, next) {
        try{
            const {category} = req.body;
            const {refreshToken} = req.cookies;
            const userData = await userService.gettingTasks(category,refreshToken);

            return res.json(userData);
        }catch (e) {
            next(e);
        }

    }

    async scoreBoard(req, res, next){
        try{
            const {id,category} = req.body;
            const userData = await userService.scoreBoard(id,category);
            return res.json(userData);
        }catch (e){
            next(e);
        }

    }

    async profile(req, res, next){
        try {
            await knex('users')
                .select('id', 'name')
                .then((users) => {
                    return res.json(users);
                })
                .catch((err) => {
                    console.error(err);
                    return res.json({success: false, message: 'An error occurred, please try again later.'});
                })
        }catch (e) {
            next(e);
        }
    }

    async administration(req, res, next){
        try {
            await knex('users')
                .select('id', 'name')
                .then((users) => {
                    return res.json(users);
                })
                .catch((err) => {
                    console.error(err);
                    return res.json({success: false, message: 'An error occurred, please try again later.'});
                })
        }catch (e) {
            next(e);
        }
    }

}


module.exports = new controller()