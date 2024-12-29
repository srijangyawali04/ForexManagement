import express from "express";
import { createUser, getSingleUser} from "../controllers/userController";
import { authenticateToken } from "../middleware/authToken"; 
import { verifyRole } from "../middleware/verifyRole";

const router = express.Router();

router.get("/:userid", getSingleUser);
// Create user route - Only accessible by Admins
router.post("/", authenticateToken, verifyRole("Admin"), createUser);

export default router;