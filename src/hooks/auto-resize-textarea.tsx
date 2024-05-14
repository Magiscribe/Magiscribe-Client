import { useEffect, useRef } from 'react';

/**
 * A ref hook that auto resizes a textarea element based on its content.
 * @example const textareaRef = useAutoResizeTextareaRef(text);
 * @param text {string} The text content of the textarea.
 * @returns {React.MutableRefObject<HTMLTextAreaElement>} The ref object of the textarea element.
 */
const useAutoResizeTextareaRef = (text: string) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return textareaRef;
};

export default useAutoResizeTextareaRef;
