import React, { useState, useEffect } from 'react';
import { getNames } from 'country-list';
import Select from 'react-select';

export function CustomerForm({ value, onChange, voucherType }) {
  const countries = getNames();
  const [errors, setErrors] = useState({});
  const [initialValues, setInitialValues] = useState({
    name: '',
    passportNo: '',
    address: '',
    mobileNo: '',
    approved: '',
    travelOrderRef: '',
    voucherStaffCode: '',
    itrsCode: '',
    visitingCountry: '',
    purposeOfVisit: '',
    sourceOfForeignCurrency: '',
  });

  // Refresh initialValues whenever voucherType changes
  useEffect(() => {
    const updatedValues = {
      name: '',
      passportNo: '',
      address: '',
      mobileNo: '',
      approved: '',
      travelOrderRef: '',
      voucherStaffCode: '',
      itrsCode: '',
      visitingCountry: '',
      purposeOfVisit: '',
      sourceOfForeignCurrency: '',
      ...value,
    };
    setInitialValues(updatedValues);
  }, [voucherType, value]);

  const handleChange = (field, fieldValue) => {
    const updatedValues = { ...initialValues, [field]: fieldValue };
    setInitialValues(updatedValues);
    onChange(updatedValues);

    // Set errors only if the field is required and is empty
    if (fieldValue.trim() !== '') {
      setErrors((prev) => ({ ...prev, [field]: false }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field, fieldValue) => {
    if (fieldValue.trim() === '' && field !== 'itrsCode') {
      setErrors((prev) => ({ ...prev, [field]: true }));
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Customer Information</h3>
      <div className="grid grid-cols-4 gap-x-5 gap-y-4  ">
        {/* Customer/Staff Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {voucherType === 'staff' ? 'Staff Name' : 'Customer Name'} *
          </label>
          <input
            type="text"
            value={initialValues.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={(e) => handleBlur('name', e.target.value)}
            className={`mt-1 pl-2 block w-full h-9 rounded-md border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">This field is required.</p>}
        </div>

        {/* Passport Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Passport No *</label>
          <input
            type="text"
            value={initialValues.passportNo}
            onChange={(e) => handleChange('passportNo', e.target.value)}
            onBlur={(e) => handleBlur('passportNo', e.target.value)}
            className={`mt-1 pl-2 block w-full h-9 rounded-md border ${
              errors.passportNo ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            required
          />
          {errors.passportNo && <p className="text-red-500 text-sm">This field is required.</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Address *</label>
          <input
            type="text"
            value={initialValues.address}
            onChange={(e) => handleChange('address', e.target.value)}
            onBlur={(e) => handleBlur('address', e.target.value)}
            className={`mt-1 pl-2 block w-full h-9 rounded-md border ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            required
          />
          {errors.address && <p className="text-red-500 text-sm">This field is required.</p>}
        </div>
        

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile No *</label>
          <input
            type="text"
            value={initialValues.mobileNo}
            onChange={(e) => handleChange('mobileNo', e.target.value)}
            onBlur={(e) => handleBlur('mobileNo', e.target.value)}
            className={`mt-1 pl-2 block w-full h-9 rounded-md border ${
              errors.mobileNo ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            required
          />
          {errors.mobileNo && <p className="text-red-500 text-sm">This field is required.</p>}
        </div>

        {/* Conditional Fields */}
        {voucherType === 'remit-in' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Source of Foreign Currency *
            </label>
            <input
              type="text"
              value={initialValues.sourceOfForeignCurrency}
              onChange={(e) => handleChange('sourceOfForeignCurrency', e.target.value)}
              onBlur={(e) => handleBlur('sourceOfForeignCurrency', e.target.value)}
              className={`mt-1 pl-2 block w-full h-9 rounded-md border ${
                errors.sourceOfForeignCurrency ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
              required
            />
            {errors.sourceOfForeignCurrency && (
              <p className="text-red-500 text-sm">This field is required.</p>
            )}
          </div>
        )}
        {voucherType === 'remit-out' && (
          <>
            <div>
              <label className="  block text-sm font-medium text-gray-700">
                Visiting Country *
              </label>
              <Select
                value={{ label: initialValues.visitingCountry, value: initialValues.visitingCountry }}
                onChange={(selectedOption) => handleChange('visitingCountry', selectedOption.value)}
                onBlur={(e) => handleBlur('visitingCountry', e.target.value)}
                options={countries.map(country => ({ label: country, value: country }))}
                classNamePrefix="react-select"
                isSearchable
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Purpose of Visit *</label>
              <input
                type="text"
                value={initialValues.purposeOfVisit}
                onChange={(e) => handleChange('purposeOfVisit', e.target.value)}
                onBlur={(e) => handleBlur('purposeOfVisit', e.target.value)}
                className={`mt-1 pl-2 block w-full h-9 rounded-md border ${
                  errors.purposeOfVisit ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                required
              />
              {errors.purposeOfVisit && (
                <p className="text-red-500 text-sm">This field is required.</p>
              )}
            </div>
          </>
        )}

        {voucherType === 'staff-voucher' && (
          <>
            <div >
              <label className="block text-sm font-medium text-gray-700">Staff Code *</label>
              <input
                type="text"
                value={initialValues.voucherStaffCode}
                onChange={(e) => handleChange('voucherStaffCode', e.target.value)}
                onBlur={(e) => handleBlur('voucherStaffCode', e.target.value)}
                className={`mt-1 pl-2 block w-full h-9 rounded-md border ${
                  errors.voucherStaffCode ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                required
              />
              {errors.voucherStaffCode && (
                <p className="text-red-500 text-sm">This field is required.</p>
              )}
            </div>

            <div >
              <label className="block text-sm font-medium text-gray-700">
                Travel Order Ref. No. *
              </label>
              <input
                type="text"
                value={initialValues.travelOrderRef}  
                onChange={(e) => handleChange('travelOrderRef', e.target.value)}  
                onBlur={(e) => handleBlur('travelOrderRef', e.target.value)}
                className={`mt-1 pl-2 block w-full h-9 rounded-md border ${
                  errors.travelOrderRef ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                required
              />
              {errors.travelOrderRef && (
                <p className="text-red-500 text-sm">This field is required.</p>
              )}
            </div>

          </>
        )}


        {/* ITRS Code */}
        <div >
          <label className="block text-sm font-medium text-gray-700">
            ITRS Code (Optional)
          </label>
          <input
            type="text"
            value={initialValues.itrsCode}
            onChange={(e) => handleChange('itrsCode', e.target.value)}
            onBlur={(e) => handleBlur('itrsCode', e.target.value)}
            className={`mt-1 pl-2 block w-full h-9 rounded-md border ${
              errors.itrsCode ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
          />
        </div>

        {/* Approved By */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Approved By *</label>
          <input
            type="text"
            value={initialValues.approved}
            onChange={(e) => handleChange('approved', e.target.value)}
            onBlur={(e) => handleBlur('approved', e.target.value)}
            placeholder="Designation, Staff Name" // Added placeholder
            className={`mt-1 pl-2 block w-full h-9 rounded-md border ${
              errors.approved ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            required
          />
          {errors.approved && <p className="text-red-500 text-sm">This field is required.</p>}
        </div>



      </div>
    </div>
  );
}
