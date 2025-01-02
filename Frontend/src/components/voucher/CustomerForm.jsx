import React from 'react';

export function CustomerForm({ value, onChange, isStaffVoucher }) {
  const handleChange = (field, fieldValue) => {
    onChange({
      ...(value || {
        name: '',
        passportNo: '',
        address: '',
        mobileNo: '',
        itrsCode: '',
      }),
      [field]: fieldValue,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Customer Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {isStaffVoucher ? 'Staff Name' : 'Customer Name'}
          </label>
          <input
            type="text"
            value={value?.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {isStaffVoucher ? 'Staff Code' : 'Passport No'}
          </label>
          <input
            type="text"
            value={value?.passportNo || ''}
            onChange={(e) => handleChange('passportNo', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            value={value?.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile No</label>
          <input
            type="text"
            value={value?.mobileNo || ''}
            onChange={(e) => handleChange('mobileNo', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        {!isStaffVoucher && (
          <div>
            <label className="block text-sm font-medium text-gray-700">ITRS Code</label>
            <input
              type="text"
              value={value?.itrsCode || ''}
              onChange={(e) => handleChange('itrsCode', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
