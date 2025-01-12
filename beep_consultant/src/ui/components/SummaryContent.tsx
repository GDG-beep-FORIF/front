import React from 'react';
import ReactMarkdown from 'react-markdown';

interface SummaryContentProps {
    summaryContent: string | undefined;
    initialQuery?: string;
  }

const SummaryContent: React.FC<SummaryContentProps> = ({ summaryContent, initialQuery }) => {
  if (!summaryContent) {
    return null;
  }

  const fullContent = initialQuery 
    ? `### 초기 고민 상담 질문: **${initialQuery}**\n\n${summaryContent}`
    : summaryContent;

  try {
    return (
      <div className="mt-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
            <ReactMarkdown
              components={{
                // Override default element styling
                h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                p: ({ children }) => <p className="mb-4 text-gray-700">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 rounded px-1 py-0.5 text-sm">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-100 rounded p-4 overflow-x-auto my-4">{children}</pre>
                ),
              }}
            >
              {fullContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // Fallback to plain text if markdown parsing fails
    console.error('Error rendering markdown:', error);
    return (
      <div className="mt-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-700 whitespace-pre-wrap">{summaryContent}</p>
        </div>
      </div>
    );
  }
};

export default SummaryContent;