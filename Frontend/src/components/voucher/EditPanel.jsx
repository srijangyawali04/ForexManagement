import React, { useState } from "react";
import { CreditCard, X } from "lucide-react";

export function EditPanel({ isOpen, onClose, onSubmit, initialData = {} }) {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    passportNo: "",
    address: "",
    mobileNo: "",
    ordered: "",
    voucherStaffCode: "",
    itrsCode: "",
    visitingCountry: "",
    purposeOfVisit: "",
    sourceOfForeignCurrency: "",
    ...initialData,
  });

  const [transactionInfo, setTransactionInfo] = useState({
    currency_name: "",
    exchange_rate: 0,
    fc_amount: 0,
    commission: null,
    NPR_amount: 0,
    created_by: "",
        ...initialData,
  });

  const handleCustomerChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleTransactionChange = (e) => {
    setTransactionInfo({ ...transactionInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...customerInfo, ...transactionInfo });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
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
            {/* Customer Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Name", name: "name" },
                  { label: "Passport No", name: "passportNo" },
                  { label: "Address", name: "address" },
                  { label: "Mobile No", name: "mobileNo" },
                  { label: "Voucher Staff Code", name: "voucherStaffCode" },
                  { label: "ITRS Code", name: "itrsCode" },
                  { label: "Visiting Country", name: "visitingCountry" },
                  { label: "Purpose of Visit", name: "purposeOfVisit" },
                  { label: "Source of Foreign Currency", name: "sourceOfForeignCurrency" },
                ].map(({ label, name }) => (
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

            {/* Transaction Information Section */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Currency Name", name: "currency_name" },
                  { label: "Exchange Rate", name: "exchange_rate", type: "number" },
                  { label: "FC Amount", name: "fc_amount", type: "number" },
                  { label: "Commission", name: "commission", type: "number" },
                  { label: "NPR Amount", name: "NPR_amount", type: "number" },
                ].map(({ label, name, type = "text" }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={transactionInfo[name] || ""}
                      onChange={handleTransactionChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
