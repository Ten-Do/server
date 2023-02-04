const db = require('../../db/db');
const StorageService = require('../../services/storageService');
const ApiError = require("../../exceptions/api-error");
/**
 * POST: body = {type, title, [description, file]} => status + message
 * DELETE: body = {id} => status + message
 * GET (all): => json
 * GET (one): params = {id} => json
 * PUT: body = {id, type, title, [description, file]} => status + message
 */

class MaterialsController {
    async addMaterial(req, res, next) {
        try {
            const { category, title, description = '' } = req.body;
            const file = req.files?.additionalDataFile;
            const materialObj = { category, title, description };

            if (file) {
                materialObj.additional_data_file = await StorageService(file);
            }

            await db('materials').insert(materialObj)
                .then(_ => { res.status(201).send({ message: "Добавление прошло успешно" }) })
                .catch(error => { res.status(501).send({ message: "База данных отклонила добавление" }); next(error) })
        } catch (error) {
            next(error);
        }
    }

    async updateMaterial(req, res, next) {
        try {
            const { id, category, title, description = '' } = req.body;
            const file = req.files?.additionalDataFile;
            const materialObj = { id, category, title, description };

            if (file) {
                materialObj.additional_data_file = await StorageService(file);
            }

            await db('materials').where('id', id).update(materialObj)
                .then(_ => { res.status(201).send({ message: "Обновление прошло успешно" }) })
                .catch(error => { res.status(501).send({ message: "База данных отклонила обновление" }); next(error) })
        } catch (error) {
            next(error);
        }
    }

    // get: .../api/materials?cat=cat1,cat2,cat3...
    // example: .../api/materials?cat=ppc,web,network
    async getAllMaterials(req, res, next) {
        try {
            const cat = req.query.cat.split(',');
            await db('materials')
                .select('*')
                .whereIn('category', cat)
                .then(result => {
                    if (result.length) {
                        return res.status(200).send(result)
                    } else {
                        throw ApiError.NotFoundError({ message: "Материалов нет" })
                    }
                })
                .catch(error => { throw ApiError.NotImplementedError(error) })
        } catch (error) {
            next(error);
        }
    }

    // походу юзлесс функция ойай..
    async getOneMaterial(req, res, next) {
        try {
            await db('materials')
                .select('*')
                .where('id', req.params.id)
                .then(result => {
                    if (result.length) {
                        return res.status(200).send(result)
                    } else {
                        throw ApiError.NotFoundError({ message: "Запрошенных материалов не найдено" });
                    }
                })
                .catch(error => { throw ApiError.NotImplementedError(error) })
        } catch (error) {
            next(error);
        }
    }

    async deleteMaterial(req, res, next) {
        try {
            await db('materials')
                .where('id', req.body.id)
                .del()
                .then(_ => { res.status(200).send({ message: "Удаление прошло успешно" }) })
                .catch(error => { throw ApiError.NotImplementedError(error) })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MaterialsController()
