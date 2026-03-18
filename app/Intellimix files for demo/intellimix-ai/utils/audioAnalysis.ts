export interface AudioAnalysisResult {
    lufsIntegrated: number;
    lufsShortTermMax: number;
    truePeak: number;
    crestFactor: number;
}

// A simplified estimation of LUFS and Crest Factor for the browser.
// For true ITU-R BS.1770-4 compliance, a WebAssembly module or backend processing is recommended.
export const analyzeAudioBuffer = async (audioBuffer: AudioBuffer): Promise<AudioAnalysisResult> => {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length;
    
    let sumSquares = 0;
    let maxPeak = 0;
    
    // 1. Calculate Peak and RMS
    for (let c = 0; c < numChannels; c++) {
        const channelData = audioBuffer.getChannelData(c);
        for (let i = 0; i < length; i++) {
            const sample = channelData[i];
            const absSample = Math.abs(sample);
            if (absSample > maxPeak) {
                maxPeak = absSample;
            }
            sumSquares += sample * sample;
        }
    }
    
    const rms = Math.sqrt(sumSquares / (length * numChannels));
    
    // 2. Estimate True Peak (simplified: just sample peak + 0.5dB to account for inter-sample peaks)
    // A real true peak meter requires 4x oversampling.
    const truePeakLinear = maxPeak * 1.059; // roughly +0.5dB
    const truePeakDb = 20 * Math.log10(Math.max(truePeakLinear, 1e-10));
    
    // 3. Estimate LUFS (Integrated)
    // Simplified: RMS in dBFS, minus ~3dB to approximate K-weighting for typical music.
    const rmsDb = 20 * Math.log10(Math.max(rms, 1e-10));
    const lufsIntegrated = rmsDb - 3.0; 
    
    // 4. Estimate LUFS (Short-Term Max)
    // Calculate RMS in 3-second blocks
    const blockSize = sampleRate * 3; 
    let maxShortTermRms = 0;
    
    for (let offset = 0; offset < length; offset += blockSize) {
        let blockSumSquares = 0;
        const currentBlockSize = Math.min(blockSize, length - offset);
        
        for (let c = 0; c < numChannels; c++) {
            const channelData = audioBuffer.getChannelData(c);
            for (let i = 0; i < currentBlockSize; i++) {
                const sample = channelData[offset + i];
                blockSumSquares += sample * sample;
            }
        }
        
        const blockRms = Math.sqrt(blockSumSquares / (currentBlockSize * numChannels));
        if (blockRms > maxShortTermRms) {
            maxShortTermRms = blockRms;
        }
    }
    
    const maxShortTermRmsDb = 20 * Math.log10(Math.max(maxShortTermRms, 1e-10));
    const lufsShortTermMax = maxShortTermRmsDb - 3.0;
    
    // 5. Calculate Crest Factor (Peak to RMS ratio in dB)
    const crestFactor = truePeakDb - rmsDb;
    
    return {
        lufsIntegrated: Number(lufsIntegrated.toFixed(1)),
        lufsShortTermMax: Number(lufsShortTermMax.toFixed(1)),
        truePeak: Number(truePeakDb.toFixed(1)),
        crestFactor: Number(crestFactor.toFixed(1))
    };
};
