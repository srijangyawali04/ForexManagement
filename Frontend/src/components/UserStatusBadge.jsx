import React from 'react';

export default function UserStatusBadge({ status, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center px-2 text-xs leading-5 font-semibold rounded-full cursor-pointer min-w-[70px] text-center ${
        status === 'Enabled'
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-red-100 text-red-800 hover:bg-red-200'
      }`}
    >
      {status}
    </button>
  );
}
