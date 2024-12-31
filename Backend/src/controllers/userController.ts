import { User } from "../models/User";
import { Request, Response } from "express";

import { AppDataSource } from "../initializers/data-source";

const userRepo = AppDataSource.getRepository(User);

//Add User Information
export const createUser = async (req: Request, res: Response) => {
  const { staff_code, password, staff_name, designation,role,email,mobile_number,user_status,remarks } = req.body;

  try {
    const voucher = userRepo.create({
      staff_code,
      password,
      staff_name, 
      designation,
      role,
      email,
      mobile_number,
      user_status,
      remarks
    });

    await userRepo.save(voucher);

    return res.status(200).json({
      message: "user created successfully.",
      data: voucher,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}


// Get a user by staff_code
export const getSingleUser = async (req: Request, res: Response) => {
    const userId = req.params.user_id as string;
    try {
      const user = await userRepo.findOne({ where: { staff_code: userId } })
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
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
