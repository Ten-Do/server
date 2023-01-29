const ApiError = require('../exceptions/api-error');
const categories = require('../db/models/categories')

module.exports = function (req, res, next) {
    try{

        const {category, difficulty, points, title, description, answer, solution} = req.body;
        const task_file = req.files?.task;
        if(!category || !difficulty || !points || !title || !description || !answer || !solution || !task_file){
            return next(ApiError.BadRequest('Одно или несколько полей не заполнены!'));
        }
        if (points < 30 || points > 1000) {
            return next(ApiError.BadRequest('Невозможное количество очков!'));
        }
        if(!categories.includes(category)){
            return next(ApiError.BadRequest('Категории не существует!'));
        }
        if(!['low', 'medium', 'hard'].includes(difficulty)){
            return next(ApiError.BadRequest('Заданной сложности не существует!'));
        }

        next();
    }catch (e) {
        return  next(ApiError.BadRequest('Ошибка с файлом!'));
    }
}