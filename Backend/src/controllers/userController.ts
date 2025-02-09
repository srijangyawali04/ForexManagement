import { User } from "../models/User";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import { AppDataSource } from "../initializers/data-source";

const userRepo = AppDataSource.getRepository(User);

const isPasswordStrong = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export const createUser = async (req: Request, res: Response) => {
  const { staff_code, password, staff_name, designation, role, email, mobile_number, user_status, remarks } = req.body;

  try {
    const existingUser = await userRepo.findOne({ where: { staff_code } });

    if (existingUser) {
      return res.status(400).json({
        message: `User with staff code ${staff_code} already exists.`,
      });
    }

    if (!isPasswordStrong(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepo.create({
      staff_code,
      password: hashedPassword,
      staff_name,
      designation,
      role,
      email,
      mobile_number,
      user_status,
      remarks,
    });

    await userRepo.save(user);
    delete user.password;
    return res.status(200).json({
      message: "User created successfully.",
      data: user,
    });
  } catch (err) {
    console.error("ERROR: Server error occurred during user creation.", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getUserByStaffCode = async (req: Request, res: Response): Promise<Response> => {
  const { staffCode } = req.params;

  try {
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { staff_code: staffCode },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { password, ...userData } = user;
    return res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepo.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  const { staff_code, user_status, remark } = req.body;

  try {
    const user = await userRepo.findOne({ where: { staff_code } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.user_status = user_status;
    user.remarks = remark;

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

export const passwordReset = async (req: Request, res: Response) => {
  const { staff_code, password } = req.body;

  try {
    const user = await userRepo.findOne({ where: { staff_code } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!isPasswordStrong(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

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
