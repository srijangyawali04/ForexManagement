import { Voucher } from "../models/Voucher";
import { Request, Response } from "express";
import { AppDataSource } from "../initializers/data-source";

const voucherRepo = AppDataSource.getRepository(Voucher);

// Add Voucher Information
export const createVoucher = async (req: Request, res: Response) => {
  const {
    customer_name,
    customer_address,
    mobile_number,
    itrs_code,
    travel_order_ref_number,
    voucher_cancellation,
    passport_number,
  } = req.body;

  try {
    // Validate required fields
    if (
      !customer_name ||
      !customer_address ||
      !mobile_number ||
      !passport_number ||
      !itrs_code
    ) {
      return res.status(400).json({
        message: "Missing required fields.",
      });
    }

    // Check for duplicate mobile_number
    const existingVoucher = await voucherRepo.findOne({
      where: { mobile_number },
    });

    if (existingVoucher) {
      return res.status(400).json({
        message: "A voucher with this mobile number already exists.",
      });
    }

    // Create a new voucher
    const voucher = voucherRepo.create({
      customer_name,
      customer_address,
      mobile_number,
      itrs_code,
      travel_order_ref_number,
      voucher_cancellation,
      passport_number,
    });

    // Save the voucher to the database
    await voucherRepo.save(voucher);

    return res.status(201).json({
      message: "Voucher created successfully.",
      data: voucher,
    });
  } catch (err) {
    console.error(err);

    // Detailed error response
    return res.status(500).json({
      message: "Server error.",
      error: err.message || "An unexpected error occurred.",
    });
  }
};
