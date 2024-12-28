import { Voucher } from "../models/Voucher";
import { Request, Response } from "express";

import { AppDataSource } from "../initializers/data-source";

const voucherRepo = AppDataSource.getRepository(Voucher);

//Add Voucher Information
export const createVoucher = async (req: Request, res: Response) => {
  const { voucher_date, customer_name, customer_address, mobile_number, itrs_code, travel_order_ref_number, voucher_cancellation, passport_number } = req.body;

  try {
    const voucher = voucherRepo.create({
      voucher_date,
      customer_name,
      customer_address,
      mobile_number,
      itrs_code,
      travel_order_ref_number,
      voucher_cancellation,
      passport_number,
    });

    await voucherRepo.save(voucher);

    return res.status(200).json({
      message: "voucher created successfully.",
      data: voucher,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
