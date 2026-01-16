import pool from '../config/db.config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserService {

    static async refreshAccessToken({ refreshToken }) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
            const userId = decoded.id;

            const dbResponse = await pool.query(
                'SELECT refresh_token FROM users WHERE id = $1',
                [userId]
            );

            if (dbResponse.rows.length === 0 || dbResponse.rows[0].refresh_token !== refreshToken) {
                throw new AuthError('Invalid refresh token');
            }

            const access_token = jwt.sign(
                { id: userId },
                process.env.ACCESS_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
            );

            const refresh_token = jwt.sign(
                { id: userId },
                process.env.REFRESH_SECRET,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
            );

            return { access_token, refresh_token };

        } catch (error) {
            throw new AuthError('Invalid or expired refresh token');
        }
    }

    static async createUser({ name, password, email }) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email';
        const user = await pool.query(query, [name, email, hashedPassword]);

        return user.rows[0];
    }

    static async createUser({ name, password, email }) {
        if (!name || !password || !email) {
            throw new ValidationError('All fields are required');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email';
            const user = await pool.query(query, [name, email, hashedPassword]);
            return user.rows[0];
        } catch (err) {
            if (err.code === '23505') { // unique_violation for postgres
                throw new ValidationError('Email already exists');
            }
            throw new AppError('Database error', 500, { detail: err.message });
        }
    }

    static async authenticateUser({ email, password }) {

        const user = await pool.query('SELECT id, password FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            throw new AuthError('Invalid email or password');
        }

        const passwordMatch = await bcrypt.compare(password, user.rows[0].password);

        if (!passwordMatch) {
            throw new AuthError('Invalid email or password');
        }

        const id = user.rows[0].id;

        const access_token = jwt.sign(
            { id },
            process.env.ACCESS_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
        );

        const refresh_token = jwt.sign(
            { id },
            process.env.REFRESH_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
        );

        await pool.query(
            'UPDATE users SET refresh_token = $1 WHERE id = $2',
            [refresh_token, id]
        );

        return {
            id, email,
            access_token,
            refresh_token
        };
    };
}
