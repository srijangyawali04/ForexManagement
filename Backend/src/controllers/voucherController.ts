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
      passport_number,
      itrs_code,
      travel_order_ref_number = null, // Default to null if not provided
      voucher_cancellation = null, // Default to null if not provided
      voucher_status = "Pending", // Default to "Pending"
      createdBy, // Ensure to get createdBy from the request body
      voucher_number, // Ensure voucher_number is sent
      transactions, // Array of transactions to be associated with the voucher
    } = req.body;


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
      voucher_number,
      customer_name,
      customer_address,
      mobile_number,
      passport_number,
      itrs_code,
      travel_order_ref_number,
      voucher_status,
      createdBy, // Store the createdBy value from the request
      updatedBy: "Pending", // Default value for verifiedBy
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
        updated_by: transaction.updated_by,
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

// Get all vouchers for the list in the front-end
export const getVoucherList = async (req: Request, res: Response) => {
  try {
    const vouchers = await voucherRepo.find({
      relations: ["transactions"], // To fetch related transactions as well
      order: { voucher_date: "DESC" }, // Optional: order vouchers by creation date
    });

    if (!vouchers) {
      return res.status(404).json({ message: "No vouchers found" });
    }

    return res.status(200).json({
      message: "Vouchers fetched successfully.",
      data: vouchers,
    });
  } catch (err) {
    console.error("Error fetching voucher list:", err);
    return res.status(500).json({
      message: "Server error.",
      error: err.message || "An unexpected error occurred.",
    });
  }
};

/// Update voucher status (Verify or Cancel)
export const updateVoucherStatus = async (req: Request, res: Response) => {
  try {
    // Convert voucher_number to a number
    const voucher_number = Number(req.params.voucher_number);

    // Check if voucher_number is a valid number
    if (isNaN(voucher_number)) {
      return res.status(400).json({ message: 'Invalid voucher number.' });
    }

    // Fetch voucher by voucher_number, including transactions
    const voucher = await voucherRepo.findOne({
      where: { voucher_number },
      relations: ['transactions'], // Ensure transactions are fetched with the voucher
    });

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    // Log the request body and voucher state for debugging
    console.log('Request Body:', req.body);
    console.log('Voucher Before Update:', voucher);

    // Determine action based on the request body
    const { action, updatedBy } = req.body; // 'action' can be 'verify' or 'cancel'

    // Ensure the action is either 'verify' or 'cancel'
    if (action !== 'verify' && action !== 'cancel') {
      return res.status(400).json({ message: 'Invalid action.' });
    }

    // Perform the action
    if (action === 'verify') {
      // Check if voucher is already verified or canceled
      if (voucher.voucher_status === 'Verified' || voucher.voucher_status === 'Canceled') {
        return res.status(400).json({ message: 'Voucher has already been verified or canceled.' });
      }

      // Update voucher status to 'Verified'
      voucher.voucher_status = 'Verified';
      voucher.updatedBy = updatedBy || 'Admin';

      // Update the verified_by for each transaction within the voucher
      if (voucher.transactions && voucher.transactions.length > 0) {
        try {
          for (const transaction of voucher.transactions) {
            transaction.updated_by = updatedBy || 'Admin'; // Update the transaction's verified_by field
            await transactionRepo.save(transaction); // Save each transaction
          }
        } catch (transactionError) {
          console.error('Error updating transaction:', transactionError);
          return res.status(500).json({ message: 'Error updating transaction' });
        }
      }

    } else if (action === 'cancel') {
      // Check if voucher is already canceled
      if (voucher.voucher_status === 'Canceled') {
        return res.status(400).json({ message: 'Voucher has already been canceled.' });
      }

      // Update voucher status to 'Canceled'
      voucher.voucher_status = 'Canceled';
      voucher.updatedBy = updatedBy || 'System'; // Add canceledBy information
      // Optionally, mark all transactions as canceled (if necessary)
      if (voucher.transactions && voucher.transactions.length > 0) {
        try {
          for (const transaction of voucher.transactions) {
            transaction.updated_by = updatedBy || 'System'; // Mark transaction as canceled by the system
            await transactionRepo.save(transaction); // Save each transaction
          }
        } catch (transactionError) {
          console.error('Error updating transaction:', transactionError);
          return res.status(500).json({ message: 'Error updating transaction' });
        }
      }
    }

    // Save the updated voucher and log for debugging
    try {
      console.log('Saving updated voucher:', voucher);
      await voucherRepo.save(voucher);
    } catch (voucherSaveError) {
      console.error('Error saving voucher:', voucherSaveError);
      return res.status(500).json({ message: 'Error saving voucher', error: voucherSaveError.message });
    }

    // Return success response with updated voucher and transactions
    return res.status(200).json({
      message: `Voucher ${action}d successfully.`,
      voucher,
      transactions: voucher.transactions, // Return updated transactions along with the voucher
    });

  } catch (error) {
    console.error('Error updating voucher status:', error);
    return res.status(500).json({ message: 'Error updating voucher status', error: error.message });
  }
};



// Get a voucher by its voucher number
export const getVoucherByNumber = async (req: Request, res: Response) => {
  try {
    // Extract the voucher number from the request parameters
    const voucher_number = Number(req.params.voucher_number);

    // Check if voucher_number is a valid number
    if (isNaN(voucher_number)) {
      return res.status(400).json({ message: 'Invalid voucher number.' });
    }

    // Fetch the voucher by voucher_number, including related transactions
    const voucher = await voucherRepo.findOne({
      where: { voucher_number },
      relations: ['transactions'],  // To fetch related transactions
    });

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    return res.status(200).json({
      message: 'Voucher fetched successfully',
      data: voucher,  // Return the voucher and its transactions
    });
  } catch (err) {
    console.error('Error fetching voucher by number:', err);
    return res.status(500).json({
      message: 'Server error.',
      error: err.message || 'An unexpected error occurred.',
    });
  }
};

//Get total number of vouchers 
export const getTotalVouchers = async (req: Request, res: Response) => {
  try {
    // Ensure AppDataSource is properly initialized and connected
    if (!AppDataSource.isInitialized) {
      console.error('AppDataSource is not initialized');
      return res.status(500).json({ message: 'Database connection not initialized' });
    }

    const voucherRepository = AppDataSource.getRepository(Voucher); // Get the repository via AppDataSource
    const totalVouchers = await voucherRepository
      .createQueryBuilder('voucher')
      .select('COUNT(voucher_number)', 'count') // Assuming 'voucher_number' is the unique identifier of the Voucher
      .getRawOne(); // Get the raw result of the query

    if (!totalVouchers) {
      console.error('No vouchers found');
      return res.status(404).json({ message: 'No vouchers found' });
    }

    // Convert the count to a number and send it in the response
    return res.json({ totalVouchers: Number(totalVouchers.count) }); // Explicitly convert to a number
  } catch (error) {
    console.error('Error fetching total vouchers:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
