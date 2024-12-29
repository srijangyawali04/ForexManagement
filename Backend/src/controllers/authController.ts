import * as argon2 from "argon2";
import { Request, Response } from "express";
import { AppDataSource } from "../initializers/data-source";
import { User } from "../models/User";
import { generateToken } from "../utils/authUtils";

const userRepo = AppDataSource.getRepository(User);

// Login verify using staff_code
export const login = async (req: Request, res: Response) => {
  const { staff_code, password } = req.body;
  try {
    // Check if user exists by staff_code
    const user = await userRepo.findOne({ where: { staff_code: staff_code } });
    if (!user) {
      return res.status(400).json({ message: "This staff code doesn't exist." });
    }

    // Check password
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token using the generateToken function from authUtils
    const token = generateToken(user.staff_code, user.role, user.staff_name);

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
