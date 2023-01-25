const db = require('../../db/db');
const bcrypt = require('bcrypt');
const ApiError = require('../../exceptions/api-error')
const tokenService = require('../../services/tokensService')

class TokensController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            await db(`users`).select().where({ email: email })
                .then(async users => {
                    const user = users[0]
                    if (!user) {
                        throw ApiError.BadRequest('Пользователь с таким email не найден!')
                    }
                    if (!(await bcrypt.compare(password, user.password))) {
                        throw ApiError.BadRequest('Неверный парроль');
                    }
                    const userInfo = {
                        name: user.name,
                        surname: user.surname,
                        role: user.role,
                        activated: user.activated,
                        subscriptions: {
                            admin: user.admin,
                            reverse: user.reverse,
                            stegano: user.stegano,
                            ppc: user.ppc,
                            forensic: user.forensic,
                            crypto: user.crypto,
                            web: user.web,
                            network: user.network,
                            osint: user.osint,
                        }
                    }
                    const tokens = tokenService.generateTokens(userInfo);
                    tokenService.saveToken(user.id, tokens.refreshToken);
                    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
                });

            return res.status(200);
        } catch (e) {
            next(e);
        }
    }


    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            await tokenService.removeToken(refreshToken);
            res.clearCookie('refreshToken');
            return res.status(200);

        } catch (e) {
            next(e);
        }

    }


    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                throw ApiError.UnauthorizedError();
            }
            const userData = tokenService.validateRefreshToken(refreshToken);
            const tokenFromDB = await tokenService.findToken(refreshToken);
            if (!userData || !tokenFromDB) {
                throw ApiError.UnauthorizedError();
            }
            const tokens = tokenService.generateTokens(userData);
            tokenService.saveToken(userData.id, tokens.refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
            return res.status(200);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new TokensController();