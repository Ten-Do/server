

module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован!')
    }

    static ForbiddenError() {
        return new ApiError(403, 'У пользователь нет прав доступа!')
    }

    static NotFoundError(message = 'Материал не найден!') {
        return new ApiError(404, message)
    }

    static NotImplementedError(errors = []) {
        return new ApiError(501, 'База данных отклонила запрос!', errors)
    }

}