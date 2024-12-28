import { Transactions } from "../models/Transaction";
import { Voucher } from "../models/Voucher";
import { Request, Response } from "express";
import { AppDataSource } from "../initializers/data-source";

const transactionRepo = AppDataSource.getRepository(Transactions);
const voucherRepo = AppDataSource.getRepository(Voucher);

// Add Transaction Information
export const createTransaction = async (req: Request, res: Response) => {
  const {
    voucher_number,
    currency_name,
    currency_iso_code,
    currency_code,
    exchange_rate,
    fc_amount,
    commission,
    total_NPR,
    created_by,
    verified_by,
  } = req.body;

  try {
    const voucher = await voucherRepo.findOne({ where: { voucher_number } });

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found." });
    }

    // Create the transaction
    const transaction = transactionRepo.create({
      voucher, 
      currency_name,
      currency_iso_code,
      currency_code,
      exchange_rate,
      fc_amount,
      commission,
      total_NPR,
      created_by,
      verified_by,
    });

    await transactionRepo.save(transaction);

    return res.status(200).json({
      message: "Transaction created successfully.",
      data: transaction,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server error",
      error: err.message || "An unexpected error occurred.",
    });
  }
};
