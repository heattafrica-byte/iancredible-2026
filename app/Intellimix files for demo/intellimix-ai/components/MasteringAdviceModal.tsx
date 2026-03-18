import React from 'react';
import { BrainIcon, XMarkIcon } from './Icons';

interface MasteringAdviceModalProps {
  advice: string;
  onClose: () => void;
}

const formatInline = (text: string) => {
  // A simple parser for **bold** text.
  // Split by the bold delimiter, and alternate between normal and bold text.
  const parts = text.split('**');
  return parts.map((part, index) => 
    index % 2 === 1 
      ? <strong key={index} className="font-semibold text-fuchsia-300">{part}</strong> 
      : part
  );
};

const renderFormattedText = (text: string) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-6 space-y-2 my-3">{listItems}</ul>);
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    line = line.trim();

    if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={i} className="text-lg font-bold mt-4 mb-2 text-white uppercase tracking-wider text-shadow-glow-fuchsia">{line.substring(4)}</h3>);
      return;
    }
    if (line.startsWith('* ') || line.startsWith('- ')) {
      const content = line.substring(2);
      listItems.push(<li key={i}>{formatInline(content)}</li>);
      return;
    }

    flushList();

    if (line === '') {
      if (elements.length > 0 && elements[elements.length - 1] !== <br key={i-1} />) {
        // elements.push(<div key={i} className="h-3"></div>);
      }
    } else {
      elements.push(<p key={i} className="leading-relaxed">{formatInline(line)}</p>);
    }
  });
  
  flushList();

  return elements;
};

const MasteringAdviceModal: React.FC<MasteringAdviceModalProps> = ({ advice, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gradient-to-br from-[#1a1a2e] to-[#10101f] border border-fuchsia-500/30 rounded-lg p-6 flex flex-col gap-4 shadow-2xl w-full max-w-2xl max-h-[90vh] animate-slide-up shadow-[0_0_30px_rgba(255,0,243,0.2)]"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="flex justify-between items-center pb-3 border-b border-fuchsia-500/20">
            <div className="flex items-center gap-3">
                <BrainIcon className="w-7 h-7 text-fuchsia-400" />
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Mastering Assistant</h2>
            </div>
            <button 
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                aria-label="Close mastering advice"
            >
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>
        <div className="overflow-y-auto pr-2 text-gray-300 space-y-3">
          {renderFormattedText(advice)}
        </div>
      </div>
    </div>
  );
};

export default MasteringAdviceModal;