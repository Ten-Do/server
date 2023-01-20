const knex = require('../db/knexfile');
const bcrypt = require('bcrypt');
const tokenService = require('./token');
const userModel = require('../db/models/user');
const UserDTO = require('../dtos/user');
const ApiError = require('../exceptions/api-error')
const AddStorage = require("./adding-storage");


class UserService {
    async registration(user,file) {
        await knex(`users`).select().where({email: user.email}).then(candidate => {
            if (candidate[0]) {
                throw ApiError.BadRequest(`Пользователь с почтовым адресом  уже зарегистрирован`)
            }
        });
        const hashPass = await bcrypt.hash(user.password,10);
        const image = AddStorage.student(file);
        const candidate = await knex(`users`).insert(userModel(user,hashPass,image)).then(() => {
            return knex(`users`).select().where({email: user.email});
        }).then( us => {return us[0]});

        const userDTO = new UserDTO(candidate);


        const tokens = tokenService.generateTokens({...userDTO})

        await tokenService.saveToken(candidate.id,tokens.refreshToken);
        return {
            ...tokens,
            user: userDTO
        }
    }

    async login(email, password){
        const candidate = await knex(`users`).select().where({email: email}).then(candidate => {return candidate[0]});
        if (!candidate) {
            throw ApiError.BadRequest('Пользователь с таким email не найден!')
        }

        const isPassEquals = await bcrypt.compare(password,candidate.password);

        if(!isPassEquals){
            throw ApiError.BadRequest('Неверный парроль');
        }
        const userDTO = new UserDTO(candidate);
        const tokens = tokenService.generateTokens({...userDTO});

        tokenService.saveToken(candidate.id,tokens.refreshToken);
        return {
            ...tokens,
            user: userDTO
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const  userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDB){
            throw ApiError.UnauthorizedError()
        }
        const candidate = await knex(`users`).select().where({id: userData.id}).then(candidate => {return candidate[0]});
        const userDTO = new UserDTO(candidate);
        const tokens = tokenService.generateTokens({...userDTO});

        tokenService.saveToken(userDTO.id,tokens.refreshToken);
        return {
            ...tokens,
            user: userDTO
        }
    }


    async gettingTasks(category, id) {

    }

    async scoreBoard(id,category) {
        const userscore = await knex('raiting').select(category).where({id: id}).then(reg => {
            return reg[0]
        });
        let rate = await knex('raiting').select(category).orderBy(category,"desc").then(regi => {
            return regi
        });
        if (!userscore) {
            throw ApiError.BadRequest('нет в базе данных')
        }
        return {
            rate,
            userscore
        }
    }

}

module.exports = new UserService();