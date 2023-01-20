module.exports = class UserDTO {
    email;
    role;
    activated;
    constructor(user) {
        this.email = user.email;
        this.role = user.role;
        this.activated = user.activated;
    }
}