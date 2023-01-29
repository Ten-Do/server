const crypto = require('crypto');
require("dotenv").config({ path: __dirname + '/../.env' });

class CipherService{
    constructor(){
        this.algorithm = 'aes256';
        this.key = process.env.AES256_KEY;
    }

    encrypt(string) {
        const iv = crypto.randomBytes(8).toString("hex");
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

        let encrypted = cipher.update(string,'utf8', "hex");
        encrypted += cipher.final("hex");

        return `${encrypted}:${iv}`;
    }

    decrypt(string) {
        const [encryptedString, iv] = string.split(':');
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);

        let decrypted = decipher.createDecipheriv(encryptedString, "hex" , 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}

module.exports = new CipherService();