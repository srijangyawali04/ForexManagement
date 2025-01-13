import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { VoucherPreview } from './voucher/VoucherPreview'; // Import VoucherPreview

const apiUrl = import.meta.env.VITE_API_URL;

const VoucherList = () => {
  const { user } = useAuth();
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Fetch vouchers from the backend
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/voucher`);
        const data = await response.json();
        setVouchers(data.data); // Assuming the response contains the vouchers array
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    };

    fetchVouchers();
  }, []);

  // Handle voucher click
  const handleVoucherClick = (voucher) => {
    setSelectedVoucher(voucher);
    setIsPreviewOpen(true); // Open the preview modal
  };

  // Handle closing the preview
  const handleClosePreview = () => {
    setIsPreviewOpen(false); // Close the preview modal
  };

  const handlePrint = () => {
    console.log('Print voucher:', selectedVoucher);
    // Add your print logic here
  };

  const handleGenerate = () => {
    console.log('Generate voucher:', selectedVoucher);
    // Add your generate voucher logic here
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Voucher List</h2>
      <div className="grid gap-4">
        {vouchers.map((voucher) => (
          <div
            key={voucher.voucher_number}
            className="bg-white p-4 rounded-lg shadow border border-gray-200 cursor-pointer hover:bg-gray-100"
            onClick={() => handleVoucherClick(voucher)} // Open preview on click
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">#{voucher.voucher_number}</span>
                  <span className="text-sm text-gray-500">({voucher.voucher_status})</span>
                </div>
                <div className="text-lg font-semibold">Customer Name: {voucher.customer_name}</div>
                <div className="text-sm text-gray-500">
                  Created by {voucher.createdBy} on {new Date(voucher.voucher_date).toLocaleString()}
                </div>
              </div>
              <div
                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
                  voucher.voucher_status === 'Verified'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {voucher.voucher_status === 'Verified' ? <CheckCircle size={16} /> : <Clock size={16} />}
                <span className="capitalize">{voucher.voucher_status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Voucher Preview Modal */}
      {isPreviewOpen && selectedVoucher && (
        <VoucherPreview
          voucher={selectedVoucher}
          onClose={handleClosePreview}
          onPrint={handlePrint}
          onGenerate={handleGenerate}
          showGenerateButton={false}
        />
      )}
    </div>
  );
};

export default VoucherList;
