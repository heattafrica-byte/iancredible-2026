
import React from 'react';
import { ArrowPathIcon, MusicalNoteIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon, FolderIcon } from './Icons';
import { LogOut, User as UserIcon } from 'lucide-react';

interface HeaderProps {
    onReset: () => void;
    showReset: boolean;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onOpenProjects: () => void;
    user: { email: string | null } | null;
    onSignOut: () => void;
    isPro: boolean;
    onOpenSubscription: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    onReset, 
    showReset, 
    onUndo, 
    onRedo, 
    canUndo, 
    canRedo, 
    onOpenProjects,
    user,
    onSignOut,
    isPro,
    onOpenSubscription
}) => {
    return (
        <header className="w-full max-w-7xl flex justify-between items-center pb-4 relative">
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-fuchsia-600/20 border border-fuchsia-500/30 rounded-md flex items-center justify-center">
                    <MusicalNoteIcon className="w-7 h-7 text-fuchsia-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-cyan-400 tracking-tight text-shadow-glow-cyan">IntelliMix AI</h1>
                    <p className="text-sm text-gray-400">Professional Mix Engineering</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {user && (
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mr-4">
                        <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center">
                            <UserIcon className="w-3 h-3 text-cyan-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 truncate max-w-[120px]">
                                {user.email}
                            </span>
                            {isPro ? (
                                <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">Pro Member</span>
                            ) : (
                                <button 
                                    onClick={onOpenSubscription}
                                    className="text-[8px] font-black text-fuchsia-400 uppercase tracking-widest hover:text-fuchsia-300 transition-colors text-left"
                                >
                                    Upgrade to Pro
                                </button>
                            )}
                        </div>
                        <button 
                            onClick={onSignOut}
                            className="p-1 hover:text-white transition-colors ml-2"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                )}

                <button
                    onClick={onOpenProjects}
                    className="bg-[#1a1a2e] border border-cyan-500/30 hover:bg-cyan-500/20 text-gray-300 font-semibold py-2 px-4 rounded-md transition-colors flex items-center gap-2"
                    title="My Projects"
                >
                    <FolderIcon className="w-5 h-5"/>
                    Projects
                </button>
                
                {showReset && (
                    <div className="flex items-center rounded-md bg-[#1a1a2e] border border-cyan-500/30 shadow-sm">
                        <button
                            onClick={onUndo}
                            disabled={!canUndo}
                            className="p-2 text-gray-300 hover:bg-cyan-500/20 disabled:text-gray-600 disabled:cursor-not-allowed rounded-l-md transition-colors"
                            title="Undo"
                        >
                            <ArrowUturnLeftIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onRedo}
                            disabled={!canRedo}
                            className="p-2 text-gray-300 hover:bg-cyan-500/20 disabled:text-gray-600 disabled:cursor-not-allowed rounded-r-md border-l border-cyan-500/30 transition-colors"
                            title="Redo"
                        >
                            <ArrowUturnRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}

                 {showReset && (
                      <button 
                        onClick={onReset}
                        className="bg-[#1a1a2e] border border-cyan-500/30 hover:bg-cyan-500/20 text-gray-300 font-semibold py-2 px-4 rounded-md transition-colors flex items-center gap-2"
                        title="Start Over"
                      >
                          <ArrowPathIcon className="w-5 h-5"/>
                          Reset
                      </button>
                 )}
            </div>
      </header>
    );
}
