import React, { useState, useRef, useEffect } from 'react';
import { EQPreset } from '../types';
import { ChevronUpDownIcon, BookmarkSquareIcon, TrashIcon } from './Icons';

interface EQPresetManagerProps {
  presets: EQPreset[];
  onSelect: (preset: EQPreset) => void;
  onSave: (name: string) => void;
  onDelete: (name: string) => void;
}

const EQPresetManager: React.FC<EQPresetManagerProps> = ({ presets, onSelect, onSave, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = () => {
    const name = window.prompt("Enter a name for your EQ preset:");
    if (name) {
      onSave(name);
    }
    setIsOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, name: string) => {
    e.stopPropagation(); // Prevent dropdown from closing
    if (window.confirm(`Are you sure you want to delete the preset "${name}"?`)) {
      onDelete(name);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm bg-[#10101f] hover:bg-cyan-500/20 px-2 py-1 rounded-md text-gray-300 transition-colors border border-cyan-500/30"
      >
        Presets
        <ChevronUpDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#1a1a2e] border border-cyan-500/30 rounded-md shadow-lg z-10 animate-fade-in-sm">
          <ul className="py-1 text-sm text-gray-200 max-h-60 overflow-y-auto">
            {presets.length === 0 && (
                <li className="px-3 py-2 text-gray-400 text-center italic">No presets saved.</li>
            )}
            {presets.map((preset) => (
              <li
                key={preset.name}
                className="group flex justify-between items-center px-3 py-2 hover:bg-cyan-600 cursor-pointer"
                onClick={() => {
                  onSelect(preset);
                  setIsOpen(false);
                }}
              >
                <span>{preset.name}</span>
                <button
                    onClick={(e) => handleDelete(e, preset.name)}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 text-red-300 hover:bg-red-500/50 hover:text-white transition-opacity"
                    title={`Delete preset "${preset.name}"`}
                >
                    <TrashIcon className="w-4 h-4"/>
                </button>
              </li>
            ))}
            <li className="border-t border-cyan-500/20 mt-1">
              <button
                onClick={handleSave}
                className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-cyan-600"
              >
                <BookmarkSquareIcon className="w-4 h-4" />
                Save Current as Preset...
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default EQPresetManager;