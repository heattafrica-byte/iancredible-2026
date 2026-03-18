
// Encodes an AudioBuffer into a WAV file Blob (defaults to 24-bit PCM for world-class quality).
export const encodeWav = (audioBuffer: AudioBuffer, bitDepth: 16 | 24 | 32 = 24): Blob => {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = bitDepth === 32 ? 3 : 1; // 3 = 32-bit float, 1 = PCM
    const channels = [];

    for (let i = 0; i < numChannels; i++) {
        channels.push(audioBuffer.getChannelData(i));
    }

    const interleaved = interleaveFloat(channels);
    const dataView = writeHeaders(interleaved, numChannels, sampleRate, bitDepth, format);
    return new Blob([dataView], { type: 'audio/wav' });
};

// Writes the WAV file headers and data.
const writeHeaders = (
    data: Float32Array,
    numChannels: number,
    sampleRate: number,
    bitDepth: number,
    format: number
): DataView => {
    const bytesPerSample = bitDepth / 8;
    const dataSize = data.length * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;

    let offset = 0;
    const writeString = (str: string) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset++, str.charCodeAt(i));
        }
    };

    writeString('RIFF');
    view.setUint32(offset, 36 + dataSize, true); offset += 4;
    writeString('WAVE');
    writeString('fmt ');
    view.setUint32(offset, 16, true); offset += 4; // Sub-chunk size
    view.setUint16(offset, format, true); offset += 2;
    view.setUint16(offset, numChannels, true); offset += 2;
    view.setUint32(offset, sampleRate, true); offset += 4;
    view.setUint32(offset, byteRate, true); offset += 4;
    view.setUint16(offset, blockAlign, true); offset += 2;
    view.setUint16(offset, bitDepth, true); offset += 2;
    writeString('data');
    view.setUint32(offset, dataSize, true); offset += 4;

    // Write the audio data
    if (bitDepth === 32) {
        for (let i = 0; i < data.length; i++, offset += 4) {
            view.setFloat32(offset, data[i], true);
        }
    } else if (bitDepth === 24) {
        for (let i = 0; i < data.length; i++) {
            // Clamp to [-1, 1]
            let s = Math.max(-1, Math.min(1, data[i]));
            // Multiply by 0x7FFFFF (8388607)
            s = s < 0 ? s * 0x800000 : s * 0x7FFFFF;
            // Write 3 bytes (little endian)
            view.setUint8(offset++, s & 0xFF);
            view.setUint8(offset++, (s >> 8) & 0xFF);
            view.setUint8(offset++, (s >> 16) & 0xFF);
        }
    } else if (bitDepth === 16) {
        for (let i = 0; i < data.length; i++, offset += 2) {
            let s = Math.max(-1, Math.min(1, data[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    }

    return view;
};

// Interleaves multiple Float32Arrays into a single Float32Array.
const interleaveFloat = (channels: Float32Array[]): Float32Array => {
    if (channels.length === 0) {
        return new Float32Array(0);
    }
    const numChannels = channels.length;
    const frameCount = channels[0].length;
    const result = new Float32Array(frameCount * numChannels);

    for (let i = 0; i < frameCount; i++) {
        for (let j = 0; j < numChannels; j++) {
            result[i * numChannels + j] = channels[j][i];
        }
    }
    return result;
};

// Helper to convert Blob to Base64 string for Gemini API
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
