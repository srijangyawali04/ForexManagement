import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import { formatAmount } from '../../utils/voucherUtils';
import { getUserByStaffCode } from '../../services/api';
import numberToWords from '../../utils/numberToWords';

export const VoucherTemplate = ({ voucher }) => {
  const [createdByInfo, setCreatedByInfo] = useState(null);
  const [verifiedByInfo, setVerifiedByInfo] = useState(null);

  useEffect(() => {
    // Fetch the created by user info
    const fetchCreatedByInfo = async () => {
      const createdByStaffCode = voucher.transactions?.[0]?.created_by;
      if (createdByStaffCode) {
        try {
          const user = await getUserByStaffCode(createdByStaffCode);
          setCreatedByInfo(user);
        } catch (error) {
          console.error('Error fetching created by user info:', error);
        }
      }
    };

    // Fetch the verified by user info
    const fetchVerifiedByInfo = async () => {
      const verifiedByStaffCode = voucher.transactions?.[0]?.updated_by;

      if (verifiedByStaffCode && verifiedByStaffCode !== 'Pending') {
        try {
          const user = await getUserByStaffCode(verifiedByStaffCode);
          setVerifiedByInfo(user);
        } catch (error) {
          console.error('Error fetching verified by user info:', error);
        }
      } else {
        // Handle the case where verification is pending or not available
        setVerifiedByInfo({ name: 'Pending', designation: 'N/A' });
      }
    };

    fetchCreatedByInfo();
    fetchVerifiedByInfo();
  }, [voucher.transactions]);

  const designation = localStorage.getItem('designation'); 

  const voucherNo = voucher.voucherNo || voucher.voucher_number || 'N/A';
  const voucherDate = voucher.date || voucher.voucher_date || '';
  const customerName = voucher.customer?.name || voucher.customer_name || 'N/A';
  const voucherStaffCode = voucher.customer?.voucherStaffCode || voucher.voucher_staff_code || 'N/A';
  const passportNo = voucher.customer?.passportNo || voucher.passport_number || 'N/A';
  const address = voucher.customer?.address || voucher.customer_address || 'N/A';
  const mobileNo = voucher.customer?.mobileNo || voucher.mobile_number || 'N/A';
  const approvedBy = voucher.customer?.approved || voucher.approved_by || 'N/A';
  const itrsCode = voucher.customer?.itrsCode || voucher.itrs_code || 'N/A';
  const travelOrderRef = voucher.customer?.travelOrderRef || voucher.travel_order_ref_number || 'N/A';
  const voucherType = voucher.type || voucher.transactions?.[0]?.transaction_type || 'N/A';
 
  // Total Commission
  const totalCommission = (voucher.transactions || []).reduce((sum, t) => {
    const fcAmount = Number(t.fc_amount) || 0;
    const commission = voucherType === 'remit-in' && t.commission === undefined
      ? fcAmount * 0.005 // Calculate commission if not already defined
      : Number(t.commission); // Use the commission if already defined
    return sum + commission;
  }, 0);

  // Directly use NRP_amount from the payload for total NRP
  const totalNRP = (voucher.transactions || []).reduce((sum, t) => {
    const nprAmount = parseFloat(t.NPR_amount) || 0;  // Convert NPR_amount to a number
    return sum + nprAmount;
  }, 0) || voucher.totalAmount || 0;
  
  const netNRP = totalNRP - (totalCommission || 0);
  const amountInWords = numberToWords(netNRP); // Convert net amount to words

  const renderCopy = () => {  
    return (
      <div className="bg-white p-8 max-w-full mx-auto border border-gray-300 print:border-black mb-8 print:mx-4 print:p-4">
        <div className="printable-content">
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
              <p className="font-semibold">Voucher No.: 2081/82-{voucherNo}</p>
              <p>Date: {voucherDate ? new Date(voucherDate).toLocaleDateString('en-US') : 'N/A'}</p>
            </div>
          </div>
    
          <div className="mb-4 space-y-1">
            <div className="flex justify-between">
              <p>
                Customer Name: {customerName} 
                {voucherType === 'staff-voucher' && voucherStaffCode && (
                  <span> ({voucherStaffCode})</span>
                )}
              </p>
              <p>Mobile Number: {mobileNo}</p>
            </div>
            <div className="flex justify-between">
              <p>Passport Number: {passportNo}</p>
              {itrsCode !== 'N/A' && <p>ITRS Code: {itrsCode}</p>}
            </div>
            <div className="flex justify-between">
              <p>Address: {address}</p>
              {travelOrderRef !== 'N/A' && (
                <p>Travel Order Ref. No : {travelOrderRef}</p>
              )}
            </div>
          </div>

          <table className="w-full mb-4 border-collapse">
            <thead>
              <tr className="border border-gray-400">
                <th className="border border-gray-400 p-2">S.N.</th>
                <th className="border border-gray-400 p-2">Currency</th>
                <th className="border border-gray-400 p-2">
                  {voucherType === 'remit-out' ? 'Buying' : 'Selling'} Exchange Rate
                </th>
                <th className="border border-gray-400 p-2">FC Amount</th>
                <th className="border border-gray-400 p-2">NPR Amount</th>
                {voucherType === 'remit-in' && (
                  <th className="border border-gray-400 p-2">Commission (0.5%)</th>
                )}
              </tr>
            </thead>
            <tbody>
              {voucher.transactions?.map((transaction, index) => {  
                const fcAmount = transaction.fc_amount || 0;
                const exchangeRate = voucher.transactions?.[0]?.exhange_rate || transaction.exchange_rate || 0;
                const commission = isNaN(transaction.commission) || transaction.commission === undefined
                  ? fcAmount * 0.005
                  : transaction.commission;
                const nprAmount = transaction.NPR_amount || 0;  
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
                      {console.log('Rendering NRP_amount:', nprAmount)}
                      {formatAmount(nprAmount)} {/* Display NRP_amount */}
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
              <tr className="border border-gray-400">
                  <td colSpan={6} className="border border-gray-400 p-2 text-right">
                    <strong>Amount in Words:</strong> {amountInWords}
                  </td>
              </tr>
            </tbody>
          </table>
          <div className='font-bold'>
            <p>Approved By: {approvedBy}</p>
          </div>
    
          <div className="flex justify-between mt-16">
            <div className="text-center">
              <div className="border-t border-gray-400 pt-1">
                <p>Prepared by</p>
                <p>{createdByInfo?.staff_name || '_________________'}</p>
                <p>{createdByInfo?.designation || '_________________'}</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 pt-1">
                <p>Verified by</p>
                <p>
                  {voucher?.voucher_status === 'Verified' 
                    ? verifiedByInfo?.staff_name || 'Pending' 
                    : voucher?.voucher_status === 'Canceled' 
                    ? 'Canceled' 
                    : 'Pending'}
                </p>
                <p>
                  {voucher?.voucher_status === 'Verified' 
                    ? verifiedByInfo?.designation 
                    : ''}
                </p>
              </div>
            </div>
          </div>
          <br></br>
    
          <div className="text-sm mb-8">
            <p>Note:</p>
            <ul className="list-disc list-inside pl-4">
              <li>Validity of this voucher is for same date only.</li>
              <li>
                This is only foreign currency exchange voucher and can't be presented as Invoice and
                doesn't carry any legal obligations.
              </li>
              {voucher?.transactions?.some(transaction => transaction.transaction_type === 'remit-in') && (
                <li>
                  Commission will only be applied in denomination less than 50.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };
  
  return renderCopy();
  
};
