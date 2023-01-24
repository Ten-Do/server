const jwt = require('jsonwebtoken')
const db = require('../db/db');


class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '60m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });
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
        catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        }
        catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        return db(`tokens`)
            .update({ refresh_token: refreshToken })
            .where({ user_id: userId });
    }

    async removeToken(refreshToken) {
        const tokenData = await db(`tokens`)
            .update({ refresh_token: 0 })
            .where({ refresh_token: refreshToken });
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await db(`tokens`)
            .select('user_id')
            .where({ refresh_token: refreshToken })
            .then(id => { return id[0] });
        return tokenData;
    }

}

module.exports = new TokenService();