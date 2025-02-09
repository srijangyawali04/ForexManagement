import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
import { AppDataSource } from '../initializers/data-source'; 
import { User } from '../models/User'; 
import dotenv from 'dotenv'; 

dotenv.config(); 

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key'; 

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { staff_code, password } = req.body;

  if (!staff_code || !password) {
    return res.status(400).json({ message: 'Staff code and password are required.' });
  }

  try {
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { staff_code }, 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { 
        staff_code: user.staff_code, 
        role: user.role, 
        staffName: user.staff_name,
        designation: user.designation,
        status: user.user_status,
      },
      SECRET_KEY,
      { expiresIn: '1h' } 
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      role: user.role,
      staffCode: user.staff_code,
      staffName: user.staff_name,
      designation: user.designation,
      status : user.user_status,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};
