const uuid = require('uuid')
const path = require('path')
const { readFile } = require('fs').promises
const ApiError = require("../exceptions/api-error");


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


