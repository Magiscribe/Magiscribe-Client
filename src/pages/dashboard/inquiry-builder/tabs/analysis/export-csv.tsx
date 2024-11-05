import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { GetInquiryResponsesQuery } from '@/graphql/graphql';
import { exportToCSV } from '@/utils/export-utils';

interface ExportCSVProps {
  id: string;
  responses: NonNullable<GetInquiryResponsesQuery['getInquiryResponses']>;
}

/**
 * A button component that triggers CSV export of inquiry responses.
 * Provides a familiar download interface for users who want to analyze
 * response data in spreadsheet software. Includes loading state for
 * better UX during export processing.
 */
const ExportCSV: React.FC<ExportCSVProps> = ({ id, responses }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToCSV(id, responses);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg transition-colors ${
        isExporting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-600'
      }`}
    >
      <FontAwesomeIcon
        icon={isExporting ? faSpinner : faDownload}
        className={`w-4 h-4 ${isExporting ? 'animate-spin' : ''}`}
      />
      {isExporting ? 'Exporting...' : 'Export CSV'}
    </button>
  );
};

export default ExportCSV;
