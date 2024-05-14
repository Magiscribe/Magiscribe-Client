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

export function parseCodeBlocks(content: string, blocks: string[]) {
  const results: { [key: string]: string | null } = {};

  blocks.forEach((blockType) => {
    try {
      // Create regex pattern for this block type
      const pattern = new RegExp(`\`\`\`${blockType}\\n([\\s\\S]*?)\\n\`\`\``, 'g');
      const matches = content.match(pattern);

      if (!matches || matches.length === 0) {
        results[blockType] = null;
        return;
      }

      // Extract content from first match
      const blockContent = matches[0].match(/```.*\n([\s\S]*?)\n```/);
      results[blockType] = blockContent ? blockContent[1].trim() : null;
    } catch (error) {
      console.error(`Error parsing ${blockType} block:`, error);
      results[blockType] = null;
    }
  });

  return results;
}
