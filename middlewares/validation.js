const ApiError = require('../exceptions/api-error');
const path = require('path')

module.exports = function (req, res, next) {
    try {
        const extension = (path.extname(req.files[Object.keys(req.files)[0]].name)).toLowerCase();
        switch (extension) {
            case '.jpg':
            case '.jpeg':
            case '.bmp':
            case '.png':
                break;
            default:
                return next(ApiError.BadRequest("Неприемлемый тип у файла"));
        }
        next();
    } catch (e) {
        console.log(e)
        return next(ApiError.BadRequest("Фотография студенческого обязательна!"));
    }
}