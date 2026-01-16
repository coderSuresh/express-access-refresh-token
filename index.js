import 'dotenv/config';
import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import helmet, { contentSecurityPolicy } from 'helmet';
import cors from 'cors';

import requireLogin from './src/middlewares/require-login.js';

import userRoute from './src/routes/user.route.js';
import protectedRoute from './src/routes/protected.route.js'

const PORT = process.env.PORT || 4000;

const app = express();

app.use(helmet(
    {
        contentSecurityPolicy: {
            directives: {
                ...contentSecurityPolicy.getDefaultDirectives(),
                "img-src": ["'self'", "data:", "https:"],
            },
        }
    }
));

app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
));

app.use(json());
app.use(cookieParser());

app.use('/api/v1/users', userRoute);

app.use('/api/v1/protected', requireLogin, protectedRoute);

// Error handling middleware (should be last)
import { errorMiddleware } from './src/middlewares/error.middleware.js';
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});