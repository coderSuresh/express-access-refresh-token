import express from 'express';
import { UserController } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('User route is working');
});

const { registerUser, loginUser, refresh } = UserController

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refresh);

export default router;