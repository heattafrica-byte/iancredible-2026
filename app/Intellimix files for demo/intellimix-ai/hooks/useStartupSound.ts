import { useCallback } from 'react';
import { playStartupSound } from '../services/soundService';

export const useStartupSound = () => {
    const playSound = useCallback(() => {
        // This is a fire-and-forget sound. We'll wrap it in a try-catch 
        // in case autoplay policies block it, preventing a crash.
        try {
            playStartupSound();
        } catch (error) {
            console.error("Could not play startup sound, likely due to browser autoplay policies.", error);
        }
    }, []);

    return { playSound };
};
