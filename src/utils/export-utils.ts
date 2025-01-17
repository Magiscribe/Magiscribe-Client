import { GetInquiryResponsesQuery } from '@/graphql/graphql';

type InquiryResponses = NonNullable<GetInquiryResponsesQuery['getInquiryResponses']>;

/**
 * Prepares text for CSV export by removing problematic characters.
 * WHY: CSV files can break when certain characters (commas, newlines, quotes) are present in the data.
 * Sanitizing ensures the exported file will open correctly in spreadsheet software.
 *
 * @param text {string} - The raw text to sanitize
 * @returns {string} - The sanitized text safe for CSV inclusion
 */
const sanitizeText = (text: string): string => {
  return text.replace(/[,\n"]/g, ' ').trim();
};

/**
 * Combines rating selections with text responses into a single formatted string.
 * WHY: Users can provide both ratings and text responses. Combining them in a standardized
 * format ensures analysts can understand the complete context of each response in a single field.
 *
 * @param response {{ text: string; ratings?: string[] | null }} - The response object containing text and optional ratings
 * @returns {string} - A formatted string combining ratings and text
 */
const formatRatingResponse = (response?: { text: string; ratings?: string[] | null }): string => {
  if (!response) return '';

  const text = response.text || '';
  const ratings = response.ratings || [];

  const textPart = sanitizeText(text);
  const ratingPart = ratings.join(' - ');

  if (textPart) {
    return `${ratingPart} - ${textPart}`;
  }

  return ratingPart;
};

/**
 * Prepares individual fields for CSV format by handling special characters and quotes.
 * WHY: CSV fields containing delimiters must be properly escaped to maintain data integrity.
 * This ensures the exported file follows CSV specifications and opens correctly in any software.
 *
 * @param field {string} - The field value to escape
 * @returns {string} - The properly escaped CSV field
 */
const escapeField = (field: string): string => {
  if (field === null || field === undefined) return '';
  const stringField = String(field);
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
};

/**
 * Transforms inquiry response data into a downloadable CSV file.
 * WHY: CSV format allows easy analysis in spreadsheet software, making it ideal for:
 * 1. Data analysis by non-technical users
 * 2. Importing into other analysis tools
 * 3. Creating reports and visualizations
 *
 * @param id {string} - The inquiry ID used to name the exported file
 * @param responses {InquiryResponses} - The complete response data to export
 * @returns {Promise<void>} - A promise that resolves when the file download begins
 * @throws Will throw an error if file creation or download fails
 */
export const exportToCSV = async (id: string, responses: InquiryResponses): Promise<void> => {
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
    const row: Record<string, string> = {
      userId: response.userId as string,
    };

    if (hasUserDetails) {
      row.name = response.data.userDetails?.name || '';
      row.email = response.data.userDetails?.email || '';
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
      rowValues.push(row.name, row.email);
    }
    headers.slice(hasUserDetails ? 3 : 1).forEach((question) => {
      rowValues.push(row[question] || '');
    });

    csvContent += rowValues.map(escapeField).join(',') + '\n';
  });

  await downloadFile(csvContent, `inquiry-responses-${id}.csv`, 'text/csv;charset=utf-8;');
};

/**
 * Exports the complete inquiry response data as a JSON file.
 * WHY: JSON format preserves the full data structure, making it ideal for:
 * 1. Programmatic processing of the complete dataset
 * 2. Data backup and archiving
 * 3. Integration with other systems that expect JSON
 *
 * @param id {string} - The inquiry ID used to name the exported file
 * @param responses {InquiryResponses} - The complete response data to export
 * @returns {Promise<void>} - A promise that resolves when the file download begins
 * @throws Will throw an error if file creation or download fails
 */
export const exportToJSON = async (id: string, responses: InquiryResponses): Promise<void> => {
  const dataExport = { responses };
  const jsonContent = JSON.stringify(dataExport, null, 2);
  await downloadFile(jsonContent, `inquiry-data-${id}.json`, 'application/json');
};

/**
 * Creates and triggers a file download in the browser.
 * WHY: Centralizing download logic ensures:
 * 1. Consistent download behavior across export types
 * 2. Proper resource cleanup after download
 * 3. Unified error handling
 *
 * @param content {string} - The file content to download
 * @param filename {string} - The name to give the downloaded file
 * @param type {string} - The MIME type of the file
 * @returns {Promise<void>} - A promise that resolves when the download begins
 * @throws Will throw an error if the download fails
 */
const downloadFile = (content: string, filename: string, type: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([content], { type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
