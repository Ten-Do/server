const uuid = require('uuid')
const path = require('path')

module.exports = class Storage {
    static async addStudentCard(img) {
        const imgName = uuid.v4() + path.extname(img.name);
        const filePath = __dirname + '/../../server/storage/students/' + imgName;
        img.mv(filePath);
        return imgName;
    }

    static async addMaterial(file) {
        const fileName = uuid.v4() + path.extname(file.name);
        const filePath = __dirname + '/../../server/storage/materials/' + fileName;
        file.mv(filePath);
        return fileName;
    }

    getTask() {
        console.log("1233212321")
    }
}


