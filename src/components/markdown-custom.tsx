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
        p: ({ children }) => <p className="text-slate-700 dark:text-white mb-2">{children}</p>,
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 mt-6">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3 mt-5">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 mt-4">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-base font-bold text-slate-800 dark:text-white mb-2 mt-3">{children}</h4>
        ),
        ul: ({ children }) => <ul className="list-disc pl-6 text-slate-700 dark:text-white mb-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 text-slate-700 dark:text-white mb-2">{children}</ol>,
        li: ({ children }) => <li className="mb-1 text-slate-700 dark:text-white">{children}</li>,
        code: ({ children }) => (
          <code className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-1 rounded-sm font-mono text-sm">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-4 rounded-md font-mono text-sm overflow-x-auto mb-4">
            {children}
          </pre>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 italic text-slate-600 dark:text-slate-300 my-4">
            {children}
          </blockquote>
        ),
        strong: ({ children }) => <strong className="font-bold text-slate-800 dark:text-white">{children}</strong>,
        em: ({ children }) => <em className="italic text-slate-700 dark:text-slate-200">{children}</em>,
        a: ({ children, href }) => (
          <a
            className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline"
            href={href as string}
          >
            {children}
          </a>
        ),
        hr: () => <hr className="border-slate-300 dark:border-slate-600 my-4" />,
      }}
    >
      {children}
    </Markdown>
  );
}
