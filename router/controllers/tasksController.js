const db = require('../../db/db');
const TasksModel = require("../../db/models/tasks");
const ApiError = require("../../exceptions/api-error");
const Storage = require("../../services/storageService");
const cipherService = require("../../services/cipherService");
const bcrypt = require("bcrypt");

/**
 * POST: body = {category, difficulty, points, title, description, answer, solution} => status + message
 * DELETE: body = {id} => status + message
 * GET (all): query = {category, page} => json({tasks, nextPage})
 * GET (one): query = {id} => json({task})
 * PUT: body = {id, category, difficulty, points, title, description, answer, solution} => status + message
 *
 * POST (check flag): params = {id}, body = {flag} => status + message
 * GET (install task): query = {id} => file
 * GET (answer task): query = {id} => json({solution})
 */




class TasksController {
  async addTask(req, res, next) {
    try {
      const { category, difficulty, points, title, description, answer, solution } = req.body;
      const task = req.files?.task;
      const taskObj = { category, difficulty, points, title, description, answer };
      taskObj.task_file = await Storage.addTask(task);
      taskObj.answer = await bcrypt.hash(answer, 7);
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
      const { id, category, difficulty, points, title, description, answer, solution } = req.body;
      const task = req.files?.task;
      const taskObj = { category, difficulty, points, title, description };

      const path = await db(`tasks`).select('task_file').where({ id: id });
      taskObj.task_file = await Storage.upStorage('./storage/tasks/', path.task_file, task);
      taskObj.answer = await bcrypt.hash(answer, 7);

      taskObj.solution = cipherService.encrypt(solution);

      await db('tasks').where('id', id).update(taskObj)
        .then(_ => { res.status(201).send({ message: "Обновление прошло успешно" }) })
        .catch(error => { throw ApiError.NotImplementedError(error) })

    } catch (error) {
      next(error);
    }
  }

  // get: .../api/materials?cat=cat1,cat2,cat3...
  // example: .../api/materials?cat=ppc,web,network
  async getTasks(req, res, next) {
    try {
      const category = req.query.cat.split(',');
      let { page = 1 } = req.query;
      const maxTasks = 20;

      let max = maxTasks * page;
      const allTasks = await db(`tasks`).select(TasksModel).whereIn('category', category).orderBy('id', "desc")
        .then(result => {
          if (result.length) return result
          else return null
        })
        .catch(error => { throw ApiError.NotImplementedError(error) });
      if (!allTasks) throw ApiError.NotFoundError();

      const finished = (max >= allTasks.length);

      let tasks = [];

      if (finished) max = allTasks.length + maxTasks - max;
      else max /= page;
      for (let i = 0; i < max; i++)tasks[i] = allTasks[(page - 1) * maxTasks + i];

      const next = finished ? null : (++page);

      return res.send(tasks);


    } catch (error) {
      next(error);
    }
  }

  async getTask(req, res, next) {
    try {
      const { id } = req.query;
      if (typeof (+id) !== 'number') throw ApiError.ForbiddenError();//TODO сделать проверку на число

      const [Task] = await db(`tasks`).select(TasksModel).where({ id: id })
        .then(result => {
          if (result.length) return result
          else return null
        })
        .catch(error => { throw ApiError.NotImplementedError(error) });
      if (!Task) throw ApiError.NotFoundError();
      return res.json(Task);


    } catch (error) {
      next(error);
    }
  }




  /*
      async installTask(req, res, next) {
          try {
              const task = req.task;
              res.download('./storage/tasks/' + task.task_file)
              return res.status(200);
  
          } catch (error) {
              next(error);
          }
      }
  */
  async checkFlag(req, res, next) {
    try {
      const task = req.task;

      const { answer } = req.body;
      const user_task = { user_id: req.user.id, task_id: task.id };
      const [exist] = await db(`users_tasks`).select('is_solved').where(user_task);
      if (exist) {
        if (exist.is_solved) throw ApiError.BadRequest('Задание уже решено!');
        else throw ApiError.BadRequest('Задание нельзя решить!');
      }
      if (!answer) {
        throw ApiError.BadRequest('Поле решения пустое!');
      }
      if (!(await bcrypt.compare(answer, task.answer))) {
        throw ApiError.BadRequest('Неверный ответ!');
      }

      await db(`users_tasks`).insert({ ...user_task, is_solved: true })
        .catch(error => { throw ApiError.NotImplementedError(error) });
      const categoryScore = task.category + "_score";

      await db(`scores`).increment(categoryScore, task.points)
        .catch(error => { throw ApiError.NotImplementedError(error) });


      return res.status(200).send({ message: "Поздравляем, вы успешно нашли флаг!" });
    } catch (error) {
      next(error);
    }
  }

  async getAnswer(req, res, next) {
    try {
      const task = req.task;

      const user_task = { user_id: req.user.id, task_id: task.id };
      const [exist] = await db(`users_tasks`).select('is_solved').where(user_task);
      if (!exist) {
        await db(`users_tasks`).insert({ ...user_task, is_solved: false })
          .catch(error => { throw ApiError.NotImplementedError(error) });
      }
      const solution = cipherService.decrypt(task.solution);

      return res.json({ solution });
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