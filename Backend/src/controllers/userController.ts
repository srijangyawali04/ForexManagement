import { User } from "../models/User";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import { AppDataSource } from "../initializers/data-source";

const userRepo = AppDataSource.getRepository(User);

//Add User Information
export const createUser = async (req: Request, res: Response) => {
  const { staff_code, password, staff_name, designation, role, email, mobile_number, user_status, remarks } = req.body;

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds for bcrypt

    // Create a new user object with the hashed password
    const voucher = userRepo.create({
      staff_code,
      password: hashedPassword, // Use hashed password here
      staff_name, 
      designation,
      role,
      email,
      mobile_number,
      user_status,
      remarks
    });

    // Save the user to the database
    await userRepo.save(voucher);

    return res.status(200).json({
      message: "User created successfully.",
      data: voucher,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


// Get a user by staff_code
export const getUserByStaffCode = async (req: Request, res: Response): Promise<Response> => {
  const { staffCode } = req.params; // Extracting staffCode from the URL parameters

  try {
    // Initialize the user repository
    const userRepo = AppDataSource.getRepository(User);

    // Find the user by staff_code
    const user = await userRepo.findOne({
      where: { staff_code: staffCode },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // If the user is found, send back the user data (excluding the password)
    const { password, ...userData } = user; // Exclude the password from the response
    return res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Use the repository's find method to get all users
    const users = await userRepo.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};


//Update user status
export const updateUserStatus = async (req: Request, res: Response) => {
  const { staff_code, user_status } = req.body; 

  try {
    const user = await userRepo.findOne({ where: { staff_code } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.user_status = user_status;

    await userRepo.save(user);

    return res.status(200).json({
      message: 'User status updated successfully',
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update user status', error: error.message });
  }
};