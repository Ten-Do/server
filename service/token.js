const jwt = require('jsonwebtoken')
const knex = require('../db/knexfile');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '60m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '1d'});
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        }
        catch (e){
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        }
        catch (e){
            return null;
        }
    }

    async saveToken(userId, refreshToken){
        return knex(`users`)
            .update({refreshToken: refreshToken})
            .where({id: userId });
    }

    async removeToken(refreshToken) {
        const tokenData = await knex(`users`)
            .update({refreshToken: 0})
            .where({refreshToken: refreshToken });
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await knex(`users`)
            .select('id')
            .where({refreshToken: refreshToken })
            .then(id => {return id[0]});
        return tokenData;
    }

}

module.exports = new TokenService();