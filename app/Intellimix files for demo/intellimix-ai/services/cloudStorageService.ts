import { collection, doc, setDoc, getDocs, deleteDoc, getDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { auth, db, storage } from './firebase';
import { Project } from '../types';

export interface CloudProject extends Project {
    audioUrls: Record<string, string>; // map filename to download URL
}

export const saveProjectToCloud = async (
    projectData: Omit<Project, 'id' | 'createdAt'>, 
    files: File[], 
    onProgress?: (progress: number) => void
): Promise<string> => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const projectId = Date.now().toString();
    const projectRef = doc(collection(db, `users/${user.uid}/projects`), projectId);
    
    const audioUrls: Record<string, string> = {};
    let totalBytes = files.reduce((acc, f) => acc + f.size, 0);
    let uploadedBytes = 0;

    // Upload files
    for (const file of files) {
        const fileRef = ref(storage, `users/${user.uid}/projects/${projectId}/${file.name}`);
        
        // We use uploadBytesResumable to track progress
        const uploadTask = uploadBytesResumable(fileRef, file);
        
        await new Promise<void>((resolve, reject) => {
            uploadTask.on('state_changed', 
                (snapshot) => {
                    const currentFileProgress = snapshot.bytesTransferred;
                    // Note: this is a simplified progress calculation
                    if (onProgress) {
                        onProgress(((uploadedBytes + currentFileProgress) / totalBytes) * 100);
                    }
                },
                (error) => reject(error),
                async () => {
                    uploadedBytes += file.size;
                    const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                    audioUrls[file.name] = downloadUrl;
                    resolve();
                }
            );
        });
    }

    const cloudProject: CloudProject = {
        ...projectData,
        id: projectId,
        createdAt: Date.now(),
        audioUrls
    };

    await setDoc(projectRef, cloudProject);
    return projectId;
};

export const getUserProjects = async (): Promise<CloudProject[]> => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const projectsRef = collection(db, `users/${user.uid}/projects`);
    const q = query(projectsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => doc.data() as CloudProject);
};

export const deleteProjectFromCloud = async (projectId: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    // Delete document
    await deleteDoc(doc(db, `users/${user.uid}/projects/${projectId}`));

    // Delete files in storage
    const folderRef = ref(storage, `users/${user.uid}/projects/${projectId}`);
    try {
        const fileList = await listAll(folderRef);
        await Promise.all(fileList.items.map(itemRef => deleteObject(itemRef)));
    } catch (e) {
        console.error("Error deleting storage files:", e);
    }
};

export const loadProjectFiles = async (project: CloudProject, onProgress?: (progress: number) => void): Promise<File[]> => {
    const files: File[] = [];
    const totalFiles = Object.keys(project.audioUrls || {}).length;
    let loadedFiles = 0;

    for (const [filename, url] of Object.entries(project.audioUrls || {})) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            files.push(new File([blob], filename, { type: blob.type || 'audio/wav' }));
            loadedFiles++;
            if (onProgress) {
                onProgress((loadedFiles / totalFiles) * 100);
            }
        } catch (e) {
            console.error(`Failed to load file ${filename}`, e);
            throw new Error(`Failed to load audio file: ${filename}`);
        }
    }

    return files;
};
