import React, { useState, useCallback } from 'react';
import { UploadIcon, AudioFileIcon } from './Icons';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onStartMixdown?: () => void;
  files?: File[];
  genre?: string;
  onGenreChange?: (genre: string) => void;
  isBuffering?: boolean;
  bufferingProgress?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFilesSelected, 
  onStartMixdown, 
  files = [], 
  genre, 
  onGenreChange, 
  isBuffering, 
  bufferingProgress = 0,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      onFilesSelected(droppedFiles);
    }
  }, [onFilesSelected]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles);
    }
    e.target.value = '';
  }, [onFilesSelected]);

  const hasFiles = files.length > 0;

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <div 
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`w-full max-w-3xl border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ease-in-out flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden ${isDragging ? 'border-fuchsia-500 bg-[#1a1a2e] scale-105' : 'border-cyan-500/50 bg-[#10101f]'}`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30 pointer-events-none"></div>
        <input
          type="file"
          id="file-upload"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept="audio/*,.wav,.mp3,.flac,.aiff,.m4a,.ogg"
        />
        {!hasFiles ? (
          <>
            <UploadIcon className="w-16 h-16 text-cyan-500/50 mb-4" />
            <h2 className="text-2xl font-bold text-gray-300">DROP AUDIO STEMS</h2>
            <p className="text-gray-400 mt-2">or</p>
            <label htmlFor="file-upload" className="mt-4 cursor-pointer inline-block bg-cyan-600 text-white font-bold tracking-widest py-2 px-6 rounded-md hover:bg-cyan-500 transition-colors shadow-[0_0_10px_rgba(0,255,255,0.5)]">
              UPLOAD
            </label>
          </>
        ) : (
          <div className="w-full z-10">
            <h3 className="text-xl font-semibold mb-4 text-left">Your Tracks:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left max-h-48 overflow-y-auto pr-2">
              {files.map((file, index) => (
                <div key={index} className="bg-[#1a1a2e] p-3 rounded-md flex items-center gap-3">
                  <AudioFileIcon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="truncate text-sm text-gray-300">{file.name}</span>
                </div>
              ))}
            </div>
             {isBuffering && (
                <div className="mt-4 w-full text-left">
                    <p className="text-sm text-cyan-400/70 mb-1">PRE-BUFFERING AUDIO ({Math.round(bufferingProgress * 100)}%)...</p>
                    <div className="w-full bg-cyan-900/50 rounded-full h-1.5">
                        <div 
                            className="bg-fuchsia-500 h-1.5 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(255,0,243,0.7)]" 
                            style={{ width: `${bufferingProgress * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}
            <label htmlFor="file-upload" className="mt-6 cursor-pointer text-sm text-cyan-400 hover:text-cyan-300">
              Add more files...
            </label>
          </div>
        )}
      </div>

      {hasFiles && onGenreChange && (
        <div className="w-full max-w-3xl mt-6">
          <label htmlFor="genre-input" className="block text-sm font-medium text-cyan-400/80 mb-2 text-left uppercase tracking-wider">
            Genre (Optional)
          </label>
          <input
            type="text"
            id="genre-input"
            value={genre}
            onChange={(e) => onGenreChange(e.target.value)}
            placeholder="e.g., Cyberpunk, Synthwave, Industrial"
            className="w-full bg-[#1a1a2e] border border-cyan-500/30 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            aria-label="Music genre"
          />
        </div>
      )}

      {hasFiles && onStartMixdown && (
        <button 
          onClick={onStartMixdown}
          disabled={isBuffering}
          className="mt-8 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold py-4 px-10 rounded-md text-lg shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out uppercase tracking-widest shadow-[0_0_20px_rgba(255,0,243,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBuffering ? 'BUFFERING...' : 'Start IntelliMix'}
        </button>
      )}
    </div>
  );
};

export default FileUpload;