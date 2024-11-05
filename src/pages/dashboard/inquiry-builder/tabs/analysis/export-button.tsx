import React, { useState } from 'react';
import { faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { GetInquiryResponsesQuery } from '@/graphql/graphql';
import { exportToCSV, exportToJSON } from '@/utils/export-utils';
import Button from '@/components/controls/button';

interface ExportButtonProps {
  id: string;
  responses: NonNullable<GetInquiryResponsesQuery['getInquiryResponses']>;
  type: 'csv' | 'json';
  className?: string;
}

/**
 * A button component that handles exporting inquiry responses in either CSV or JSON format.
 * Provides visual feedback during export operations and handles errors gracefully.
 *
 * @param id {string} - The inquiry ID for the export
 * @param responses {InquiryResponses} - The response data to export
 * @param type {'csv' | 'json'} - The desired export format
 * @param className {string} - Optional additional CSS classes
 */
const ExportButton: React.FC<ExportButtonProps> = ({ id, responses, type, className }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (type === 'csv') {
        await exportToCSV(id, responses);
      } else {
        await exportToJSON(id, responses);
      }
    } catch (error) {
      console.error(`Error exporting ${type.toUpperCase()}:`, error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      iconLeft={isExporting ? faSpinner : faDownload}
      className={className}
      variant="primary"
      size="medium"
    >
      {isExporting ? `Exporting ${type.toUpperCase()}...` : `Export ${type.toUpperCase()}`}
    </Button>
  );
};

export default ExportButton;
