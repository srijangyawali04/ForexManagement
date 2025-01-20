import express from "express";
import { createVoucher , getVoucherList, updateVoucherStatus , getVoucherByNumber , getTotalVouchers} from "../controllers/voucherController";

const router = express.Router();

//Route to get total vouchers
router.get('/total', getTotalVouchers);

//Create voucher
router.post("/", createVoucher);

// Route to get a list of all vouchers
router.get("/", getVoucherList);

// Route to verify a voucher by voucher_number
router.patch("/:voucher_number/update-status", updateVoucherStatus);

// Route to get voucherbynumber
router.get("/:voucher_number", getVoucherByNumber);




export default router;