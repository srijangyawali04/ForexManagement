import { Request, Response } from "express";
import { Transactions } from "../models/Transaction";
import { Voucher } from "../models/Voucher";
import { AppDataSource } from "../initializers/data-source";
import { format } from "date-fns";

const transactionRepo = AppDataSource.getRepository(Transactions);
const voucherRepo = AppDataSource.getRepository(Voucher);

export const fetchAllTransactions = async (req: Request, res: Response) => {
    try {
      const transactions = await transactionRepo
        .createQueryBuilder('transaction')
        .innerJoinAndSelect('transaction.voucher', 'voucher')
        .getMany();
  
      if (transactions.length === 0) {
        return res.status(404).json({ message: 'No transactions available' });
      }
  
      const transactionData = transactions.map((transaction) => ({
        transaction_id: transaction.transaction_id,
        currency_name: transaction.currency_name,
        currency_iso_code: transaction.currency_iso_code,
        exchange_rate: transaction.exchange_rate,
        fc_amount: transaction.fc_amount,
        commission: transaction.commission,
        NPR_amount: transaction.NPR_amount,
        transaction_type: transaction.transaction_type,
        created_by: transaction.created_by,
        updated_by: transaction.updated_by,
        voucher_date: format(transaction.voucher.voucher_date, 'yyyy-MM-dd HH:mm:ss'),
      }));
  
      return res.status(200).json({ data: transactionData });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching the transactions' });
    }
  };

export const fetchSpecificTransactions = async (req: Request, res: Response) => {
  try {
    const { currency, transactionType, startDate, endDate, today } = req.query;

    const queryBuilder = transactionRepo
      .createQueryBuilder('transaction')
      .innerJoinAndSelect('transaction.voucher', 'voucher');

    if (currency) {
      queryBuilder.andWhere('transaction.currency_iso_code = :currency', { currency });
    }

    if (transactionType) {
      queryBuilder.andWhere('transaction.transaction_type = :transactionType', { transactionType });
    }

    if (today === 'true') {
      queryBuilder.andWhere('DATE(voucher.voucher_date) = CURRENT_DATE');
    } 
    else if (startDate && endDate) {
      queryBuilder.andWhere('DATE(voucher.voucher_date) >= :startDate AND DATE(voucher.voucher_date) <= :endDate', {
        startDate,
        endDate,
      });
    }

    queryBuilder.andWhere('voucher.voucher_status = :voucherStatus', { voucherStatus: 'Verified' });

    console.log(queryBuilder.getSql());

    const transactions = await queryBuilder.getMany();

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for the specified filters' });
    }

    const transactionData = transactions.map((transaction) => ({
      transaction_id: transaction.transaction_id,
      currency_name: transaction.currency_name,
      currency_iso_code: transaction.currency_iso_code,
      exchange_rate: transaction.exchange_rate,
      fc_amount: transaction.fc_amount,
      commission: transaction.commission,
      NPR_amount: transaction.NPR_amount,
      transaction_type: transaction.transaction_type,
      created_by: transaction.created_by,
      updated_by: transaction.updated_by,
      voucher_date: format(transaction.voucher.voucher_date, 'yyyy-MM-dd HH:mm:ss'),
    }));

    return res.status(200).json({ data: transactionData });
  } catch (error) {
    console.error("Error Details:", error);
    return res.status(500).json({ message: 'Error fetching the specific transactions', error });
  }
};
