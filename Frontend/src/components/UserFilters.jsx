import React from 'react';
import { UserPlus, Filter } from 'lucide-react';

export default function UserFilters({ statusFilter, onStatusFilterChange, onAddUser }) {
  return (
    <div className="bg-white p-4 rounded-sm shadow mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-3">
        <Filter className="h-5 w-5 text-gray-400" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="Enabled">Enabled</option>
          <option value="Disabled">Disabled</option>
        </select>
      </div>
      
      <button
        onClick={onAddUser}
        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        <UserPlus className="h-5 w-5 mr-2" />
        Add User
      </button>
    </div>
  );
}
