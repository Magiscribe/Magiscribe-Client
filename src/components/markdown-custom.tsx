import { JSX } from 'react';
import Markdown from 'react-markdown';

/**
 * A custom markdown component that takes in a string and returns a markdown component
 * using Tailwind CSS classes.
 * @param {children.string} children - The markdown content to render
 * @returns {JSX.Element} The rendered markdown component
 */
export default function MarkdownCustom({ children }: { children: string | null | undefined }): JSX.Element {
  return (
    <Markdown
      components={{
        p: ({ children }) => <p>{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-6">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6">{children}</ol>,
        li: ({ children }) => <li className="mb-1">{children}</li>,
        code: ({ children }) => <code className="bg-slate-100 p-1 rounded-sm">{children}</code>,
        a: ({ children, href }) => (
          <a className="text-blue-500 hover:underline" href={href as string}>
            {children}
          </a>
        ),
      }}
    >
      {children}
    </Markdown>
  );
}
