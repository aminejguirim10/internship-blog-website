import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

export const MarkdownComponents = {
  h1: ({ children, ...props }: any) => (
    <h1
      className="mt-4 mb-3 text-xl leading-tight font-bold text-gray-900"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2
      className="mt-4 mb-2 text-lg leading-tight font-semibold text-gray-900"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3
      className="mt-3 mb-2 text-base leading-tight font-semibold text-gray-900"
      {...props}
    >
      {children}
    </h3>
  ),

  p: ({ children, ...props }: any) => (
    <p className="mb-2 text-sm leading-relaxed text-gray-800" {...props}>
      {children}
    </p>
  ),

  ul: ({ children, ...props }: any) => (
    <ul className="mb-3 space-y-1 text-sm" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="mb-3 list-inside list-decimal space-y-1 text-sm" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => {
    const isOrdered = props.node?.parent?.tagName === "ol"
    return (
      <li
        className="flex items-start gap-1 leading-relaxed text-gray-800"
        {...props}
      >
        {!isOrdered && (
          <span className="text-primary mt-1 mr-2 text-xs">•</span>
        )}
        <span className="flex-1">{children}</span>
      </li>
    )
  },

  a: ({ href, children, ...props }: any) => (
    <a
      href={href}
      className="text-blue-600 underline transition-colors hover:text-blue-800"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),

  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-gray-900" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="text-gray-800 italic" {...props}>
      {children}
    </em>
  ),

  code: ({ inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "")
    return !inline && match ? (
      <div className="my-3">
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          className="rounded-lg text-xs"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code
        className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-800"
        {...props}
      >
        {children}
      </code>
    )
  },

  blockquote: ({ children, ...props }: any) => (
    <blockquote
      className="my-3 border-l-4 border-blue-500 bg-blue-50 py-2 pl-4 text-sm text-gray-700 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),

  table: ({ children, ...props }: any) => (
    <div className="my-3 overflow-x-auto">
      <table
        className="min-w-full border-collapse border border-gray-300 text-xs"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: any) => (
    <th
      className="border border-gray-300 bg-gray-100 px-2 py-1 text-left font-semibold"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="border border-gray-300 px-2 py-1" {...props}>
      {children}
    </td>
  ),

  hr: ({ ...props }: any) => (
    <hr className="my-4 border-t border-gray-300" {...props} />
  ),
}
