import { Voucher } from "../models/Voucher";
import { Transactions } from "../models/Transaction";
import { Request, Response } from "express";
import { getRepository } from 'typeorm';
import { AppDataSource } from "../initializers/data-source";

const voucherRepo = AppDataSource.getRepository(Voucher);
const transactionRepo = AppDataSource.getRepository(Transactions);

const validateRequiredFields = (fields: Record<string, any>): string | null => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value && key !== 'itrs_code') {
      return key;
    }
  }
  return null;
};

export const createVoucher = async (req: Request, res: Response) => {
  try {
    const {
      customer_name,
      voucher_staff_code,
      customer_address,
      mobile_number,
      passport_number,
      itrs_code,
      ordered_by,
      visiting_country,
      purpose_of_visit,
      source_of_foreign_currency,
      travel_order_ref_number = null,
      voucher_status = "Pending", 
      createdBy, 
      voucher_number,
      transactions,
    } = req.body;
    console.log('Request Body:', req.body);

    const missingField = validateRequiredFields({
      customer_name,
      customer_address,
      mobile_number,
      passport_number,
      voucher_status,
      ordered_by,
      createdBy,
      voucher_number,
      transactions,
    });

    if (missingField) {
      return res.status(400).json({
        message: `Missing required field: ${missingField}`,
      });
    }

    const validVoucherStatuses = ["Pending", "Verified"];
    if (!validVoucherStatuses.includes(voucher_status)) {
      return res.status(400).json({
        message: `Invalid 'voucher_status'. Must be one of: ${validVoucherStatuses.join(", ")}`,
      });
    }

    const voucher = voucherRepo.create({
      voucher_number,
      customer_name,
      voucher_staff_code,
      customer_address,
      mobile_number,
      ordered_by,
      passport_number,
      visiting_country,
      purpose_of_visit,
      source_of_foreign_currency,
      itrs_code,
      travel_order_ref_number,
      voucher_status,
      createdBy,
      updatedBy: "Pending",
    });

    const savedVoucher = await voucherRepo.save(voucher);

    const transactionPromises = transactions.map(async (transaction: any) => {
      if (!transaction.transaction_type) {
        throw new Error("Missing required field: transaction_type in one or more transactions.");
      }

      const newTransaction = transactionRepo.create({
        voucher: savedVoucher,
        currency_name: transaction.currency_name,
        currency_iso_code: transaction.currency_iso_code,
        exchange_rate: transaction.exchange_rate,
        fc_amount: transaction.fc_amount,
        commission: transaction.commission,
        NPR_amount: transaction.NPR_amount,
        created_by: transaction.created_by,
        updated_by: transaction.updated_by,
        transaction_type: transaction.transaction_type,
      });

      return transactionRepo.save(newTransaction);
    });

    await Promise.all(transactionPromises);

    return res.status(201).json({
      message: "Voucher and transactions created successfully.",
      data: { voucher: savedVoucher, transactions },
    });
  } catch (err) {
    console.error("Error creating voucher and transactions:", err);

    if (!res.headersSent) {
      return res.status(500).json({
        message: "Server error.",
        error: err.message || "An unexpected error occurred.",
      });
    }
  }
};

export const getVoucherList = async (req: Request, res: Response) => {
  try {
    const { staffCode } = req.query;
    
    let queryOptions: any = {
      relations: ["transactions"],
      order: { voucher_date: "DESC" },
    };

    if (staffCode) {
      queryOptions.where = {
        createdBy: staffCode
      };
    }

    const vouchers = await voucherRepo.find(queryOptions);

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

export const updateVoucherStatus = async (req: Request, res: Response) => {
  try {
    const voucher_number = Number(req.params.voucher_number);

    if (isNaN(voucher_number)) {
      return res.status(400).json({ message: "Invalid voucher number." });
    }

    const voucher = await voucherRepo.findOne({
      where: { voucher_number },
      relations: ["transactions"],
    });

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    console.log("Request Body:", req.body);
    console.log("Voucher Before Update:", voucher);

    const { action, updatedBy } = req.body;

    if (!["verify", "cancel", "edit"].includes(action)) {
      return res.status(400).json({ message: "Invalid action." });
    }

    if (action === "verify") {
      if (voucher.voucher_status === "Verified" || voucher.voucher_status === "Canceled") {
        return res.status(400).json({ message: "Voucher has already been verified or canceled." });
      }

      voucher.voucher_status = "Verified";
      voucher.updatedBy = updatedBy || "Admin";

      if (voucher.transactions && voucher.transactions.length > 0) {
        try {
          for (const transaction of voucher.transactions) {
            transaction.updated_by = updatedBy || "Admin";
            await transactionRepo.save(transaction);
          }
        } catch (transactionError) {
          console.error("Error updating transaction:", transactionError);
          return res.status(500).json({ message: "Error updating transaction" });
        }
      }
    } else if (action === "cancel") {
      if (voucher.voucher_status === "Canceled") {
        return res.status(400).json({ message: "Voucher has already been canceled." });
      }

      voucher.voucher_status = "Canceled";
      voucher.updatedBy = updatedBy;

      if (voucher.transactions && voucher.transactions.length > 0) {
        try {
          for (const transaction of voucher.transactions) {
            transaction.updated_by = updatedBy;
            await transactionRepo.save(transaction);
          }
        } catch (transactionError) {
          console.error("Error updating transaction:", transactionError);
          return res.status(500).json({ message: "Error updating transaction" });
        }
      }
    } else if (action === "edit") {
      if (voucher.voucher_status === "Edit") {
        return res.status(400).json({ message: "Voucher has already been sent for editting." });
      }

      voucher.voucher_status = "Edit";
      voucher.updatedBy = "Pending";

      if (voucher.transactions && voucher.transactions.length > 0) {
        try {
          for (const transaction of voucher.transactions) {
            transaction.updated_by = "Pending";
            await transactionRepo.save(transaction);
          }
        } catch (transactionError) {
          console.error("Error updating transaction:", transactionError);
          return res.status(500).json({ message: "Error updating transaction" });
        }
      }
    }

    try {
      console.log("Saving updated voucher:", voucher);
      await voucherRepo.save(voucher);
    } catch (voucherSaveError) {
      console.error("Error saving voucher:", voucherSaveError);
      return res.status(500).json({ message: "Error saving voucher", error: voucherSaveError.message });
    }

    return res.status(200).json({
      message: `Voucher ${action}d successfully.`,
      voucher,
      transactions: voucher.transactions,
    });
  } catch (error) {
    console.error("Error updating voucher status:", error);
    return res.status(500).json({ message: "Error updating voucher status", error: error.message });
  }
};

export const getVoucherByNumber = async (req: Request, res: Response) => {
  try {
    const voucher_number = Number(req.params.voucher_number);

    if (isNaN(voucher_number)) {
      return res.status(400).json({ message: 'Invalid voucher number.' });
    }

    const voucher = await voucherRepo.findOne({
      where: { voucher_number },
      relations: ['transactions'],
    });

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    return res.status(200).json({
      message: 'Voucher fetched successfully',
      data: voucher,
    });
  } catch (err) {
    console.error('Error fetching voucher by number:', err);
    return res.status(500).json({
      message: 'Server error.',
      error: err.message || 'An unexpected error occurred.',
    });
  }
};

export const getTotalVouchers = async (req: Request, res: Response) => {
  try {
    if (!AppDataSource.isInitialized) {
      console.error('AppDataSource is not initialized');
      return res.status(500).json({ message: 'Database connection not initialized' });
    }

    const voucherRepository = AppDataSource.getRepository(Voucher);
    const totalVouchers = await voucherRepository
      .createQueryBuilder('voucher')
      .select('COUNT(voucher_number)', 'count')
      .getRawOne();

    if (!totalVouchers) {
      console.error('No vouchers found');
      return res.status(404).json({ message: 'No vouchers found' });
    }

    return res.json({ totalVouchers: Number(totalVouchers.count) });
  } catch (error) {
    console.error('Error fetching total vouchers:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

export const applyCorrection = async (req: Request, res: Response) => {
  try {
    const voucher_number = parseInt(req.params.voucher_number, 10);
    if (isNaN(voucher_number)) {
      return res.status(400).json({ message: 'Invalid voucher number' });
    }

    const { customer_name, passport_number, mobile_number, customer_address, itrs_code, visiting_country, purpose_of_visit, source_of_foreign_currency, travel_order_ref_number, voucher_status, transactions } = req.body;

    const voucher = await voucherRepo.findOne({ where: { voucher_number }, relations: ['transactions'] });
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    voucher.customer_name = customer_name || voucher.customer_name;
    voucher.passport_number = passport_number || voucher.passport_number;
    voucher.mobile_number = mobile_number || voucher.mobile_number;
    voucher.customer_address = customer_address || voucher.customer_address;
    voucher.itrs_code = itrs_code || voucher.itrs_code;
    voucher.visiting_country = visiting_country || voucher.visiting_country;
    voucher.purpose_of_visit = purpose_of_visit || voucher.purpose_of_visit;
    voucher.source_of_foreign_currency = source_of_foreign_currency || voucher.source_of_foreign_currency;
    voucher.travel_order_ref_number = travel_order_ref_number || voucher.travel_order_ref_number;
    voucher.voucher_status = voucher_status || voucher.voucher_status;
    
    await voucherRepo.save(voucher);

    if (transactions && transactions.length > 0) {
      for (const tx of transactions) {
        if (!tx.transaction_id) continue;

        const transaction = await transactionRepo.findOne({ where: { transaction_id: tx.transaction_id } });
        if (transaction) {
          console.log(`🔍 Found Transaction ID: ${tx.transaction_id}`);

          transaction.currency_name = tx.currency_name ?? transaction.currency_name;
          transaction.currency_iso_code = tx.currency_iso_code ?? transaction.currency_iso_code;
          transaction.exchange_rate = tx.exchange_rate ?? transaction.exchange_rate;
          transaction.fc_amount = tx.fc_amount ?? transaction.fc_amount;
          transaction.commission = tx.commission ?? transaction.commission;
          transaction.NPR_amount = tx.NPR_amount ?? transaction.NPR_amount;
          transaction.updated_by = tx.updated_by ?? transaction.updated_by;

          await transactionRepo.save(transaction);
          console.log(`Updated Transaction ID: ${tx.transaction_id}`);
        } else {
          console.log(`Transaction ID ${tx.transaction_id} not found.`);
        }
      }
    }

    return res.status(200).json({ message: 'Voucher corrections applied successfully', voucher });
  } catch (error) {
    return res.status(500).json({ message: 'Error applying corrections', error: error.message });
  }
};
