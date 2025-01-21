import { Transactions } from "../models/Transaction";
import { Voucher } from "../models/Voucher";
import { Request, Response } from "express";
import { AppDataSource } from "../initializers/data-source";

const transactionRepo = AppDataSource.getRepository(Transactions);
const voucherRepo = AppDataSource.getRepository(Voucher);


