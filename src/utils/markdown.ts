/**
 * Parses a markdown file and returns the content as an object.
 * @note Currently only supports JSON and Markdown code blocks.
 *
 * @example parseMarkdownCodeBlocks('```json\n{"key": "value"}\n```') -> { key: 'value' }
 * @example parseMarkdownCodeBlocks('```markdown\n# Title\nContent\n```') -> { text: '# Title\nContent' }
 *
 * @param content {string} - Markdown content
 * @returns {Object} - Parsed content
 */
export function parseMarkdownCodeBlocks(content: string) {
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
  const markdownMatch = content.match(/```markdown\n([\s\S]*?)\n```/);

  let parsedResult = { text: '' };
  if (jsonMatch) {
    parsedResult = JSON.parse(jsonMatch[1]);
  }
  if (markdownMatch) {
    parsedResult['text'] = markdownMatch[1];
  }
  return parsedResult;
}
