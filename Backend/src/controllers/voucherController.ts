import { Voucher } from "../models/Voucher";
import { Transactions } from "../models/Transaction";
import { Request, Response } from "express";
import { AppDataSource } from "../initializers/data-source";

const voucherRepo = AppDataSource.getRepository(Voucher);
const transactionRepo = AppDataSource.getRepository(Transactions);

// Utility function to validate required fields
const validateRequiredFields = (fields: Record<string, any>): string | null => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      return key; // Return the missing field
    }
  }
  return null; // No missing fields
};

// Add Voucher Information with Transactions
export const createVoucher = async (req: Request, res: Response) => {
  try {
    const {
      customer_name,
      customer_address,
      mobile_number,
      itrs_code,
      travel_order_ref_number = null, // Default to null if not provided
      voucher_cancellation = null, // Default to null if not provided
      voucher_status = "Pending", // Default to "Pending"
      passport_number,
      createdBy, // Ensure to get createdBy from the request body
      voucher_number, // Ensure voucher_number is sent
      transactions, // Array of transactions to be associated with the voucher
    } = req.body;

    // Log incoming payload for debugging
    console.log("Incoming voucher payload:", req.body);

    // Validate required fields
    const missingField = validateRequiredFields({
      customer_name,
      customer_address,
      mobile_number,
      passport_number,
      itrs_code,
      voucher_status,
      createdBy,
      voucher_number, // Include voucher_number in validation
      transactions, // Ensure transactions are passed
    });

    if (missingField) {
      return res.status(400).json({
        message: `Missing required field: ${missingField}`,
      });
    }

    // Validate 'itrs_code' and 'voucher_status'
    if (typeof itrs_code !== "number") {
      return res.status(400).json({ message: "Invalid 'itrs_code'. It must be a number." });
    }

    const validVoucherStatuses = ["Pending", "Verified"];
    if (!validVoucherStatuses.includes(voucher_status)) {
      return res.status(400).json({
        message: `Invalid 'voucher_status'. Must be one of: ${validVoucherStatuses.join(", ")}`,
      });
    }

    // Create a new voucher object
    const voucher = voucherRepo.create({
      customer_name,
      customer_address,
      mobile_number,
      itrs_code,
      travel_order_ref_number,
      voucher_cancellation,
      passport_number,
      voucher_status,
      createdBy, // Store the createdBy value from the request
      verifiedBy: "Pending", // Default value for verifiedBy
      voucher_number, // Include voucher_number
    });

    // Save the voucher first to ensure it exists in the database
    const savedVoucher = await voucherRepo.save(voucher);

    // Now handle the transactions creation
    const transactionPromises = transactions.map(async (transaction: any) => {
      // Ensure 'transaction_type' is present in each transaction
      if (!transaction.transaction_type) {
        throw new Error("Missing required field: transaction_type in one or more transactions.");
      }

      const newTransaction = transactionRepo.create({
        voucher: savedVoucher, // Associate the transaction with the saved voucher
        currency_name: transaction.currency_name,
        currency_iso_code: transaction.currency_iso_code, // Correct field name
        exchange_rate: transaction.exchange_rate,
        fc_amount: transaction.fc_amount,
        commission: transaction.commission,
        total_NPR: transaction.total_NPR,
        created_by: transaction.created_by,
        verified_by: transaction.verified_by,
        transaction_type: transaction.transaction_type, // Include transaction_type
      });

      // Save the transaction for each item in the transactions array
      return transactionRepo.save(newTransaction);
    });

    // Wait for all transactions to be saved
    await Promise.all(transactionPromises);

    // Send response after both voucher and transactions are created
    return res.status(201).json({
      message: "Voucher and transactions created successfully.",
      data: { voucher: savedVoucher, transactions },
    });
  } catch (err) {
    console.error("Error creating voucher and transactions:", err);

    // Ensure the response is sent only once
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Server error.",
        error: err.message || "An unexpected error occurred.",
      });
    }
  }
};
