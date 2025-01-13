import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { fetchLoggedInUser } from '../../services/api'; // Import the function to fetch logged-in user
import { VoucherPreview } from './VoucherPreview'; // Import VoucherPreview
import { fetchVouchers } from '../../services/api';

const VoucherList = ({ onVerify }) => {
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await fetchLoggedInUser();
        setLoggedInUser(userInfo); // Set logged-in user information
      } catch (error) {
        console.error('Failed to fetch logged-in user:', error);
      }
    };

    fetchUser();
  }, []);

  // Fetch vouchers from the backend
  useEffect(() => {
    const fetchVoucherData = async () => {
      try {
        const data = await fetchVouchers(); // Call fetchVouchers to get the data
        setVouchers(data.data || []); // Ensure that data is in the expected format
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    };

    fetchVoucherData();
  }, []);

  // Handle voucher click for preview
  const handleVoucherClick = (voucher) => {
    setSelectedVoucher(voucher); // Set the selected voucher
    setIsPreviewOpen(true); // Open the preview modal
  };

  // Handle closing the preview modal
  const handleClosePreview = () => {
    setSelectedVoucher(null); // Clear the selected voucher
    setIsPreviewOpen(false); // Close the modal
  };

  // Handle verify button click
  const handleVerify = (voucherNumber) => {
    // Get the current date and time for verification
    const verificationDate = new Date().toLocaleString();
    
    // Trigger the onVerify function passed as a prop from the parent
    onVerify(voucherNumber, loggedInUser.staff_name, verificationDate); // Passing the logged-in user name and date
  };

  // Check if the logged-in user is a verifier
  const isVerifier = loggedInUser?.role === 'Verifier';

  // Render each voucher with preview and verify functionality
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Voucher List</h2>
      <div className="grid gap-4">
        {vouchers.map((voucher) => (
          <div
            key={voucher.voucher_number}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
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

            {/* Display Verified By and Date if Verified */}
            {voucher.voucher_status === 'Verified' && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-semibold">Verified By: </span>{voucher.verifiedBy} on {voucher.verifiedAt}
              </div>
            )}

            <div className="flex space-x-4 mt-2">
              {/* Preview Button */}
              <button
                onClick={() => handleVoucherClick(voucher)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Preview
              </button>

              {/* Verify Button (Only visible to Verifier role) */}
              {isVerifier && voucher.voucher_status !== 'Verified' && (
                <button
                  onClick={() => handleVerify(voucher.voucher_number)} // Trigger the verify action
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Verify
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Voucher Preview Modal */}
      {isPreviewOpen && selectedVoucher && (
        <VoucherPreview
          voucher={selectedVoucher}
          onClose={handleClosePreview} // Close the modal
          onPrint={() => window.print()} // Print functionality
          onGenerate={() => console.log('Generate logic here')}
          showGenerateButton={false}
        />
      )}
    </div>
  );
};

export default VoucherList;
