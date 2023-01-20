const uuid = require('uuid')
const path = require('path')

class AddStorage{
    student(img){
        const imgName = uuid.v4() + path.extname(img.name);
        const filePath = path.resolve('../server/storage/students',imgName);
        img.mv(filePath);
        return imgName;
    }


    task(){


    }
}


module.exports = new AddStorage();