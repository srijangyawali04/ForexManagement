import React from 'react';
import logo from '../../assets/logo.png';
import { formatAmount } from '../../utils/voucherUtils';

export const VoucherTemplate = ({ voucher }) => {
  const totalCommission = voucher.transactions.reduce((sum, t) => sum + (t.commission || 0), 0);

  // Retrieve the stored staffName and designation
  const staffName = localStorage.getItem('staff_name'); // Ensure the key matches what is stored
  const designation = localStorage.getItem('designation'); // Retrieve designation

  // Check if staffName is missing, log a warning for debugging
  if (!staffName) {
    console.warn('Staff Name is not available in localStorage.');
  }

  return (
    <div className="bg-white p-8 max-w-3xl mx-auto border border-gray-300 print:border-black">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img 
            src={logo}
            alt="Nepal Rastra Bank" 
            className="w-16 h-16"
          />
          <div>
            <h1 className="text-lg font-bold">Nepal Rastra Bank</h1>
            <p className="text-sm">Banking Department</p>
            <p className="text-sm">Remittance Section</p>
          </div>
        </div>
        <div className="text-right">
          <div className="inline-block border border-yellow-400 bg-yellow-50 px-2">Office Copy</div>
        </div>
      </div>

      {/* Voucher Info */}
      <div className="flex justify-between mb-4">
        <div></div>
        <div className="text-right">
          <p>Voucher No.: {voucher.voucherNo}</p>
          <p>Date: {new Date(voucher.date).toLocaleDateString('en-US')}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-4 space-y-1">
        <p>Customer Name: {voucher.customer.name}</p>
        <p>Passport No.: {voucher.customer.passportNo}</p>
        <p>Address: {voucher.customer.address}</p>
        <div className="flex justify-between">
          <p>Mobile No.: {voucher.customer.mobileNo}</p>
          {voucher.customer.itrsCode && <p>ITRS Code: {voucher.customer.itrsCode}</p>}
          {voucher.travelOrderRef && <p>Travel Order Ref. No.: {voucher.travelOrderRef}</p>}
        </div>
      </div>

      {/* Transactions Table */}
      <table className="w-full mb-4 border-collapse">
        <thead>
          <tr className="border border-gray-400">
            <th className="border border-gray-400 p-2">S.N.</th>
            <th className="border border-gray-400 p-2">Currency</th>
            <th className="border border-gray-400 p-2">
              {voucher.type === 'remit-out' ? 'Buying' : 'Selling'} Exchange Rate
            </th>
            <th className="border border-gray-400 p-2">FCY Amount</th>
            <th className="border border-gray-400 p-2">Amount NPR</th>
            {voucher.type === 'remit-in' && (
              <th className="border border-gray-400 p-2">Commission (0.5%)</th>
            )}
          </tr>
        </thead>
        <tbody>
          {voucher.transactions.map((transaction, index) => {
            // Calculate the commission if it's not present or is NaN
            const commission = isNaN(transaction.commission) || transaction.commission === undefined
              ? (transaction.fc_amount * 0.005) // Assuming 0.5% commission rate
              : transaction.commission;

            // Calculate nprAmount based on the exchange rate and fc_amount
            const nprAmount = (transaction.fc_amount * transaction.exchange_rate) || 0; // Calculate NPR

            return (
              <tr key={index} className="border border-gray-400">
                <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
                <td className="border border-gray-400 p-2">{transaction.currency_iso_code}</td>
                <td className="border border-gray-400 p-2 text-right">
                  {transaction.exchange_rate ? transaction.exchange_rate.toFixed(2) : '0.00'}
                </td>
                <td className="border border-gray-400 p-2 text-right">
                  {formatAmount(transaction.fc_amount || 0)}
                </td>
                <td className="border border-gray-400 p-2 text-right">
                  {formatAmount(nprAmount || 0)} {/* Use calculated nprAmount */}
                </td>
                {voucher.type === 'remit-in' && (
                  <td className="border border-gray-400 p-2 text-right">
                    {formatAmount(commission)}
                  </td>
                )}
              </tr>
            );
          })}
          <tr className="border border-gray-400 font-bold">
            <td colSpan={4} className="border border-gray-400 p-2 text-right">
              Total
            </td>
            <td className="border border-gray-400 p-2 text-right">
              {formatAmount(voucher.totalAmount || 0)}
            </td>
            {voucher.type === 'remit-in' && (
              <td className="border border-gray-400 p-2 text-right">
                {formatAmount(totalCommission || 0)}
              </td>
            )}
          </tr>
          {voucher.type === 'remit-in' && (
            <tr className="border border-gray-400 font-bold">
              <td colSpan={4} className="border border-gray-400 p-2 text-right">
                Net Total
              </td>
              <td colSpan={2} className="border border-gray-400 p-2 text-right">
                {formatAmount(voucher.netTotal || voucher.totalAmount || 0)}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Footer Notes */}
      <div className="text-sm mb-8">
        <p>Note:</p>
        <ul className="list-disc list-inside pl-4">
          <li>Validity of this voucher is for same date only.</li>
          <li>
            This is only foreign currency exchange voucher and can't be presented as Invoice and
            doesn't carry any legal obligations.
          </li>
        </ul>
      </div>

      {/* Signatures */}
      <div className="flex justify-between mt-16">
        <div className="text-center">
          <div className="border-t border-gray-400 pt-1">
            <p>Prepared by</p>
            <p>{staffName || '_________________'}</p> {/* Display staffName with a fallback */}
            <p>{designation || '_________________'}</p> {/* Display designation with a fallback */}
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-1">
            <p>Verified by</p>
            <p>{voucher.verifiedBy || '_________________'}</p>
            <p>Designation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherTemplate;
