import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Interface for the decoded token
interface DecodedToken {
  staff_code: string;
  role: string;
  staff_name: string;
  exp: number;
  iat: number;
}

export const verifyRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Get token from Authorization header

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

      // Check if the user's role matches the required role
      if (decoded.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Attach the user data to the request object for further use
      (req as any).user = decoded;

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

export default verifyRole;
