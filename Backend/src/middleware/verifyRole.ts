import { Request, Response, NextFunction } from "express";

// Middleware to check if the user has the required role
export const verifyRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Get the role from the request body, headers, or any other source you prefer
    const role = req.headers["role"] || req.body.role; // Example of using role from headers or body

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    // Check if the user's role matches the required role
    if (role !== requiredRole) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next(); // User has the correct role, proceed to the next middleware or route handler
  };
};

export default verifyRole;
