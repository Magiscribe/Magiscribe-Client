import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import { InquiryResponseFilters } from '@/graphql/graphql';
import { useAnalysisFilters } from '@/contexts/AnalysisFilterContext';
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

interface FilterControlsProps {
  responseCount?: number;
}

const FilterControls: React.FC<FilterControlsProps> = ({ responseCount = 0 }) => {
  const { filters, setFilters, hasActiveFilters, clearFilters } = useAnalysisFilters();
  
  const [nameFilter, setNameFilter] = useState<string>(filters.name?.contains ?? '');
  const [emailFilter, setEmailFilter] = useState<string>(filters.email?.contains ?? '');

  // Helper to convert timestamp to YYYY-MM-DD in local time
  const formatDateForInput = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-CA'); // en-CA locale gives YYYY-MM-DD format
  };

  const [startDate, setStartDate] = useState<string>(
    filters.createdAt?.gte ? formatDateForInput(filters.createdAt.gte) : '',
  );
  const [endDate, setEndDate] = useState<string>(
    filters.createdAt?.lte ? formatDateForInput(filters.createdAt.lte) : '',
  );

  useEffect(() => {
    setNameFilter(filters.name?.contains ?? '');
    setEmailFilter(filters.email?.contains ?? '');
    setStartDate(filters.createdAt?.gte ? formatDateForInput(filters.createdAt.gte) : '');
    setEndDate(filters.createdAt?.lte ? formatDateForInput(filters.createdAt.lte) : '');
  }, [filters]);

  const handleApplyFilter = () => {
    const newFilters: InquiryResponseFilters = {};

    if (nameFilter) {
      newFilters.name = { contains: nameFilter };
    }

    if (emailFilter) {
      newFilters.email = { contains: emailFilter };
    }

    if (startDate || endDate) {
      newFilters.createdAt = {};

      if (startDate) {
        const startDateTime = new Date(`${startDate}T00:00:00`);
        newFilters.createdAt.gte = startDateTime.getTime();
      }

      if (endDate) {
        const endDateTime = new Date(`${endDate}T23:59:59.999`);
        newFilters.createdAt.lte = endDateTime.getTime();
      }
    }

    setFilters(newFilters);
  };

  const handleClearFilter = () => {
    setNameFilter('');
    setEmailFilter('');
    setStartDate('');
    setEndDate('');
    clearFilters();
  };

  return (
    <div className="border-2 border-slate-300 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-700">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="relative w-64">
              <Input
                name="name-filter"
                type="text"
                placeholder="Filter by name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="pl-10"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
              />
            </div>

            <div className="relative w-64">
              <Input
                name="email-filter"
                type="text"
                placeholder="Filter by email..."
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                className="pl-10"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-48">
                <Input
                  name="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="dark:[&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>

              <span className="text-slate-700 dark:text-white">to</span>

              <div className="w-48">
                <Input
                  name="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="dark:[&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
            </div>

            {/* Response Count Display */}
            <div className="flex items-center px-3 py-2 bg-slate-100 dark:bg-slate-600 rounded-md">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {responseCount} Response{responseCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleApplyFilter} icon={faFilter} variant="primary" size="medium">
              Filter
            </Button>
            {hasActiveFilters && (
              <Button onClick={handleClearFilter} variant="secondary" size="medium">
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
