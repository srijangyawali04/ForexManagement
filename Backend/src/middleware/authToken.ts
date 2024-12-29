import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Middleware to authenticate JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Attach the decoded token data (user details) to req.user for further use
    (req as any).user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
