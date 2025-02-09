import { Router } from 'express';
import { login } from '../controllers/authController';  

const router = Router();

// login route
router.post('/login', login);

export default router;
