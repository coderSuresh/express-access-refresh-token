class AppError extends Error {
    constructor(message, statusCode = 500, data = {}) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Validation Error', data = {}) {
        super(message, 400, data);
    }
}

class AuthError extends AppError {
    constructor(message = 'Unauthorized', data = {}) {
        super(message, 401, data);
    }
}

export { AppError, ValidationError, AuthError };
