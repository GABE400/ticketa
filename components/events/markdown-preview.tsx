
'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
    content: string;
    className?: string;
}

export default function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
    if (!content) {
        return <p className="text-gray-500 italic text-sm">No description provided.</p>;
    }

    return (
        <div className={cn(
            "prose prose-invert max-w-none transition-all",
            "prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-headings:italic",
            "prose-p:text-gray-400 prose-p:leading-relaxed",
            "prose-strong:text-white prose-strong:font-black",
            "prose-ul:list-disc prose-ul:pl-6",
            "prose-li:text-gray-400 prose-li:mb-1",
            className
        )}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    );
}
