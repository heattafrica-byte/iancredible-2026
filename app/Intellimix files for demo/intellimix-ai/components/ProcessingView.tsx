import React from 'react';

interface ProcessingViewProps {
  message: string;
}

const ProcessingView: React.FC<ProcessingViewProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 w-full">
      <div className="relative w-24 h-24">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 border-4 border-fuchsia-500 rounded-full animate-spin"
            style={{ 
              animationDelay: `${i * -0.2}s`, 
              animationDuration: '1.5s',
              opacity: 1 - i * 0.2,
              filter: 'drop-shadow(0 0 5px #ff00f3)',
            }}
          ></div>
        ))}
         <div className="absolute inset-2 border-4 border-cyan-400 rounded-full animate-ping" style={{ filter: 'drop-shadow(0 0 5px #00ffff)'}}></div>
      </div>
      <h2 className="text-2xl font-bold mt-8 text-gray-200 text-shadow-glow-cyan uppercase tracking-widest">{message}</h2>
      <p className="text-cyan-400/70 mt-2">AI core is analyzing audio streams...</p>
    </div>
  );
};

export default ProcessingView;