export const decodeAudioFiles = async (
    files: File[],
    progressCallback: (progress: number) => void
): Promise<Map<string, AudioBuffer>> => {
    // Use a single, temporary AudioContext for all decoding operations.
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const decodedBuffers = new Map<string, AudioBuffer>();
    let filesDecoded = 0;

    try {
        await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                // decodeAudioData can throw an error for corrupted/unsupported files.
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                decodedBuffers.set(file.name, audioBuffer);
                
                // Synchronize progress updates to prevent race conditions.
                filesDecoded++;
                progressCallback(filesDecoded / files.length);
            })
        );
    } catch (error) {
        console.error("Error decoding audio files:", error);
        // Close the context even if an error occurs.
        await audioContext.close();
        // Re-throw the error to be handled by the caller.
        throw error;
    }
    
    // Close the context to release resources once all decoding is complete.
    await audioContext.close();
    return decodedBuffers;
};
