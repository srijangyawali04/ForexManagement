import express from "express";
import { createUser, getUserByStaffCode , getAllUsers , updateUserStatus, passwordReset} from "../controllers/userController";
import { verifyRole } from "../middleware/verifyRole";

const router = express.Router();

// Route to get all users
router.get("/allusers", getAllUsers);

// Route to get a single user by user ID
router.get("/:staffCode", getUserByStaffCode);  


// Create user route - Only accessible by Admins
router.post("/add-user", verifyRole("Admin"), createUser);

// Change status of user Enabled/Disabled
router.patch('/update-status', updateUserStatus);

//Change user-password
router.post('/reset-password', passwordReset)

export default router;