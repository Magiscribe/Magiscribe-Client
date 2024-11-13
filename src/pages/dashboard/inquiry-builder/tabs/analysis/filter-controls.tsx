import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import { InquiryResponseFilters } from '@/graphql/graphql';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';

interface FilterControlsProps {
  onApplyFilters: (filters: InquiryResponseFilters) => void;
  hasActiveFilters: boolean;
  initialFilters: InquiryResponseFilters;
}

const FilterControls: React.FC<FilterControlsProps> = ({ onApplyFilters, hasActiveFilters, initialFilters }) => {
  const [nameFilter, setNameFilter] = useState<string>(initialFilters.userName?.contains ?? '');
  const [emailFilter, setEmailFilter] = useState<string>(initialFilters.userEmail?.contains ?? '');

  // Helper to convert timestamp to YYYY-MM-DD in local time
  const formatDateForInput = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-CA'); // en-CA locale gives YYYY-MM-DD format
  };

  const [startDate, setStartDate] = useState<string>(
    initialFilters.createdAt?.gte ? formatDateForInput(initialFilters.createdAt.gte) : '',
  );
  const [endDate, setEndDate] = useState<string>(
    initialFilters.createdAt?.lte ? formatDateForInput(initialFilters.createdAt.lte) : '',
  );

  useEffect(() => {
    setNameFilter(initialFilters.userName?.contains ?? '');
    setEmailFilter(initialFilters.userEmail?.contains ?? '');
    setStartDate(initialFilters.createdAt?.gte ? formatDateForInput(initialFilters.createdAt.gte) : '');
    setEndDate(initialFilters.createdAt?.lte ? formatDateForInput(initialFilters.createdAt.lte) : '');
  }, [initialFilters]);

  const handleApplyFilter = () => {
    const filters: InquiryResponseFilters = {};

    if (nameFilter) {
      filters.userName = { contains: nameFilter };
    }

    if (emailFilter) {
      filters.userEmail = { contains: emailFilter };
    }

    if (startDate || endDate) {
      filters.createdAt = {};

      if (startDate) {
        const startDateTime = new Date(`${startDate}T00:00:00`);
        filters.createdAt.gte = startDateTime.getTime();
      }

      if (endDate) {
        const endDateTime = new Date(`${endDate}T23:59:59.999`);
        filters.createdAt.lte = endDateTime.getTime();
      }
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
                className="[&::-webkit-calendar-picker-indicator]:dark:invert"
              />
            </div>

            <span className="text-white">to</span>

            <div className="w-48">
              <Input
                name="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="[&::-webkit-calendar-picker-indicator]:dark:invert"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleApplyFilter} iconLeft={faFilter} variant="primary" size="medium">
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
  );
};

export default FilterControls;
