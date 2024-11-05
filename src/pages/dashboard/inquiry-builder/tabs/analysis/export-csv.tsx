import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { GetInquiryResponsesQuery } from '@/graphql/graphql';

interface ExportCSVProps {
  id: string;
  responses: NonNullable<GetInquiryResponsesQuery['getInquiryResponses']>;
}

interface UserResponse {
  userId: string;
  userDetails?: {
    name?: string;
    email?: string;
  };
  [key: string]: any;
}

const sanitizeText = (text: string): string => {
  return text.replace(/[,\n"]/g, ' ').trim();
};

const formatRatingResponse = (response: { text: string; ratings?: string[] | null }): string => {
  if (!response.ratings || response.ratings.length === 0) {
    return sanitizeText(response.text);
  }

  const textPart = sanitizeText(response.text);
  const ratingPart = response.ratings.join(' - ');

  if (textPart) {
    return `${ratingPart} - ${textPart}`;
  }

  return ratingPart;
};

const escapeField = (field: string): string => {
  if (field === null || field === undefined) return '';
  const stringField = String(field);
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
};

const ExportCSV: React.FC<ExportCSVProps> = ({ id, responses }) => {
  const handleExport = () => {
    // Get all unique questions and check for userDetails
    const questions = new Map<string, string>();
    let hasUserDetails = false;

    responses.forEach((response) => {
      const history = response.data.history;

      if (response.data.userDetails?.name || response.data.userDetails?.email) {
        hasUserDetails = true;
      }

      history.forEach((node) => {
        if (node.type === 'question') {
          const questionText = sanitizeText(node.data.text);
          questions.set(questionText, questionText);
        }
      });
    });

    // Create headers
    const headers = ['userId'];
    if (hasUserDetails) {
      headers.push('name', 'email');
    }
    headers.push(...Array.from(questions.values()));

    // Create CSV content
    let csvContent = headers.map(escapeField).join(',') + '\n';

    // Add rows
    responses.forEach((response) => {
      const row: UserResponse = {
        userId: response.userId as string,
      };

      if (hasUserDetails) {
        row.userDetails = {
          name: response.data.userDetails?.name || '',
          email: response.data.userDetails?.email || '',
        };
      }

      // Initialize all question columns as empty
      questions.forEach((_, questionText) => {
        row[questionText] = '';
      });

      // Fill in answers
      response.data.history.forEach((node) => {
        if (node.type === 'question') {
          const questionText = sanitizeText(node.data.text);
          row[questionText] = formatRatingResponse(node.data.response);
        }
      });

      // Create row content
      const rowValues = [row.userId];
      if (hasUserDetails) {
        rowValues.push(row.userDetails?.name || '', row.userDetails?.email || '');
      }
      headers.slice(hasUserDetails ? 3 : 1).forEach((question) => {
        rowValues.push(row[question] || '');
      });

      csvContent += rowValues.map(escapeField).join(',') + '\n';
    });

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inquiry-responses-${id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
      Export CSV
    </button>
  );
};

export default ExportCSV;
