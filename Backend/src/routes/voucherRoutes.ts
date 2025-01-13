import express from "express";
import { createVoucher , getVoucherList, verifyVoucher } from "../controllers/voucherController";

const router = express.Router();

router.post("/", createVoucher);

// Route to get a list of all vouchers
router.get("/", getVoucherList);

// Route to verify a voucher by voucher_number
router.patch("/:voucher_number/update-status", verifyVoucher);

export default router;