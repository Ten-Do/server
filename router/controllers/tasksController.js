const db = require('../../db/db');
const TasksModel = require("../../db/models/tasks");
const ApiError = require("../../exceptions/api-error");
const storageService = require("../../services/storageService");
const cipherService = require("../../services/cipherService");
/**
 * POST: body = {category, difficulty, points, title, description, answer, solution} => status + message
 * DELETE: body = {id} => status + message
 * GET (all): query = {category, page} => json({tasks, nextPage})
 * GET (one): query = {id} => json({task})
 * PUT:
 */




class TasksController {
    async addTask(req, res, next) {
        try {
            const {category, difficulty, points, title, description, answer, solution} = req.body;
            const task = req.files.task;
            const taskObj = {category, difficulty, points, title, description, answer};
            taskObj.task_file = await storageService.addStorage(__dirname+'storage/tasks' ,task);
            taskObj.solution = cipherService.encrypt(solution);


            await db(`tasks`).insert(taskObj)
                .then(_ => { res.status(201).send({ message: "Добавление прошло успешно" }) })
                .catch(error => { throw ApiError.NotImplementedError(error) })


        } catch (error) {
            next(error);
        }
    }

    async updateTask(req, res, next) {
        try {

        } catch (error) {
            next(error);
        }
    }

    async getTasks(req, res, next) {
        try {
            const {email ,category} = req.user;
            let {page} = req.query;

            const access = await db(`users`).select(category).where({email: email});
            if (!access){
                throw ApiError.ForbiddenError();
            }

            const maxTasks = 8;
            let max = maxTasks*page;
            const allTasks = await db(`tasks`).select(TasksModel).where({type: category}).orderBy('id',"desc")
                .then(result => {
                    if (result.length)return result
                    else return null
                })
                .catch(error => {  throw ApiError.NotImplementedError(error) });
            if (!allTasks) throw ApiError.NotFoundError();

            const finished = (max >= allTasks.length);

            let tasks = [];

            if (finished)max = allTasks.length + maxTasks - max;
            else max /= page;
            for (let i = 0 ; i<max ; i++)tasks[i] = allTasks[(page-1)*maxTasks+i];

            const next = finished ? null : (++page);

            return res.json({tasks, next});


        } catch (error) {
            next(error);
        }
    }

    async getTask(req, res, next) {
        try {
            const {id} = req.query;
            if (!id)throw ApiError.ForbiddenError();//TODO сделать проверку на число

            const [Task] = await db(`tasks`).select(TasksModel).where({ id: id})
                .then(result => {
                    if (result.length)return result
                    else return null
                })
                .catch(error => {  throw ApiError.NotImplementedError(error) });
            if (!Task) throw ApiError.NotFoundError();
            return res.json(Task);


        } catch (error) {
            next(error);
        }
    }

    async deleteTask(req, res, next) {
        try {
            await db('tasks')
                .where('id', req.body.id)
                .del()
                .then(_ => { res.status(200).send({ message: "Удаление прошло успешно" }) })
                .catch(error => { throw ApiError.NotImplementedError(error) })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TasksController()