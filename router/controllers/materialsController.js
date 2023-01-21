const db = require('../../db/db');
const uuid = require('uuid');
const path = require('path');

// TODO у тебя пока что файлы не сохраняются. надо чтоб сохранялись ;)
// про удаление файлов тож не забудь.. в общем CRUD братанчик

/**
 * POST: body = {type, title, [description, file]} => status + message 
 * DELETE: body = {id} => status + message
 * GET (all): => json
 * GET (one): query = {id} => json
 * PUT: body {id, type, title, [description, file]} => status + message
 */

class MaterialsController {
    async addMaterial(req, res, next) {
        try {
            const { type, title, description = '' } = req.body;
            const file = req.files?.additionalDataFile;
            const materialObj = { type, title, description };

            if (file) {
                const fileName = uuid.v4() + path.extname(file.name);
                const pathToFile = __dirname + '/../../storage/' + fileName;
                materialObj.additional_data_file = fileName;
            }

            await db('materials').insert(materialObj)
                .then(_ => { res.status(201).send({ message: "Добавление прошло успешно" }) })
                .catch(error => { res.status(501).send({ message: "База данных отклонила добавление" }); next(error) })
        } catch (error) {
            res.status(500).send({ message: "Произошла неожиданная ошибка. Пожалуйста попробуйте позже" });
            next(error);
        }
    }

    async updateMaterial(req, res, next) {
        try {
            const { id, type, title, description = '' } = req.body;
            const file = req.files?.additionalDataFile;
            const materialObj = { id, type, title, description };

            if (file) {
                const fileName = uuid.v4() + path.extname(file.name);
                const pathToFile = __dirname + '/../../storage/' + fileName;
                materialObj.additional_data_file = fileName;
            }

            await db('materials').where('id', id).update(materialObj)
                .then(_ => { res.status(201).send({ message: "Обновление прошло успешно" }) })
                .catch(error => { res.status(501).send({ message: "База данных отклонила обновление" }); next(error) })
        } catch (error) {
            res.status(500).send({ message: "Произошла неожиданная ошибка. Пожалуйста попробуйте позже" });
            next(error);
        }
    }

    async getAllMaterials(_, res, next) {
        try {
            await db('materials')
                .select('*')
                .then(result => { res.status(200).send(result) })
                .catch(error => { res.status(501).send({ message: "База данных отклонила получение" }); next(error) })
        } catch (error) {
            res.status(500).send({ message: "Произошла неожиданная ошибка. Пожалуйста попробуйте позже" });
            next(error);
        }
    }

    async getOneMaterial(req, res, next) {
        try {
            await db('materials')
                .select('*')
                .where('id', req.params.id)
                .then(result => { res.status(200).send(result) })
                .catch(error => { res.status(501).send({ message: "База данных отклонила получение" }); next(error) })
        } catch (error) {
            res.status(500).send({ message: "Произошла неожиданная ошибка. Пожалуйста попробуйте позже" });
            next(error);
        }
    }

    async deleteMaterial(req, res, next) {
        try {
            await db('materials')
                .where('id', req.body.id)
                .del()
                .then(_ => { res.status(200).send({ message: "Удаление прошло успешно" }) })
                .catch(error => { res.status(501).send({ message: "База данных отклонила удаление" }); next(error) })
        } catch (error) {
            res.status(500).send({ message: "Произошла неожиданная ошибка. Пожалуйста попробуйте позже" });
            next(error);
        }
    }
}

module.exports = new MaterialsController()