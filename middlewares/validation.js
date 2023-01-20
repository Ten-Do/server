const ApiError = require('../exceptions/api-error');
const path = require('path')

module.exports = function (req, res, next) {
    try{
        let extension = (path.extname(req.files.img.name)).toLowerCase();
        switch (extension) {
            case '.jpg':
            case '.jpeg':
            case  '.bmp':
            case  '.png':
                break;
            default:
                return next(ApiError.BadRequest("Неприемлемый тип у файла"));
        }
        next();
    }catch (e) {
        return  next(ApiError.BadRequest("Фотография студенческого обязательна!"));
    }
}