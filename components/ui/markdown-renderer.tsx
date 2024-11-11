import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      components={{
        // Style headers
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-2">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 mt-8">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold mb-3 text-gray-700 mt-6">
            {children}
          </h3>
        ),

        // Style paragraphs
        p: ({ children }) => (
          <p className="text-gray-600 mb-4 leading-relaxed">{children}</p>
        ),

        // Style lists
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 pl-4">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-600 pl-4">
            {children}
          </ol>
        ),

        // Style tables
        table: ({ children }) => (
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200 border">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-50">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {children}
          </td>
        ),

        // Style blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600">
            {children}
          </blockquote>
        ),

        // Style code blocks
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              className="rounded-md my-4"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-gray-100 rounded px-2 py-1 text-sm" {...props}>
              {children}
            </code>
          );
        },

        // Style horizontal rules
        hr: () => <hr className="my-8 border-t border-gray-200" />,

        // Style links
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-blue-600 hover:text-blue-800 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
