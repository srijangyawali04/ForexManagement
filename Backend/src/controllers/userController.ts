import { User } from "../models/User";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import { AppDataSource } from "../initializers/data-source";

const userRepo = AppDataSource.getRepository(User);

// Password validation function
const isPasswordStrong = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// Add User Information
export const createUser = async (req: Request, res: Response) => {
  const { staff_code, password, staff_name, designation, role, email, mobile_number, user_status, remarks } = req.body;

  try {
    // Check if a user with the same staff_code already exists
    const existingUser = await userRepo.findOne({ where: { staff_code } });

    if (existingUser) {
      return res.status(400).json({
        message: `User with staff code ${staff_code} already exists.`,
      });
    }

    // Validate the password strength
    if (!isPasswordStrong(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.',
      });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object with the hashed password
    const user = userRepo.create({
      staff_code,
      password: hashedPassword, // Use hashed password here
      staff_name,
      designation,
      role,
      email,
      mobile_number,
      user_status,
      remarks,
    });

    // Save the user to the database
    await userRepo.save(user);
    delete user.password;
    return res.status(200).json({
      message: "User created successfully.",
      data: user,
    });
  } catch (err) {
    console.error("ERROR: Server error occurred during user creation.", err);
    return res.status(500).json({ message: "Server Error" }); /// new
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


// Update user status
export const updateUserStatus = async (req: Request, res: Response) => {
  const { staff_code, user_status, remark } = req.body; // Include remark in request body

  try {
    const user = await userRepo.findOne({ where: { staff_code } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user status and remark (if provided)
    user.user_status = user_status;
    user.remarks = remark; // Assuming 'remarks' is a field in your User entity

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


// Reset Password 
export const passwordReset = async (req: Request, res: Response) => {
  const { staff_code, password } = req.body;

  try {
    // Find the user by staff_code
    const user = await userRepo.findOne({ where: { staff_code } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate the new password strength
    if (!isPasswordStrong(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.',
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;

    // Save the updated user record to the database
    await userRepo.save(user);

    return res.status(200).json({
      message: 'Password reset successfully.',
      data: user,
    });
  } catch (err) {
    console.error("ERROR: Server error occurred during password reset.", err);
    return res.status(500).json({ message: "Server error" });
  }
};