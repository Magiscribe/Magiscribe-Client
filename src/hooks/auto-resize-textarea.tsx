import { useCallback, useEffect, useRef } from 'react';

/**
 * A ref hook that auto resizes a textarea element based on its content.
 * Includes cursor position preservation and debounced resize for better performance.
 * @example const textareaRef = useAutoResizeTextareaRef(text);
 * @param text {string} The text content of the textarea.
 * @returns {React.MutableRefObject<HTMLTextAreaElement>} The ref object of the textarea element.
 */
const useAutoResizeTextareaRef = (text: string) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;

      // Preserve cursor position and scroll position
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      const scrollTop = textarea.scrollTop;

      // Resize the textarea
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;

      // Restore cursor position and scroll position
      textarea.setSelectionRange(selectionStart, selectionEnd);
      textarea.scrollTop = scrollTop;
    }
  }, []);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the resize operation
    timeoutRef.current = setTimeout(resizeTextarea, 16); // ~60fps

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, resizeTextarea]);

  return textareaRef;
};

export default useAutoResizeTextareaRef;
