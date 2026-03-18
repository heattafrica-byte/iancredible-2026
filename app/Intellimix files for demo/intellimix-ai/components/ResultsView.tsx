
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MixdownResult, AppState, TrackStates, TrackState, LinkGroup, EQPreset, EQBand, EQSettings, FXSettings, AutomationPoint } from '../types';
import TrackCard from './TrackCard';
import { DownloadIcon, SparklesIcon, WavIcon, BrainIcon, SpinnerIcon, BookmarkSquareIcon, ClipboardDocumentIcon } from './Icons';
import MasteringAdviceModal from './MasteringAdviceModal';
import { usePlayback } from '../hooks/usePlayback';
import AudioVisualizer from './AudioVisualizer';
import PlaybackControls from './PlaybackControls';
import VUMeter from './VUMeter';
import AudioRecorder from './AudioRecorder';
import { getGenreResearch } from '../services/geminiService';
import LiveAssistant from './LiveAssistant';
import VisualizerHub from './VisualizerHub';
import StudioSearch from './StudioSearch';
import { AudioAnalysisResult } from '../utils/audioAnalysis';

interface ResultsViewProps {
  results: MixdownResult[];
  appState: AppState;
  audioBuffers: Map<string, AudioBuffer> | null;
  onAddFX: () => void;
  onExportInsights: () => void;
  onExportWav: () => void;
  onExportFlac: () => void;
  onSaveProject: () => void;
  exportStatus: string | null;
  sampleRate: number;
  onSampleRateChange: (rate: number) => void;
  onGetMasteringAdvice: () => void;
  isMasteringAssistantLoading: boolean;
  masteringAdvice: string | null;
  onClearMasteringAdvice: () => void;
  onAnalyzeMaster: () => void;
  analysisResult: AudioAnalysisResult | null;
  isAnalyzing: boolean;
  trackStates: TrackStates;
  onToggleMute: (trackName: string) => void;
  onToggleSolo: (trackName: string) => void;
  onInputGainChange: (trackName: string, gainDb: number) => void;
  links: LinkGroup[];
  onStartLinking: (trackName: string) => void;
  eqPresets: EQPreset[];
  onSaveEqPreset: (trackName: string, presetName: string) => void;
  onApplyEqPreset: (trackName: string, eqSettings: EQSettings) => void;
  onDeleteEqPreset: (presetName: string) => void;
  onEqChange: (trackName: string, bandIndex: number, updatedBand: EQBand) => void;
  onFxChange: (trackName: string, fxType: keyof FXSettings, param: string, value: number) => void;
  onAutomationChange: (trackName: string, type: 'volume' | 'pan', newPoints: AutomationPoint[]) => void;
  genre: string;
  isPro: boolean;
  onOpenSubscription: () => void;
  applyMastering: boolean;
  onToggleMastering: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ 
  results, 
  appState, 
  audioBuffers,
  onAddFX, 
  onExportInsights, 
  onExportWav,
  onExportFlac,
  onSaveProject,
  exportStatus, 
  sampleRate, 
  onSampleRateChange,
  onGetMasteringAdvice,
  isMasteringAssistantLoading,
  masteringAdvice,
  onClearMasteringAdvice,
  onAnalyzeMaster,
  analysisResult,
  isAnalyzing,
  trackStates,
  onToggleMute,
  onToggleSolo,
  onInputGainChange,
  links,
  onStartLinking,
  eqPresets,
  onSaveEqPreset,
  onApplyEqPreset,
  onDeleteEqPreset,
  onEqChange,
  onFxChange,
  onAutomationChange,
  genre,
  isPro,
  onOpenSubscription,
  applyMastering,
  onToggleMastering
}) => {
  const isAnyTrackSoloed = Object.values(trackStates).some((s: TrackState) => s.isSoloed);
  const linkedTrackNames = useMemo(() => new Set(links.flat()), [links]);
  const { isPlaying, isLoading, analyserNode, vuAnalyserNodes, togglePlayback, stopPlayback, trackDurations } = usePlayback(sampleRate, results, audioBuffers);
  
  const [sessionNotes, setSessionNotes] = useState<string[]>([]);
  const [isTrendAnalyzing, setIsTrendAnalyzing] = useState(false);
  const [isLiveAssistantOpen, setIsLiveAssistantOpen] = useState(false);
  const [isVisualizerHubOpen, setIsVisualizerHubOpen] = useState(false);
  const [isStudioSearchOpen, setIsStudioSearchOpen] = useState(false);

  useEffect(() => {
    return () => stopPlayback();
  }, [results, stopPlayback]);

  const handleTogglePlayback = useCallback(() => {
    togglePlayback(trackStates);
  }, [trackStates, togglePlayback]);

  const handleExport = (exportFn: () => void) => {
    stopPlayback();
    exportFn();
  };

  const handleAnalyzeTrends = async () => {
    if (!genre) return alert("Specify a genre to analyze trends.");
    setIsTrendAnalyzing(true);
    try {
        const data = await getGenreResearch(genre);
        alert(`Analysis for ${genre}:\n\n${data.text}\n\nSources:\n${data.sources.join('\n')}`);
    } catch (e) {
        alert("Trend data analysis failed.");
    } finally {
        setIsTrendAnalyzing(false);
    }
  };

  const trackNames = useMemo(() => results.map(r => r.trackName), [results]);

  return (
    <div className="w-full pb-20">
       {masteringAdvice && <MasteringAdviceModal advice={masteringAdvice} onClose={onClearMasteringAdvice} />}
       
       <LiveAssistant isOpen={isLiveAssistantOpen} onClose={() => setIsLiveAssistantOpen(false)} />
       <VisualizerHub isOpen={isVisualizerHubOpen} onClose={() => setIsVisualizerHubOpen(false)} genre={genre} tracks={trackNames} />
       <StudioSearch isOpen={isStudioSearchOpen} onClose={() => setIsStudioSearchOpen(false)} />

       <div className="mb-8 p-4 bg-black/50 border border-cyan-500/30 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4 text-center uppercase text-shadow-glow-cyan">Master Stage</h2>
          <div className="flex justify-around items-center gap-8">
            <VUMeter analyserNode={vuAnalyserNodes.left} label="L" />
            <PlaybackControls isPlaying={isPlaying} isLoading={isLoading} onTogglePlayback={handleTogglePlayback} onStopPlayback={stopPlayback} />
            <VUMeter analyserNode={vuAnalyserNodes.right} label="R" />
          </div>
          <div className="mt-6 bg-[#10101f] p-2 rounded">
            <AudioVisualizer analyserNode={analyserNode} />
          </div>
          
          <div className="mt-6 border-t border-white/10 pt-4 flex flex-col items-center">
             <button onClick={onAnalyzeMaster} disabled={isAnalyzing} className="bg-[#1a1a2e] border border-cyan-500/30 text-white text-xs font-bold uppercase py-2 px-4 rounded hover:bg-cyan-500/10 mb-4">
                 {isAnalyzing ? <SpinnerIcon className="w-4 h-4 inline mr-2"/> : <BrainIcon className="w-4 h-4 inline mr-2"/>}
                 Analyze Master (LUFS & Crest Factor)
             </button>
             {analysisResult && (
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl text-center">
                     <div className="bg-black/40 p-3 rounded border border-cyan-500/20">
                         <div className="text-[10px] text-gray-400 uppercase tracking-widest">Integrated LUFS</div>
                         <div className={`text-xl font-mono font-bold ${analysisResult.lufsIntegrated > -10 ? 'text-red-400' : 'text-cyan-400'}`}>{analysisResult.lufsIntegrated}</div>
                     </div>
                     <div className="bg-black/40 p-3 rounded border border-cyan-500/20">
                         <div className="text-[10px] text-gray-400 uppercase tracking-widest">Short-Term Max</div>
                         <div className={`text-xl font-mono font-bold ${analysisResult.lufsShortTermMax > -8 ? 'text-red-400' : 'text-cyan-400'}`}>{analysisResult.lufsShortTermMax}</div>
                     </div>
                     <div className="bg-black/40 p-3 rounded border border-cyan-500/20">
                         <div className="text-[10px] text-gray-400 uppercase tracking-widest">True Peak</div>
                         <div className={`text-xl font-mono font-bold ${analysisResult.truePeak > -0.3 ? 'text-red-400' : 'text-cyan-400'}`}>{analysisResult.truePeak} dB</div>
                     </div>
                     <div className="bg-black/40 p-3 rounded border border-cyan-500/20">
                         <div className="text-[10px] text-gray-400 uppercase tracking-widest">Crest Factor</div>
                         <div className={`text-xl font-mono font-bold ${analysisResult.crestFactor < 4 ? 'text-red-400' : 'text-cyan-400'}`}>{analysisResult.crestFactor} dB</div>
                     </div>
                 </div>
             )}
          </div>
       </div>

       <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
         <div>
            <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">Mixdown Output</h2>
            <div className="flex gap-2 mt-2">
                <button onClick={handleAnalyzeTrends} className="text-[10px] font-bold uppercase bg-cyan-900/40 border border-cyan-500/20 px-2 py-1 rounded text-cyan-400 hover:bg-cyan-900/60">
                    {isTrendAnalyzing ? <SpinnerIcon className="w-3 h-3"/> : "Research Trends"}
                </button>
                <button onClick={() => setIsStudioSearchOpen(true)} className="text-[10px] font-bold uppercase bg-cyan-900/40 border border-cyan-500/20 px-2 py-1 rounded text-cyan-400 hover:bg-cyan-900/60">
                    Find Studios
                </button>
            </div>
         </div>

          <div className="flex items-center gap-3">
            {!isPro && (
                <button 
                    onClick={onOpenSubscription}
                    className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white text-[10px] font-black uppercase px-4 py-2 rounded-full shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform mr-2"
                >
                    Unlock Pro
                </button>
            )}
            <div className="flex bg-black/40 p-1 border border-white/5 rounded-lg mr-2">
                <button onClick={() => setIsLiveAssistantOpen(true)} className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded" title="Voice Assistant">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                </button>
                <button onClick={() => setIsVisualizerHubOpen(true)} className="p-2 text-fuchsia-400 hover:bg-fuchsia-500/10 rounded" title="Video/Art Studio">
                    <SparklesIcon className="w-6 h-6" />
                </button>
                <div className="w-px bg-white/10 mx-2 h-6 my-auto"></div>
                <AudioRecorder onTranscription={t => setSessionNotes(p => [...p, t])} />
            </div>

            <button onClick={onSaveProject} className="bg-[#1a1a2e] border border-cyan-500/30 text-white text-xs font-bold uppercase py-2 px-4 rounded hover:bg-cyan-500/10">
                <BookmarkSquareIcon className="w-4 h-4 inline mr-2"/> Save
            </button>
            <button onClick={() => handleExport(onExportInsights)} className="bg-[#1a1a2e] border border-cyan-500/30 text-white text-xs font-bold uppercase py-2 px-4 rounded hover:bg-cyan-500/10">
                <DownloadIcon className="w-4 h-4 inline mr-2"/> Insights
            </button>
            <button onClick={onGetMasteringAdvice} disabled={isMasteringAssistantLoading} className="bg-[#1a1a2e] border border-cyan-500/30 text-white text-xs font-bold uppercase py-2 px-4 rounded hover:bg-cyan-500/10">
                {isMasteringAssistantLoading ? <SpinnerIcon className="w-4 h-4 inline mr-2"/> : <BrainIcon className="w-4 h-4 inline mr-2"/>}
                Mastering
            </button>
            <div className="relative flex flex-col items-end gap-2">
                <div className="flex gap-2">
                    <button onClick={() => handleExport(onExportWav)} disabled={exportStatus !== null} className="bg-fuchsia-600 text-white text-xs font-bold uppercase py-2 px-4 rounded hover:bg-fuchsia-500" title="Export as 24-bit 48kHz WAV">
                        {exportStatus ? <SpinnerIcon className="w-4 h-4 inline mr-2"/> : <WavIcon className="w-4 h-4 inline mr-2"/>}
                        WAV
                    </button>
                    <button onClick={() => handleExport(onExportFlac)} disabled={exportStatus !== null} className="bg-cyan-600 text-white text-xs font-bold uppercase py-2 px-4 rounded hover:bg-cyan-500" title="Export as Lossless FLAC">
                        {exportStatus ? <SpinnerIcon className="w-4 h-4 inline mr-2"/> : <WavIcon className="w-4 h-4 inline mr-2"/>}
                        FLAC
                    </button>
                </div>
                {exportStatus && (
                    <div className="absolute -bottom-6 right-0 text-[10px] text-cyan-400 font-bold uppercase whitespace-nowrap animate-pulse">
                        {exportStatus}
                    </div>
                )}
                <label className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                    <input 
                        type="checkbox" 
                        checked={applyMastering} 
                        onChange={onToggleMastering} 
                        className="w-3 h-3 accent-cyan-500"
                    />
                    Auto-Master (FLAC only)
                </label>
            </div>
         </div>
       </div>

       {/* Pre-Mix Analysis Section */}
       {appState === AppState.RESULTS_STAGE1 && results.some(r => r.preMixAdvice) && (
         <div className="mb-8 p-6 bg-cyan-900/20 border border-cyan-500/50 rounded-lg shadow-lg">
            <h3 className="text-cyan-400 text-lg font-bold uppercase mb-4 flex items-center gap-2">
                <BrainIcon className="w-5 h-5" /> Pre-Mix Analysis & Mentorship
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((result, idx) => result.preMixAdvice ? (
                    <div key={idx} className="bg-black/40 p-4 rounded border border-cyan-500/20">
                        <span className="text-cyan-300 font-bold block mb-1">{result.trackName}</span>
                        <p className="text-sm text-gray-300 leading-relaxed">{result.preMixAdvice}</p>
                    </div>
                ) : null)}
            </div>
         </div>
       )}

       {sessionNotes.length > 0 && (
         <div className="mb-8 p-4 bg-[#10101f] border border-gray-700 rounded-lg">
            <h3 className="text-gray-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                <ClipboardDocumentIcon className="w-4 h-4" /> Session Log
            </h3>
            <div className="space-y-2">
                {sessionNotes.map((note, idx) => (
                    <div key={idx} className="bg-black/30 p-2 text-sm text-gray-300 border-l-2 border-fuchsia-500">"{note}"</div>
                ))}
            </div>
         </div>
       )}
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => (
          <TrackCard 
            key={result.trackName} 
            result={result}
            trackDuration={trackDurations.get(result.trackName) || 0}
            isMuted={trackStates[result.trackName]?.isMuted ?? false}
            isSoloed={trackStates[result.trackName]?.isSoloed ?? false}
            isAnyTrackSoloed={isAnyTrackSoloed}
            onToggleMute={() => onToggleMute(result.trackName)}
            onToggleSolo={() => onToggleSolo(result.trackName)}
            onInputGainChange={(gainDb) => onInputGainChange(result.trackName, gainDb)}
            isPlaying={isPlaying}
            isLinked={linkedTrackNames.has(result.trackName)}
            onStartLinking={onStartLinking}
            eqPresets={eqPresets}
            onSaveEqPreset={(presetName) => onSaveEqPreset(result.trackName, presetName)}
            onApplyEqPreset={(eqSettings) => onApplyEqPreset(result.trackName, eqSettings)}
            onDeleteEqPreset={onDeleteEqPreset}
            onEqChange={(bandIndex, updatedBand) => onEqChange(result.trackName, bandIndex, updatedBand)}
            onFxChange={(fxType, param, value) => onFxChange(result.trackName, fxType, param, value)}
            onAutomationChange={(type, newPoints) => onAutomationChange(result.trackName, type, newPoints)}
          />
        ))}
       </div>

       {appState === AppState.RESULTS_STAGE1 && (
        <div className="mt-12 text-center p-12 bg-black/50 border border-fuchsia-500/30 rounded-lg shadow-xl">
          <h3 className="text-2xl font-bold text-white uppercase text-shadow-glow-fuchsia">Base Mix Complete</h3>
          <p className="text-gray-400 mt-2 max-w-lg mx-auto">The initial balance is ready. Now add textures, depth, and spatial movement.</p>
          <button 
            onClick={isPro ? onAddFX : onOpenSubscription} 
            className="mt-6 bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white font-bold py-4 px-12 rounded shadow-lg hover:scale-105 transition-all uppercase tracking-widest"
          >
            <SparklesIcon className="w-6 h-6 inline mr-2" /> 
            {isPro ? "Apply Stage 2 FX" : "Unlock Stage 2 FX with Pro"}
          </button>
        </div>
       )}
    </div>
  );
};

export default ResultsView;
