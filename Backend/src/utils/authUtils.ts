import jwt from "jsonwebtoken";

// Function to generate JWT token
export const generateToken = (staff_code: string, role: string, staff_name: string): string => {
  return jwt.sign(
    { staff_code, role, staff_name },
    process.env.JWT_SECRET as string,
    { expiresIn: "30m" } // Token expires in 30 minutes
  );
};

// Function to verify JWT token
export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};
