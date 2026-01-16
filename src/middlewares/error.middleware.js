import { apiResponse } from '../utils/api-response.js';
import { AppError } from '../utils/custom-errors.js';

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof AppError) {
        return apiResponse.error(res, err.message, err.statusCode, err.data);
    }
    // Hide stack trace in production
    const isProd = process.env.NODE_ENV === 'production';
    return apiResponse.error(
        res,
        isProd ? 'Internal Server Error' : err.message,
        500,
        isProd ? {} : { stack: err.stack }
    );
};

export { errorMiddleware };
