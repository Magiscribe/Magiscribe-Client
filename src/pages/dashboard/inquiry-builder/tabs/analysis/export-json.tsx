import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { GetInquiryResponsesQuery } from '@/graphql/graphql';
import { exportToJSON } from '@/utils/export-utils';

interface ExportJSONProps {
  id: string;
  responses: NonNullable<GetInquiryResponsesQuery['getInquiryResponses']>;
}

/**
 * A button component that triggers JSON export of inquiry responses.
 * Provides raw data export for developers or systems that need to
 * process the complete response structure. Includes loading state for
 * better UX during export processing.
 */
const ExportJSON: React.FC<ExportJSONProps> = ({ id, responses }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToJSON(id, responses);
    } catch (error) {
      console.error('Error exporting JSON:', error);
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
      {isExporting ? 'Exporting...' : 'Export JSON'}
    </button>
  );
};

export default ExportJSON;
