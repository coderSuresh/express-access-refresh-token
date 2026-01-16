import express from 'express';
import { getData } from '../controllers/protected.controller.js';

const router = express.Router();

router.get('/', getData);

export default router;