
import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { XMarkIcon, FolderIcon, TrashIcon } from './Icons';
import { getUserProjects, deleteProjectFromCloud, CloudProject } from '../services/cloudStorageService';
import { Loader2 } from 'lucide-react';

interface ProjectsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoadProject: (project: CloudProject) => void;
    onDeleteProject: (projectId: string) => void;
}

const ProjectsModal: React.FC<ProjectsModalProps> = ({ isOpen, onClose, onLoadProject, onDeleteProject }) => {
    const [projects, setProjects] = useState<CloudProject[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadProjects();
        }
    }, [isOpen]);

    const loadProjects = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const cloudProjects = await getUserProjects();
            setProjects(cloudProjects);
        } catch (err: any) {
            console.error("Failed to load projects", err);
            setError("Failed to load projects. Ensure you are logged in.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        
        try {
            await deleteProjectFromCloud(id);
            onDeleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (err: any) {
            console.error("Failed to delete project", err);
            alert("Failed to delete project.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#10101f] border border-cyan-500/30 rounded-lg p-6 flex flex-col gap-4 shadow-2xl w-full max-w-lg max-h-[80vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-3 border-b border-cyan-500/20">
                    <div className="flex items-center gap-3">
                        <FolderIcon className="w-6 h-6 text-cyan-400" />
                        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Cloud Projects</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                
                {error && <div className="text-red-400 text-sm p-2 bg-red-500/10 rounded">{error}</div>}

                <div className="overflow-y-auto pr-2 space-y-2">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-cyan-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <p className="text-sm">Loading projects...</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <p className="text-center text-gray-500 py-12 italic">No projects saved yet.</p>
                    ) : (
                        projects.map(project => (
                            <div key={project.id} className="bg-black/40 border border-white/5 rounded-md p-3 flex justify-between items-center hover:bg-cyan-500/5 transition-colors">
                                <div>
                                    <p className="font-bold text-gray-200">{project.name}</p>
                                    <p className="text-[10px] text-gray-500 uppercase">{new Date(project.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => onLoadProject(project)} className="bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white px-3 py-1 rounded text-xs font-bold transition-all">Load</button>
                                    <button onClick={() => handleDelete(project.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded transition-all"><TrashIcon className="w-4 h-4"/></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectsModal;
