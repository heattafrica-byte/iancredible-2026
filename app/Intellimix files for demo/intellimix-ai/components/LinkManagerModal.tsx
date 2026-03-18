import React, { useState, useEffect } from 'react';
import { MixdownResult, LinkGroup } from '../types';
import { XMarkIcon, LinkIcon } from './Icons';

interface LinkManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newLinks: LinkGroup[]) => void;
  allTracks: MixdownResult[];
  sourceTrackName: string | null;
  links: LinkGroup[];
}

const LinkManagerModal: React.FC<LinkManagerModalProps> = ({ isOpen, onClose, onSave, allTracks, sourceTrackName, links }) => {
    const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (isOpen && sourceTrackName) {
            const currentGroup = links.find(group => group.includes(sourceTrackName));
            const initialSelection = new Set(currentGroup ? currentGroup.filter(t => t !== sourceTrackName) : []);
            setSelectedTracks(initialSelection);
        }
    }, [isOpen, sourceTrackName, links]);

    const handleToggleTrack = (trackName: string) => {
        setSelectedTracks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(trackName)) {
                newSet.delete(trackName);
            } else {
                newSet.add(trackName);
            }
            return newSet;
        });
    };

    const handleSave = () => {
        if (!sourceTrackName) return;

        const intendedMembers = new Set([sourceTrackName, ...selectedTracks]);

        // Find all existing groups that contain any member of our new intended group.
        const relatedGroups = links.filter(group => 
            group.some(trackName => intendedMembers.has(trackName))
        );

        // Merge all members from the intended selection and the related groups.
        relatedGroups.forEach(group => {
            group.forEach(trackName => intendedMembers.add(trackName));
        });

        // Filter out the old, now-merged groups from the main links array.
        const unrelatedGroups = links.filter(group => 
            !group.some(trackName => intendedMembers.has(trackName))
        );
        
        const finalNewGroup = Array.from(intendedMembers);

        // A group only makes sense if it has more than one member.
        if (finalNewGroup.length > 1) {
            onSave([...unrelatedGroups, finalNewGroup]);
        } else {
            // Otherwise, we're just left with the unrelated groups (effectively dissolving the old group).
            onSave(unrelatedGroups);
        }
        
        onClose();
    };

    if (!isOpen || !sourceTrackName) return null;

    return (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <div 
            className="bg-gradient-to-br from-[#1a1a2e] to-[#10101f] border border-cyan-500/30 rounded-lg p-6 flex flex-col gap-4 shadow-2xl w-full max-w-md max-h-[90vh] animate-slide-up shadow-[0_0_30px_rgba(0,255,255,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-cyan-500/20">
                <div className="flex items-center gap-3">
                    <LinkIcon className="w-6 h-6 text-cyan-400" />
                    <div>
                        <h2 className="text-xl font-bold text-white">Link Input Gain</h2>
                        <p className="text-sm text-gray-400 truncate">For track: <span className="font-semibold text-gray-200">{sourceTrackName}</span></p>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    aria-label="Close link manager"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="overflow-y-auto pr-2 space-y-2 flex-grow">
              <p className="text-sm text-gray-400 pb-2">Select other tracks to link this parameter to:</p>
              {allTracks.filter(t => t.trackName !== sourceTrackName).map(track => (
                <label key={track.trackName} className="flex items-center gap-3 p-3 bg-[#10101f] hover:bg-cyan-500/10 rounded-md cursor-pointer transition-colors">
                    <input
                        type="checkbox"
                        checked={selectedTracks.has(track.trackName)}
                        onChange={() => handleToggleTrack(track.trackName)}
                        className="h-5 w-5 rounded-sm bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-600 focus:ring-2 accent-cyan-500"
                    />
                    <span className="text-gray-200">{track.trackName}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-cyan-500/20">
                <button 
                    onClick={onClose}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                    Save Links
                </button>
            </div>
          </div>
        </div>
      );
};

export default LinkManagerModal;