
import React, { useState, useRef } from 'react';
import { transcribeAudio } from '../services/geminiService';
import { SpinnerIcon } from './Icons';

interface AudioRecorderProps {
    onTranscription: (text: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTranscription }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    const getSupportedMimeType = () => {
        if (typeof MediaRecorder === 'undefined') return '';
        
        const types = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/mp4',
            'audio/ogg;codecs=opus',
            'audio/wav',
            '' // Default fallback
        ];
        
        for (const type of types) {
            if (type === '') return ''; // fallback to default
            try {
                if (MediaRecorder.isTypeSupported(type)) {
                    return type;
                }
            } catch (e) {
                // Ignore types that cause validation errors
                continue;
            }
        }
        return '';
    };

    const startRecording = async () => {
        try {
            if (typeof MediaRecorder === 'undefined') {
                alert("Audio recording is not supported in this browser.");
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mimeType = getSupportedMimeType();
            const options = mimeType ? { mimeType } : undefined;
            
            // Try-catch block for MediaRecorder creation specifically
            let mediaRecorder: MediaRecorder;
            try {
                mediaRecorder = new MediaRecorder(stream, options);
            } catch (e) {
                 // Fallback without options if specific mimeType fails
                 console.warn("MediaRecorder creation failed with options, trying default.", e);
                 mediaRecorder = new MediaRecorder(stream);
            }

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                // Stop all tracks to release microphone immediately
                stream.getTracks().forEach(track => track.stop());
                
                // Use the recorder's actual mime type if available, otherwise fallback
                const blobType = mediaRecorder.mimeType || 'audio/webm';
                const audioBlob = new Blob(chunksRef.current, { type: blobType });
                
                setIsTranscribing(true);
                try {
                    const text = await transcribeAudio(audioBlob);
                    onTranscription(text);
                } catch (error) {
                    console.error("Transcription failed", error);
                    alert("Failed to transcribe audio. Please try again.");
                } finally {
                    setIsTranscribing(false);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please check permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {!isRecording && !isTranscribing && (
                <button
                    onClick={startRecording}
                    className="p-2 bg-gray-800 hover:bg-red-900/50 text-red-400 border border-red-500/30 rounded-full transition-all hover:scale-105 group"
                    title="Record Voice Note"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:text-red-300">
                        <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                        <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                    </svg>
                </button>
            )}

            {isRecording && (
                <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-full animate-pulse font-bold text-xs uppercase tracking-wider hover:bg-red-500"
                >
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    Stop
                </button>
            )}

            {isTranscribing && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-900/50 text-cyan-300 rounded-full border border-cyan-500/30 text-xs uppercase tracking-wider">
                    <SpinnerIcon className="w-3 h-3" />
                    Transcribing...
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
