import { UserService } from '../services/user.service.js';
import { apiResponse } from '../utils/api-response.js';

class UserController {
    static async registerUser(req, res, next) {
        try {
            const { name, password, email } = req.body;

            if (!name || !password || !email) {
                throw new Error('All fields are required');
            }

            const newUser = await UserService.createUser({ name, password, email });
            return apiResponse.created(res, 'User registered successfully', { user: newUser });
        }
        catch (error) {
            next(error);
        }
    }

    static async loginUser(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            const user = await UserService.authenticateUser({ email, password });
            if (!user || !user.id) {
                return apiResponse.unauthorized(res, 'Invalid email or password');
            }

            const options = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            }

            res.cookie('refresh_token', user.refresh_token, options);
            res.cookie('access_token', user.access_token, options);

            return apiResponse.success(res, 'Login successful', { user: { id: user.id, email: user.email } });

        } catch (error) {
            next(error);
        }
    }

    static async refresh(req, res, next) {
        try {
            const refreshToken = req.cookies['refresh_token'];

            if (!refreshToken) {
                throw new Error('Session expired, please log in again');
            }

            const { access_token, refresh_token } = await UserService.refreshAccessToken({ refreshToken });

            const options = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            }

            res.cookie('access_token', access_token, options);
            res.cookie('refresh_token', refresh_token, options);

            return apiResponse.success(res, 'Access token refreshed successfully');

        } catch (error) {
            next(error);
        }
    }
}

export { UserController };