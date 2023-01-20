module.exports = class TokenDTO {
    email;
    activated;
    constructor(model) {
        this.email = model.email;
        this.activated = model.activated;
    }
}