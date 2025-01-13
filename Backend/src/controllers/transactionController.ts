import { Transactions } from "../models/Transaction";
import { Voucher } from "../models/Voucher";
import { Request, Response } from "express";
import { AppDataSource } from "../initializers/data-source";

const transactionRepo = AppDataSource.getRepository(Transactions);
const voucherRepo = AppDataSource.getRepository(Voucher);


// Get all transactions for a specific voucher number
export const getTransactionsByVoucherNumber = async (req: Request, res: Response) => {
  const voucher_number = parseInt(req.params.voucher_number);  // Convert to number

  if (isNaN(voucher_number)) {
    return res.status(400).json({ message: "Invalid voucher number." });
  }

  try {
    // Find the voucher and its related transactions
    const voucher = await voucherRepo.findOne({
      where: { voucher_number }, // Now voucher_number is a number
      relations: ["transactions"], // Include related transactions
    });

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found." });
    }

    return res.status(200).json({ data: voucher.transactions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching transactions." });
  }
};

