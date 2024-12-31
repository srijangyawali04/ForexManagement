import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'; // bcryptjs for password hashing and comparison
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../initializers/data-source'; // AppDataSource initialization
import { User } from '../models/User'; // Importing the User model
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key'; // Make sure SECRET_KEY is in .env

/**
 * Login controller to authenticate a staff member.
 *
 * @param req - Express request object
 * @param res - Express response object
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { staff_code, password } = req.body;

  // Validate input
  if (!staff_code || !password) {
    return res.status(400).json({ message: 'Staff code and password are required.' });
  }

  try {
    // Initialize the repository for User model
    const userRepo = AppDataSource.getRepository(User);

    // Find user by staff_code using findOne
    const user = await userRepo.findOne({
      where: { staff_code }, // Searching for the user with the given staff_code
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare passwords using bcryptjs
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token with user data
    const token = jwt.sign(
      { id: user.staff_code, staff_code: user.staff_code, role: user.role }, // We use staff_code here, assuming it's unique
      SECRET_KEY,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send response with the JWT token
    return res.status(200).json({
      message: 'Login successful.',
      token,
      role: user.role,  // Sending role back with token
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Hash the password before saving the user.
 * This function should be called when creating or updating a user.
 *
 * @param password - The plain text password
 * @returns The hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Number of salt rounds for bcrypt
  return await bcrypt.hash(password, saltRounds);
};
