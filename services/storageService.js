const uuid = require('uuid')
const path = require('path')
const { readFile } = require('fs').promises
const ApiError = require("../exceptions/api-error");

/**
 * метод статичный => используем без создания объекта.
 * медоты асинхронные => принимаем во внимание.
 * параметром каждый метод принимает сам файл и ничего более.
 * кинет в хранилище он сам.
 * вернет имя файла.
 */
module.exports = class Storage {
    static async addStudentCard(img) {
        const fileName = uuid.v4() + path.extname(img.name);
        const filePath = __dirname + "/../storage/students/" + fileName;
        img.mv(filePath);
        return fileName;
    }

    static async addMaterial(file) {
        const fileName = uuid.v4() + path.extname(file.name);
        const filePath = __dirname + '/../storage/materials/' + fileName;
        file.mv(filePath);
        return fileName;
    }

    static async addTask(file) {
        const fileName = uuid.v4() + path.extname(file.name);
        const filePath = __dirname + '/../storage/tasks/' + fileName;
        file.mv(filePath);
        return fileName;
    }

    static async getFile(fileName) {
        try {
            const file = await readFile(path)
            return file
        }
        catch (err) {
            throw ApiError.NotImplementedError()
        }
    }
}


