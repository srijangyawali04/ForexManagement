import { Router } from 'express';
import { login } from '../controllers/authController';  // Import the login controller

const router = Router();

// Define the login route
router.post('/login', login);

export default router;
