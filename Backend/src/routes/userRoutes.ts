import express from "express";
import { createUser, getSingleUser , getAllUsers} from "../controllers/userController";
import { authenticateToken } from "../middleware/authToken"; 
import { verifyRole } from "../middleware/verifyRole";

const router = express.Router();

// Route to get all users
router.get("/allusers", getAllUsers);

// Route to get a single user by user ID
router.get("/users/:userid", getSingleUser);

// Create user route - Only accessible by Admins
router.post("/add-user", authenticateToken, verifyRole("Admin"), createUser);

export default router;