import React, { useState, useEffect } from 'react';
import { CustomerForm } from './CustomerForm';
import { TransactionForm } from './TransactionForm';
import { VoucherPreview } from './VoucherPreview';
import { useAuth } from '../../contexts/AuthContext';
import { generateVoucherNumber } from '../../utils/voucherUtils';

export default function VoucherForm({ onSubmit }) {
  const { authState } = useAuth();
  const [voucherType, setVoucherType] = useState('remit-in');
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
      totalAmount,
      netTotal: voucherType === 'remit-in' ? totalAmount - commission : totalAmount,
      createdBy: authState?.staffCode || 'Unknown',
      travelOrderRef: voucherType === 'staff' ? `HRMD...${Math.random().toString(36).slice(2, 8)}` : undefined,
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

  // Function to apply commission when button is pressed
  const applyCommission = () => {
    const updatedTransactions = transactions.map((transaction) => {
      if (voucherType === 'remit-in') {
        transaction.commission = transaction.nprAmount * 0.005; // Apply 0.5% commission for 'remit-in'
      } else {
        transaction.commission = undefined; // No commission for 'remit-out'
      }
      return transaction;
    });
    setTransactions(updatedTransactions); // Update the transactions state with applied commission
    setCommissionApplied(true); // Set flag to true after applying commission
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Voucher Type</label>
          <select
            value={voucherType}
            onChange={(e) => setVoucherType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="remit-out">Remit Out</option>
            <option value="remit-in">Remit In</option>
          </select>
        </div>

        <CustomerForm
          value={customer}
          onChange={setCustomer}
          isStaffVoucher={voucherType === 'staff'}
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
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
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
