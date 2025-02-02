import React, { useState, useEffect } from 'react';
import { CustomerForm } from './CustomerForm';
import { TransactionForm } from './TransactionForm';
import { VoucherPreview } from './VoucherPreview';
import { useAuth } from '../../contexts/AuthContext';
import { generateVoucherNumber } from '../../utils/voucherUtils';

export default function VoucherForm({ onSubmit }) {
  const { authState } = useAuth();
  const [voucherType, setVoucherType] = useState('remit-out');
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewVoucher, setPreviewVoucher] = useState(null);
  const [commissionApplied, setCommissionApplied] = useState(false); // Flag to track commission application

  // Clear transactions when voucherType changes
  useEffect(() => {
    setTransactions([]); // Reset transactions when voucherType changes
  }, [voucherType]);

  const handleSubmit = async () => {
    if (!authState || !customer || transactions.length === 0) {
      return;
    }

    // Generate the voucher number using the async function
    const voucherNo = await generateVoucherNumber();

    const totalAmount = transactions.reduce((sum, t) => sum + t.nprAmount, 0);
    const commission = voucherType === 'remit-in'
      ? transactions.reduce((sum, t) => sum + (t.commission || 0), 0)
      : 0;

    const newVoucher = {
      id: Math.random().toString(36).substr(2, 9),
      type: voucherType,
      voucherNo: voucherNo, // Use the async-generated voucher number here
      date: new Date(),
      customer,
      transactions,
      visitingCountry: voucherType == 'remit-in',
      purposeOfVisit: voucherType == 'remit-out',
      sourceOfForeignCurrency: voucherType == 'remit-out',
      travelOrderRef: voucherType === 'staff-voucher',
      voucherStaffCode : voucherType == 'staff-voucher',
      totalAmount,
      netTotal: voucherType === 'remit-in' ? totalAmount - commission : totalAmount,
      createdBy: authState?.staffCode || 'Unknown',
      status: 'pending',
      createdAt: new Date(),
    };

    setPreviewVoucher(newVoucher);
    setShowPreview(true);
  };

  const handleGenerate = () => {
    if (previewVoucher) {
      onSubmit(previewVoucher);
      setCustomer(null);
      setTransactions([]); // Clear transactions after submission
      setShowPreview(false);
      setPreviewVoucher(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const textColors = {
    "remit-out": "text-red-600",
    "remit-in": "text-green-600",
    "staff-voucher": "text-blue-600",
  };

  
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="w-full max-w-xs space-y-2">
          <label 
            htmlFor="voucher-type" 
            className="block text-lg font-medium text-gray-700"
          >
            Voucher Type
          </label>
          <select
            id="voucher-type"
            value={voucherType}
            onChange={(e) => setVoucherType(e.target.value)}
            className={`mt-1 font-semibold text-[15px] block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-75 ${textColors[voucherType]}`}
          >
            <option value="remit-out" className="text-red-600">Remit Out</option>
            <option value="remit-in" className="text-green-600">Remit In</option>
            <option value="staff-voucher" className="text-blue-600">
              Remit Out - Travel Order for NRB Staffs
            </option>
          </select>
          <p className="text-sm text-gray-500">
            Choose the type of voucher you want to create
          </p>
        </div>

        <CustomerForm
          value={customer}
          onChange={setCustomer}
          voucherType={voucherType} // Pass voucherType as a prop
          key={voucherType} // Use voucherType as a key to trigger re-rendering
        />


        <TransactionForm
          transactions={transactions}
          onChange={setTransactions} // Directly set transactions without applying commission
          voucherType={voucherType}
        />

        <button
          type="button"
          disabled={!customer || transactions.length === 0 || commissionApplied}
          onClick={() => {
            // applyCommission(); // Apply commission when the button is clicked
            handleSubmit(); // Proceed with the form submission
          }}
          className="w-auto bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Preview Voucher
        </button>
      </form>

      {showPreview && previewVoucher && (
        <VoucherPreview
          voucher={previewVoucher}
          onClose={() => setShowPreview(false)}
          onPrint={handlePrint}
          onGenerate={handleGenerate}
          showGenerateButton={true}
        />
      )}
    </>
  );
}
