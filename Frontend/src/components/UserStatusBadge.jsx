import React from 'react';

export default function UserStatusBadge({ status, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
        status === 'Enabled'
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-red-100 text-red-800 hover:bg-red-200'
      }`}
    >
      {status}
    </button>
  );
}
