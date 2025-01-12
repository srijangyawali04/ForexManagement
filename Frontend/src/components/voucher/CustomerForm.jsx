import React, { useState, useEffect } from 'react';

export function CustomerForm({ value, onChange, isStaffVoucher }) {
  const [errors, setErrors] = useState({});
  const [initialValues, setInitialValues] = useState({
    name: '',
    passportNo: '',
    address: '',
    mobileNo: '',
    itrsCode: ''
  });

  // Initialize form values if provided via props
  useEffect(() => {
    if (value) {
      setInitialValues({
        name: value.name || '',
        passportNo: value.passportNo || '',
        address: value.address || '',
        mobileNo: value.mobileNo || '',
        itrsCode: value.itrsCode || ''
      });
    }
  }, [value]);

  const handleChange = (field, fieldValue) => {
    // Update the field value in the parent component
    onChange({
      ...initialValues,
      [field]: fieldValue,
    });

    // Clear error if the field is no longer empty
    if (fieldValue.trim() !== '') {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleBlur = (field, fieldValue) => {
    // Set error if the field is empty
    if (fieldValue.trim() === '') {
      setErrors((prev) => ({ ...prev, [field]: true }));
    }
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
            value={initialValues.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={(e) => handleBlur('name', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">This field is required.</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {isStaffVoucher ? 'Staff Code' : 'Passport No'}
          </label>
          <input
            type="text"
            value={initialValues.passportNo}
            onChange={(e) => handleChange('passportNo', e.target.value)}
            onBlur={(e) => handleBlur('passportNo', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors.passportNo ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            required
          />
          {errors.passportNo && <p className="text-red-500 text-sm">This field is required.</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            value={initialValues.address}
            onChange={(e) => handleChange('address', e.target.value)}
            onBlur={(e) => handleBlur('address', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            required
          />
          {errors.address && <p className="text-red-500 text-sm">This field is required.</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile No</label>
          <input
            type="text"
            value={initialValues.mobileNo}
            onChange={(e) => handleChange('mobileNo', e.target.value)}
            onBlur={(e) => handleBlur('mobileNo', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors.mobileNo ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            required
          />
          {errors.mobileNo && <p className="text-red-500 text-sm">This field is required.</p>}
        </div>
        {!isStaffVoucher && (
          <div>
            <label className="block text-sm font-medium text-gray-700">ITRS Code</label>
            <input
              type="text"
              value={initialValues.itrsCode}
              onChange={(e) => handleChange('itrsCode', e.target.value)}
              onBlur={(e) => handleBlur('itrsCode', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${
                errors.itrsCode ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            />
            {errors.itrsCode && <p className="text-red-500 text-sm">This field is required.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
