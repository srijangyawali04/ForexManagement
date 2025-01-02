import React from 'react';
import { VoucherTemplate } from './VoucherTemplate';

export function VoucherPreview({ 
  voucher, 
  onClose, 
  onPrint, 
  onGenerate, 
  showGenerateButton = false 
}) {
  console.log('VoucherPreview rendered with voucher:', voucher); // Debugging the voucher data passed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Voucher Preview</h2>
          <div className="space-x-2">
            {showGenerateButton && onGenerate && (
              <button
                onClick={onGenerate}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
              >
                Generate Voucher
              </button>
            )}
            <button
              onClick={onPrint}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
        <div className="p-6">
          <VoucherTemplate voucher={voucher} />
        </div>
      </div>
    </div>
  );
}
