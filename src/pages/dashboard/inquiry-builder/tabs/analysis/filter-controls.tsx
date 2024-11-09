import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { InquiryResponseFilters } from '@/graphql/graphql';
import Button from '@/components/controls/button';

interface FilterControlsProps {
  onApplyFilters: (filters: InquiryResponseFilters) => void;
  hasActiveFilters: boolean;
  initialFilters: InquiryResponseFilters;
}

const FilterControls: React.FC<FilterControlsProps> = ({ onApplyFilters, hasActiveFilters, initialFilters }) => {
  const [nameFilter, setNameFilter] = useState(initialFilters.userName || '');
  const [emailFilter, setEmailFilter] = useState(initialFilters.userEmail || '');
  const [startDate, setStartDate] = useState(
    initialFilters.startDate ? new Date(initialFilters.startDate).toISOString().split('T')[0] : '',
  );
  const [endDate, setEndDate] = useState(
    initialFilters.endDate ? new Date(initialFilters.endDate - 86400000).toISOString().split('T')[0] : '',
  );

  useEffect(() => {
    setNameFilter(initialFilters.userName || '');
    setEmailFilter(initialFilters.userEmail || '');
    setStartDate(initialFilters.startDate ? new Date(initialFilters.startDate).toISOString().split('T')[0] : '');
    setEndDate(initialFilters.endDate ? new Date(initialFilters.endDate - 86400000).toISOString().split('T')[0] : '');
  }, [initialFilters]);

  const handleApplyFilter = () => {
    const filters: InquiryResponseFilters = {};

    if (nameFilter) filters.userName = nameFilter;
    if (emailFilter) filters.userEmail = emailFilter;
    if (startDate) filters.startDate = new Date(startDate).getTime();
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setDate(endDateTime.getDate() + 1);
      filters.endDate = endDateTime.getTime();
    }

    onApplyFilters(filters);
  };

  const handleClearFilter = () => {
    setNameFilter('');
    setEmailFilter('');
    setStartDate('');
    setEndDate('');
    onApplyFilters({});
  };

  return (
    <div className="space-y-4">
      {/* Name and Email Filters Row with Action Buttons */}
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type="email"
              placeholder="Filter by email..."
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleApplyFilter} iconLeft={faFilter} variant="primary" size="medium">
            Apply Filters
          </Button>
          {hasActiveFilters && (
            <Button onClick={handleClearFilter} variant="secondary" size="medium">
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Date Range Row */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FontAwesomeIcon icon={faCalendar} className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>

        <span className="text-white dark:text-gray-400">to</span>

        <div className="relative">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FontAwesomeIcon icon={faCalendar} className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
