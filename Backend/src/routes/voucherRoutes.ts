import express from "express";
import { createVoucher } from "../controllers/voucherController";

const router = express.Router();

router.post("/", createVoucher);

export default router;