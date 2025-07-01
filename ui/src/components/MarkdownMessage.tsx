import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({
  content,
  className = "",
}) => (
  <div className={className}>
    <ReactMarkdown
      components={{
        // @ts-expect-error 'inline' is present at runtime
        code({ node, inline, className, children, ...props }) {
          return (
            <code
              className={`
                bg-gray-100 px-1 rounded
                text-sm font-mono
                ${inline ? "" : "block overflow-x-auto my-2 p-2"}
                ${className || ""}
              `}
              {...props}
            >
              {children}
            </code>
          );
        },
        a(props) {
          return (
            <a
              {...props}
              className="text-[#002FA7] underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            />
          );
        },
        li({ children }) {
          return <li className="ml-4 list-disc">{children}</li>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);
