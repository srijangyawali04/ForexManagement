import React, { useState } from 'react';
import { Calendar, CalendarDays, DollarSign, FileText, FileSpreadsheet, X } from 'lucide-react';

const CURRENCIES = [
  { code: 'all', name: 'All Currencies' },
  { code: 'USD', name: 'US Dollar (USD)' },
  { code: 'EUR', name: 'Euro (EUR)' },
  { code: 'GBP', name: 'British Pound (GBP)' },
  { code: 'JPY', name: 'Japanese Yen (JPY)' },
  { code: 'AUD', name: 'Australian Dollar (AUD)' },
  { code: 'CAD', name: 'Canadian Dollar (CAD)' },
  { code: 'CHF', name: 'Swiss Franc (CHF)' },
  { code: 'CNY', name: 'Chinese Yuan (CNY)' },
  { code: 'INR', name: 'Indian Rupee (INR)' },
];

const VOUCHER_TYPES = [
  { code: 'all', name: 'All Types' },
  { code: 'remit-in', name: 'Remit In' },
  { code: 'remit-out', name: 'Remit Out' },
];

export const TransactionDateFilter = ({ onFilterChange }) => {
  const [filterType, setFilterType] = useState('today');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [selectedCurrency, setSelectedCurrency] = useState('all');
  const [selectedVoucherType, setSelectedVoucherType] = useState('all');
  const [showReport, setShowReport] = useState(false);

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    if (type === 'today') {
      const today = new Date().toISOString().split('T')[0];
      onFilterChange({
        dates: today,
        currency: selectedCurrency,
        voucherType: selectedVoucherType,
      });
    } else {
      onFilterChange({
        dates: dateRange,
        currency: selectedCurrency,
        voucherType: selectedVoucherType,
      });
    }
  };

  const handleDateChange = (field, value) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    if (filterType === 'specific') {
      onFilterChange({
        dates: newDateRange,
        currency: selectedCurrency,
        voucherType: selectedVoucherType,
      });
    }
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    onFilterChange({
      dates: filterType === 'today' ? new Date().toISOString().split('T')[0] : dateRange,
      currency,
      voucherType: selectedVoucherType,
    });
  };

  const handleVoucherTypeChange = (type) => {
    setSelectedVoucherType(type);
    onFilterChange({
      dates: filterType === 'today' ? new Date().toISOString().split('T')[0] : dateRange,
      currency: selectedCurrency,
      voucherType: type,
    });
  };

  const handleCreateReport = () => {
    setShowReport(true);
  };

  const handleClearFilter = (type) => {
    if (type === 'currency') {
      handleCurrencyChange('all');
    } else {
      handleVoucherTypeChange('all');
    }
  };

  const getActiveFilters = () => {
    const filters = [];

    if (selectedCurrency !== 'all') {
      filters.push({
        type: 'currency',
        label: CURRENCIES.find((c) => c.code === selectedCurrency)?.name,
      });
    }

    if (selectedVoucherType !== 'all') {
      filters.push({
        type: 'voucherType',
        label: VOUCHER_TYPES.find((t) => t.code === selectedVoucherType)?.name,
      });
    }

    return filters;
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => handleFilterTypeChange('today')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                filterType === 'today' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Today
            </button>
            <button
              onClick={() => handleFilterTypeChange('specific')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                filterType === 'specific' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Specific Date
            </button>
          </div>

          {filterType === 'specific' && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
            <div>
              <label htmlFor="currency" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="w-4 h-4" />
                Currency
              </label>
              <select
                id="currency"
                value={selectedCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="voucherType" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FileText className="w-4 h-4" />
                Voucher Type
              </label>
              <select
                id="voucherType"
                value={selectedVoucherType}
                onChange={(e) => handleVoucherTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                {VOUCHER_TYPES.map((type) => (
                  <option key={type.code} value={type.code}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3">
              {activeFilters.map((filter) => (
                <div key={filter.type} className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  <span>{filter.label}</span>
                  <button onClick={() => handleClearFilter(filter.type)} className="p-0.5 hover:bg-blue-100 rounded-full">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={handleCreateReport}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Create Report
            </button>
          </div>
        </div>
      </div>

      {showReport && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Transaction Report
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Date Range</div>
              <div className="text-sm text-gray-700">{filterType === 'today' ? 'Today' : `${dateRange.startDate} to ${dateRange.endDate}`}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Currency</div>
              <div className="text-sm text-gray-700">{CURRENCIES.find((c) => c.code === selectedCurrency)?.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Voucher Type</div>
              <div className="text-sm text-gray-700">{VOUCHER_TYPES.find((t) => t.code === selectedVoucherType)?.name}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
