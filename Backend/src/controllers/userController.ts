import { User } from "../models/User";
import { Request, Response } from "express";

import { AppDataSource } from "../initializers/data-source";

const userRepo = AppDataSource.getRepository(User);


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