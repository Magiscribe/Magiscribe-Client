import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { GetInquiryResponsesQuery } from '@/graphql/graphql';

interface ExportJSONProps {
  id: string;
  responses: NonNullable<GetInquiryResponsesQuery['getInquiryResponses']>;
}

const ExportJSON: React.FC<ExportJSONProps> = ({ id, responses }) => {
  const handleExport = () => {
    const dataExport = {
      responses,
    };

    // Create a Blob with the JSON data
    const blob = new Blob([JSON.stringify(dataExport, null, 2)], { type: 'application/json' });

    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = `inquiry-data-${id}.json`;

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
      Export JSON
    </button>
  );
};

export default ExportJSON;
