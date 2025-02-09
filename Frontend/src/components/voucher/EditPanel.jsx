import React, { useState, useEffect } from "react";
import { CreditCard, X } from "lucide-react";
import { applyVoucherCorrection ,updateVoucherStatus  } from '../../services/api';

export function EditPanel({ isOpen, onClose, onSubmit, initialData = {} }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    passportNo: "",
    address: "",
    mobileNo: "",
    voucherType: "",
    ordered: "",
    voucherStaffCode: "",
    itrsCode: "",
    visitingCountry: "",
    purposeOfVisit: "",
    sourceOfForeignCurrency: "",
    travelOrderRef: "",
  });

  const [transactions, setTransactions] = useState([{
    currency_name: "",
    exchange_rate: 0,
    fc_amount: 0,
    commission: 0,
    NPR_amount: 0,
    created_by: "",
  }]);
  console.log(initialData.voucher_status)
  const [transactionType, setTransactionType] = useState("");

  useEffect(() => {
    if (initialData) {
      setCustomerInfo({
        name: initialData.customer_name || "",
        passportNo: initialData.passport_number || "",
        address: initialData.customer_address || "",
        mobileNo: initialData.mobile_number || "",
        ordered: initialData.ordered_by || "",
        voucherStaffCode: initialData.createdBy || "",
        itrsCode: initialData.itrs_code || "",
        visitingCountry: initialData.visiting_country || "",
        purposeOfVisit: initialData.purpose_of_visit || "",
        sourceOfForeignCurrency: initialData.source_of_foreign_currency || "",
        travelOrderRef: initialData.travel_order_ref_number || "",
      });

      if (initialData.transactions?.length > 0) {
        setTransactions(initialData.transactions.map(t => ({
          currency_name: t.currency_name || "",
          exchange_rate: t.exchange_rate || 0,
          fc_amount: t.fc_amount || 0,
          commission: t.commission || 0,
          NPR_amount: t.NPR_amount || 0,
          created_by: t.created_by || "",
        })));
        setTransactionType(initialData.transactions[0].transaction_type || "");
      }
    }
  }, [initialData]);

  const handleCustomerChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleFCAmountChange = (index, e) => {
    const fcAmount = parseFloat(e.target.value) || 0;
    const exchangeRate = parseFloat(transactions[index].exchange_rate) || 0;
    const nprAmount = fcAmount * exchangeRate;
    
    // Check if existing commission is 0
    const commission = transactions[index].commission === 0 ? 0 : nprAmount * 0.005;

    const updatedTransactions = transactions.map((transaction, i) => {
      if (i === index) {
        return {
          ...transaction,
          fc_amount: fcAmount,
          NPR_amount: nprAmount,
          commission: commission
        };
      }
      return transaction;
    });
    setTransactions(updatedTransactions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    try {
      const correctionData = {
        customer_name: customerInfo.name,
        passport_number: customerInfo.passportNo,
        customer_address: customerInfo.address,
        mobile_number: customerInfo.mobileNo,
        ordered_by: customerInfo.ordered,
        itrs_code: customerInfo.itrsCode,
        visiting_country: customerInfo.visitingCountry,
        purpose_of_visit: customerInfo.purposeOfVisit,
        source_of_foreign_currency: customerInfo.sourceOfForeignCurrency,
        travel_order_ref_number: customerInfo.travelOrderRef,
        transactions: transactions,
        voucher_status: "Pending" 
      };
  
      await applyVoucherCorrection(initialData.voucher_number, correctionData);
      
      onSubmit(correctionData);
      setShowConfirmation(false);
      onClose();
      
      window.location.reload();
    } catch (error) {
      alert('Failed to apply corrections. Please try again.');
      setShowConfirmation(false);
    }
  };
  

  const getCustomerFields = () => {
    const commonFields = [
      { label: "Name *", name: "name" },
      { label: "Passport No *", name: "passportNo" },
      { label: "Address *", name: "address" },
      { label: "Mobile No *", name: "mobileNo" },
      { label: "ITRS Code (Optional)", name: "itrsCode" },
      { label: "Ordered By *", name: "ordered" },
    ];

    switch (transactionType) {
      case "remit-out":
        return [...commonFields, 
          { label: "Visiting Country *", name: "visitingCountry" },
          { label: "Purpose of Visit *", name: "purposeOfVisit" }
        ];
      case "remit-in":
        return [...commonFields,
          { label: "Source of Foreign Currency *", name: "sourceOfForeignCurrency" }
        ];
      case "staff-voucher":
        return [...commonFields,
          { label: "Staff Code *", name: "voucherStaffCode" },
          { label: "Travel Order Ref. No. *", name: "travelOrderRef" }
        ];
      default:
        return commonFields;
    }
  };

  const getTransactionFields = () => {
    const commonFields = [
      { label: "Currency Name", name: "currency_name", readOnly: true },
      { label: "Exchange Rate", name: "exchange_rate", type: "number", readOnly: true },
      { label: "FC Amount", name: "fc_amount", type: "number", readOnly: false },
      { label: "NPR Amount", name: "NPR_amount", type: "number", readOnly: true },
    ];

    if (transactionType === "remit-in" || transactionType === "") {
      return [...commonFields, { label: "Commission", name: "commission", type: "number", readOnly: true }];
    }

    return commonFields;
  };

  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Confirm Changes</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to apply these corrections?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowConfirmation(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {showConfirmation && <ConfirmationModal />}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Edit Transaction
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getCustomerFields().map(({ label, name }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <input
                      type="text"
                      name={name}
                      value={customerInfo[name]}
                      onChange={handleCustomerChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Information</h3>
              {transactions.map((transaction, index) => (
                <div key={index} className="mb-6 p-4 border rounded-lg">
                  <h4 className="font-medium mb-4">Transaction {index + 1}</h4>
                  <div className="flex flex-wrap gap-4 items-center">
                    {getTransactionFields().map(({ label, name, type = "text", readOnly }) => (
                      <div key={name} className="flex items-center">
                        <label className="text-sm font-medium text-gray-700 mr-2 whitespace-nowrap">{label}:</label>
                        <input
                          type={type}
                          name={name}
                          value={transaction[name]}
                          onChange={name === 'fc_amount' ? 
                            (e) => handleFCAmountChange(index, e) : 
                            undefined}
                          readOnly={readOnly}
                          className={`w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 
                            focus:ring-blue-500 text-sm ${readOnly ? 'bg-gray-100' : ''}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
