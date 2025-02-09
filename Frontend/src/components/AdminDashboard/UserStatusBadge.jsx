import React, { useState } from 'react';

export default function UserStatusBadge({ status, onClick }) {
  const [remark, setRemark] = useState('');
  const [isRemarking, setIsRemarking] = useState(false);

  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };

  const handleStatusChange = () => {
    if (!remark) {
      alert('Please provide a remark before changing the status.');
      return;
    }

    onClick(status, remark);
    setRemark(''); 
    setIsRemarking(false); 
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={() => setIsRemarking(true)}
        className={`inline-flex items-center justify-center px-2 text-xs leading-5 font-semibold rounded-full cursor-pointer min-w-[70px] text-center ${
          status === 'Enabled'
            ? 'bg-green-100 text-green-800 hover:bg-green-200'
            : 'bg-red-100 text-red-800 hover:bg-red-200'
        }`}
      >
        {status}
      </button>

      {isRemarking && (
        <div className="flex flex-col space-y-2 items-center">
          <textarea
            value={remark}
            onChange={handleRemarkChange}
            className="px-3 py-2 text-xs border rounded-md border-gray-300"
            placeholder="Write a remark"
            rows={3}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleStatusChange}
              className="px-3 py-1 text-xs text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Confirm
            </button>
            <button
              onClick={() => setIsRemarking(false)}
              className="px-3 py-1 text-xs text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
