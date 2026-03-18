
export enum AppState {
    IDLE = 'IDLE',
    FILES_UPLOADED = 'FILES_UPLOADED',
    PROCESSING_STAGE1 = 'PROCESSING_STAGE1',
    RESULTS_STAGE1 = 'RESULTS_STAGE1',
    PROCESSING_STAGE2 = 'PROCESSING_STAGE2',
    RESULTS_STAGE2 = 'RESULTS_STAGE2'
}

export interface EQBand {
    type: 'LOW_SHELF' | 'PEAK' | 'HIGH_SHELF';
    frequencyHz: number;
    gaindB: number;
    q: number;
}

export interface EQSettings {
    bands: EQBand[];
}

export interface EQPreset {
    name: string;
    bands: EQBand[];
}

export interface CompressionSettings {
    thresholddB: number;
    ratio: number;
    attackMs: number;
    releaseMs: number;
}

export interface VolumeSettings {
    leveldB: number;
    inputGainDb?: number; 
}

export interface PanningSettings {
    advice: string;
    position: number; 
}

export interface SaturationSettings {
    drive: number;
    tone: number;
}

export interface ReverbSettings {
    decayS: number;
    mixPercent: number;
}

export interface DelaySettings {
    timeMs: number;
    feedbackPercent: number;
    mixPercent: number;
}

export interface AutoPanSettings {
    rateHz: number; 
    depth: number;  
}

export interface LimiterSettings {
    thresholddB: number;
    releaseMs: number;
}

export interface FXSettings {
    saturation: SaturationSettings;
    reverb: ReverbSettings;
    delay: DelaySettings;
    autoPan?: AutoPanSettings;
    limiter?: LimiterSettings;
}

export interface AutomationPoint {
    time: number; 
    value: number; 
}

export interface AutomationSettings {
    clipGain?: AutomationPoint[];
    pan?: AutomationPoint[];
    effectsParameters?: Record<string, any>; 
}

export interface MixdownResult {
    trackName: string;
    preMixAdvice?: string;
    busRouting?: 'ANCHOR' | 'BUS_A' | 'BUS_B' | 'BUS_C';
    sidechain?: { enable: boolean; releaseMs: number; };
    midSide?: { enable: boolean; };
    volume: VolumeSettings;
    compression: CompressionSettings;
    eq: EQSettings;
    panning: PanningSettings;
    automation?: AutomationSettings;
    fx?: FXSettings;
}

export interface TrackState {
    isMuted: boolean;
    isSoloed: boolean;
}
  
export type TrackStates = Record<string, TrackState>;

export type LinkGroup = string[];

export interface Project {
    id: string;
    name: string;
    genre: string;
    appState: AppState;
    trackNames: string[];
    mixdownResults: MixdownResult[];
    trackStates: TrackStates;
    links: LinkGroup[];
    createdAt: number; 
}

/**
 * Interface representing a Firebase User. 
 * Added to resolve the "Module has no exported member 'FirebaseUser'" error in ResultsView.tsx.
 */
export interface FirebaseUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
}

declare global {
    interface Window {
        aistudio: {
            hasSelectedApiKey: () => Promise<boolean>;
            openSelectKey: () => Promise<void>;
        };
    }
}
