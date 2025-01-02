import React, { useState } from 'react';
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

  const handleSubmit = () => {
    console.log('Customer:', customer);
    console.log('Transactions:', transactions);

    if (!authState || !customer || transactions.length === 0) {
      console.log('Form is incomplete');
      return;
    }

    const totalAmount = transactions.reduce((sum, t) => sum + t.nprAmount, 0);
    const commission = voucherType === 'remit-in'
      ? transactions.reduce((sum, t) => sum + (t.commission || 0), 0)
      : 0;

    const newVoucher = {
      id: Math.random().toString(36).substr(2, 9),
      type: voucherType,
      voucherNo: generateVoucherNumber(),
      date: new Date(),
      customer,
      transactions,
      totalAmount,
      netTotal: voucherType === 'remit-in' ? totalAmount - commission : totalAmount,
      createdBy: authState?.staffName || 'Unknown',
      travelOrderRef: voucherType === 'staff' ? `HRMD...${Math.random().toString(36).slice(2, 8)}` : undefined,
      status: 'pending',
      createdAt: new Date(),
    };

    console.log('Generated Voucher:', newVoucher);
    setPreviewVoucher(newVoucher);
    setShowPreview(true);
  };

  const handleGenerate = () => {
    if (previewVoucher) {
      onSubmit(previewVoucher);
      setCustomer(null);
      setTransactions([]);
      setShowPreview(false);
      setPreviewVoucher(null);
    }
  };

  const handlePrint = () => {
    window.print();
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
            <option value="staff">Staff</option>
          </select>
        </div>

        <CustomerForm
          value={customer}
          onChange={setCustomer}
          isStaffVoucher={voucherType === 'staff'}
        />

        <TransactionForm
          transactions={transactions}
          onChange={(updatedTransactions) => {
            // Update transactions and handle commission logic here
            const transactionsWithCommission = updatedTransactions.map((transaction) => {
              if (voucherType === 'remit-in') {
                transaction.commission = transaction.nprAmount * 0.005; // Apply 0.5% commission
              } else {
                transaction.commission = undefined; // No commission for remit-out or staff
              }
              return transaction;
            });
            setTransactions(transactionsWithCommission);
          }}
          voucherType={voucherType}
        />

        <button
          type="button"
          disabled={!customer || transactions.length === 0}
          onClick={() => {
            console.log('Preview Voucher Button Clicked');
            handleSubmit();
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
