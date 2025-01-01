import express from "express";
import { createUser, getSingleUser , getAllUsers , updateUserStatus} from "../controllers/userController";
import { verifyRole } from "../middleware/verifyRole";

const router = express.Router();

// Route to get all users
router.get("/allusers", getAllUsers);

// Route to get a single user by user ID
router.get("/users/:userid", getSingleUser);

// Create user route - Only accessible by Admins
router.post("/add-user", verifyRole("Admin"), createUser);

// Change status of user Enabled/Disabled
router.patch('/update-status', updateUserStatus);

export default router;