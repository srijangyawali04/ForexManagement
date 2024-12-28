import express from "express";
import { getSingleUser} from "../controllers/userController";

const router = express.Router();

router.get("/:userid", getSingleUser);

export default router;