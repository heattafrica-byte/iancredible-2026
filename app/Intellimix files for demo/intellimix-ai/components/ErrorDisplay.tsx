
import React, { useState } from 'react';
import { ExclamationTriangleIcon, ClipboardDocumentIcon, ChevronDownIcon } from './Icons';

interface ErrorDisplayProps {
    error: Error | string | null;
}

const getErrorDetails = (err: Error | string | null): { message: string, stack: string, hasDetails: boolean } => {
    if (!err) {
        return { message: '', stack: '', hasDetails: false };
    }

    if (err instanceof Error) {
        const message = err.message;
        let stack = err.stack || 'No stack trace available.';
        
        let currentErr: any = err;
        while (currentErr.cause) {
            currentErr = currentErr.cause;
            if (currentErr instanceof Error) {
                stack += `\n\n--- Caused by: ---\n${currentErr.stack}`;
            } else {
                stack += `\n\n--- Caused by: ---\n${String(currentErr)}`;
            }
        }
        return { message, stack, hasDetails: true };
    }
    
    return { message: err, stack: 'No technical details available for this error type.', hasDetails: false };
};


export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy Details');

    const { message, stack, hasDetails } = getErrorDetails(error);

    if (!message) {
        return null;
    }
    
    const detailsToCopy = `Error Message: ${message}\n\nTechnical Details:\n${stack}`;

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault(); // prevent summary toggle
        navigator.clipboard.writeText(detailsToCopy).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy Details'), 2000);
        });
    };
    
    return (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6 animate-fade-in">
            <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-grow">
                    <strong className="font-bold">An Error Occurred</strong>
                    <p className="block sm:inline">{message}</p>
                </div>
            </div>

            {hasDetails && (
                <details className="mt-3 group">
                    <summary className="cursor-pointer text-sm text-red-200 hover:text-white flex items-center justify-between list-none font-medium">
                        <span className="flex items-center gap-2">
                           Show Technical Details
                           <ChevronDownIcon className="w-4 h-4 transition-transform group-open:rotate-180" />
                        </span>
                        <button 
                            onClick={handleCopy}
                            className="text-xs bg-red-800/50 hover:bg-red-700/50 px-2 py-1 rounded flex items-center gap-1.5 transition-colors"
                        >
                            <ClipboardDocumentIcon className="w-3.5 h-3.5"/>
                            {copyButtonText}
                        </button>
                    </summary>
                    <pre className="mt-2 bg-black/30 p-3 rounded text-xs text-red-200 overflow-x-auto font-mono">
                        <code>
                            {stack}
                        </code>
                    </pre>
                </details>
            )}
        </div>
    );
}
