const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/token");


module.exports = function (roles) {
    return function (req, res, next) {
        try{
            const userRole = req.user;

            if (!userRole.role){
                return next(ApiError.UnauthorizedError());
            }

            if (!roles.includes(userRole.role)) {
                return next(ApiError.ForbiddenError())
            }

            next();
        }catch (e) {
            return  next(e);
        }
    }
}