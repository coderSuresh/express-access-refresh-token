const CREATED = 201;
const INTERNAL_SERVER_ERROR = 500;
const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;

const apiResponse = {
    success: (res, message, data = {}) => {
        return res.status(OK).json({ message, ...data });
    },
    created: (res, message, data = {}) => {
        return res.status(CREATED).json({ message, ...data });
    },
    error: (res, message, statusCode = INTERNAL_SERVER_ERROR, data = {}) => {
        return res.status(statusCode).json({ message, ...data });
    },
    unauthorized: (res, message = 'Unauthorized', data = {}) => {
        return res.status(UNAUTHORIZED).json({ message, ...data });
    },
    badRequest: (res, message = 'Bad Request', data = {}) => {
        return res.status(BAD_REQUEST).json({ message, ...data });
    }

};

export { apiResponse };