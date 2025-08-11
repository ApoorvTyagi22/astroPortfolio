import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import "katex/dist/katex.min.css";

const MarkdownRenderer = ({ content }) => {
  return (
    <div
      className="prose prose-lg sm:prose-xl lg:prose-2xl mx-auto prose-blue dark:prose-invert max-w-none math-enhanced"
      style={{
        // Custom CSS variables for KaTeX styling
        "--katex-color": "#1e40af",
        "--katex-color-dark": "#93c5fd",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .math-enhanced .katex-display {
            margin: 1.5rem 0 !important;
            padding: 1.5rem !important;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 8px !important;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
            position: relative !important;
            text-align: center !important;
          }
          
          .dark .math-enhanced .katex-display {
            background: linear-gradient(135deg, #334155 0%, #475569 100%) !important;
            border-color: #64748b !important;
          }
          
          .math-enhanced .katex-display::before {
            content: "Mathematical Expression";
            position: absolute;
            top: -8px;
            left: 16px;
            background: #64748b;
            color: white;
            padding: 2px 8px;
            font-size: 0.7rem;
            font-weight: 500;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .math-enhanced .katex {
            font-size: 1.1em !important;
            color: #475569 !important;
          }
          
          .dark .math-enhanced .katex {
            color: #e2e8f0 !important;
          }
          
          .math-enhanced .katex .mfrac .frac-line {
            border-bottom-color: #475569 !important;
          }
          
          .dark .math-enhanced .katex .mfrac .frac-line {
            border-bottom-color: #e2e8f0 !important;
          }
          
          /* Inline math styling */
          .math-enhanced .katex:not(.katex-display) {
            padding: 2px 6px !important;
            background: #f1f5f9 !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 3px !important;
            margin: 0 2px !important;
            font-size: 0.95em !important;
          }
          
          .dark .math-enhanced .katex:not(.katex-display) {
            background: #475569 !important;
            border-color: #64748b !important;
          }
        `,
        }}
      />
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt}
              {...props}
              className="rounded-lg shadow-md w-full h-auto my-4"
            />
          ),
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              {...props}
              className="text-blue-600 hover:text-blue-800 underline"
              target={href?.startsWith("http") ? "_blank" : "_self"}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          h1: ({ children, ...props }) => (
            <h1
              {...props}
              className="text-3xl font-bold mt-8 mb-4 text-blue-800 dark:text-blue-300"
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              {...props}
              className="text-2xl font-semibold mt-6 mb-3 text-blue-700 dark:text-blue-400"
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              {...props}
              className="text-xl font-medium mt-4 mb-2 text-blue-600 dark:text-blue-500"
            >
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p
              {...props}
              className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed"
            >
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul
              {...props}
              className="list-disc list-inside mb-4 text-slate-700 dark:text-slate-300"
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              {...props}
              className="list-decimal list-inside mb-4 text-slate-700 dark:text-slate-300"
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li {...props} className="mb-2">
              {children}
            </li>
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            if (inline) {
              return (
                <code
                  {...props}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm font-mono border border-blue-200 dark:border-blue-700"
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="my-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
                {/* Code block header with language */}
                {language && (
                  <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm font-medium border-b border-gray-600">
                    <span className="text-blue-400">{language}</span>
                  </div>
                )}
                <SyntaxHighlighter
                  language={language || "text"}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: "1.5rem",
                    background: "#1e1e1e",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                  }}
                  showLineNumbers={true}
                  lineNumberStyle={{
                    color: "#6e7681",
                    paddingRight: "1rem",
                    minWidth: "2.5rem",
                  }}
                  wrapLines={true}
                  wrapLongLines={true}
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            );
          },
          pre: ({ children, ...props }) => {
            // Don't wrap SyntaxHighlighter in additional pre tags
            return <div {...props}>{children}</div>;
          },
          blockquote: ({ children, ...props }) => (
            <blockquote
              {...props}
              className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400 my-4"
            >
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
