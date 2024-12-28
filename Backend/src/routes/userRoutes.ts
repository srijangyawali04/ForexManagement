import express from "express";
import { createUser, getSingleUser} from "../controllers/userController";

const router = express.Router();

router.get("/:userid", getSingleUser);
router.post("/", createUser);

export default router;