const ApiError = require('../exceptions/api-error');
const categories = require('../db/models/categories')

module.exports = function (req, res, next) {
    try{

        const {category} = req.query;
        if(!category){
            return next(ApiError.BadRequest('Выберите категорию'));
        }
        if(!categories.includes(category)){
            return next(ApiError.BadRequest('Категории не существует!'));
        }


        next();
    }catch (e) {
        return  next(ApiError.UnauthorizedError());
    }
}