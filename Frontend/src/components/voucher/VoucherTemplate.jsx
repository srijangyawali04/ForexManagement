import React from 'react';
import logo from '../../assets/logo.png';
import { formatAmount } from '../../utils/voucherUtils';

export const VoucherTemplate = ({ voucher }) => {
  console.log('FOR validation', voucher);
  console.log('type', voucher.transactions?.[0]?.transaction_type);

  // Retrieve the stored staffName and designation
  const staffName = localStorage.getItem('staff_name'); // Ensure the key matches what is stored
  const designation = localStorage.getItem('designation'); // Retrieve designation

  // Check if staffName is missing, log a warning for debugging
  if (!staffName) {
    console.warn('Staff Name is not available in localStorage.');
  }

  // Safely access customer and voucher details
  const voucherNo = voucher.voucherNo || voucher.voucher_number || 'N/A';
  const voucherDate = voucher.date || voucher.voucher_date || '';
  const customerName = voucher.customer?.name || voucher.customer_name || 'N/A';
  const passportNo = voucher.customer?.passportNo || voucher.passport_number || 'N/A';
  const address = voucher.customer?.address || voucher.customer_address || 'N/A';
  const mobileNo = voucher.customer?.mobileNo || voucher.mobile_number || 'N/A';
  const itrsCode = voucher.customer?.itrsCode || voucher.itrs_code || 'N/A';
  const travelOrderRef = voucher.travelOrderRef || voucher.travel_order_ref_number || 'N/A';
  const voucherType = voucher.type || voucher.transactions?.[0]?.transaction_type || 'N/A';

  // Calculate Total Commission
  const totalCommission = (voucher.transactions || []).reduce((sum, t) => {
    const fcAmount = Number(t.fc_amount) || 0;
    const calculatedCommission = isNaN(Number(t.commission)) || t.commission === undefined
      ? fcAmount * 0.005 // Assuming 0.5% commission rate
      : Number(t.commission);
    return sum + calculatedCommission;
  }, 0);
  
  console.log('Total Commission',totalCommission);
  // Calculate Total NPR
  const totalNRP = (voucher.transactions || []).reduce((sum, t) => {
    const fcAmount = t.fc_amount || 0;
    const exchangeRate = t.exchange_rate || 0;
    const nprAmount = fcAmount * exchangeRate;
    return sum + nprAmount;
  }, 0) || voucher.totalAmount || 0;

  // Calculate net NRP
  // const netNRP = voucher.netTotal || voucher.totalAmount || voucher.transactions?.[0]?.total_NRP || 0;
  const netNRP = totalNRP - (totalCommission || 0);
  console.log('net',netNRP);

  return (
    <div className="bg-white p-8 max-w-3xl mx-auto border border-gray-300 print:border-black">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Nepal Rastra Bank" className="w-16 h-16" />
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
          <p>Voucher No.: {voucherNo}</p>
          <p>Date: {voucherDate ? new Date(voucherDate).toLocaleDateString('en-US') : 'N/A'}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-4 space-y-1">
        <p>Customer Name: {customerName}</p>
        <p>Passport No.: {passportNo}</p>
        <p>Address: {address}</p>
        <div className="flex justify-between">
          <p>Mobile No.: {mobileNo}</p>
          {itrsCode !== 'N/A' && <p>ITRS Code: {itrsCode}</p>}
          {travelOrderRef !== 'N/A' && <p>Travel Order Ref. No.: {travelOrderRef}</p>}
        </div>
      </div>

      {/* Transactions Table */}
      <table className="w-full mb-4 border-collapse">
        <thead>
          <tr className="border border-gray-400">
            <th className="border border-gray-400 p-2">S.N.</th>
            <th className="border border-gray-400 p-2">Currency</th>
            <th className="border border-gray-400 p-2">
              {voucherType === 'remit-out' ? 'Buying' : 'Selling'} Exchange Rate
            </th>
            <th className="border border-gray-400 p-2">FCY Amount</th>
            <th className="border border-gray-400 p-2">Amount NPR</th>
            {voucherType === 'remit-in' && (
              <th className="border border-gray-400 p-2">Commission (0.5%)</th>
            )}
          </tr>
        </thead>
        <tbody>
          {(voucher.transactions || []).map((transaction, index) => {
            const fcAmount = transaction.fc_amount || 0;
            const exchangeRate = transaction.exchange_rate || 0;
            const commission = isNaN(transaction.commission) || transaction.commission === undefined
              ? fcAmount * 0.005
              : transaction.commission;
            const nprAmount = fcAmount * exchangeRate;

            return (
              <tr key={index} className="border border-gray-400">
                <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
                <td className="border border-gray-400 p-2">{transaction.currency_iso_code}</td>
                <td className="border border-gray-400 p-2 text-right">
                  {exchangeRate && !isNaN(Number(exchangeRate))
                    ? Number(exchangeRate).toFixed(2)
                    : '0.00'}
                </td>
                <td className="border border-gray-400 p-2 text-right">
                  {formatAmount(fcAmount)}
                </td>
                <td className="border border-gray-400 p-2 text-right">
                  {formatAmount(nprAmount)}
                </td>
                {voucherType === 'remit-in' && (
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
              {formatAmount(totalNRP)}
            </td>
            {voucherType === 'remit-in' && (
              <td className="border border-gray-400 p-2 text-right">
                {formatAmount(totalCommission)}
              </td>
            )}
          </tr>
          {voucherType === 'remit-in' && (
            <tr className="border border-gray-400 font-bold">
              <td colSpan={4} className="border border-gray-400 p-2 text-right">
                Net Total
              </td>
              <td colSpan={2} className="border border-gray-400 p-2 text-right">
                {formatAmount(netNRP)}
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
            <p>{voucher.transactions?.[0]?.created_by || '_________________'}</p>
            <p>{designation || '_________________'}</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-1">
            <p>Verified by</p>
            <p>{voucher.transactions?.[0]?.verified_by || '_________________'}</p>
            <p>Designation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherTemplate;
