
import React, { useState } from 'react';
import { MixdownResult, EQPreset, EQSettings, EQBand, FXSettings, AutomationPoint } from '../types';
import { ChartBarIcon, SpeakerWaveIcon, ArrowsRightLeftIcon, AdjustmentsHorizontalIcon, SparklesIcon, InputIcon, LinkIcon, BeakerIcon } from './Icons';
import EQBandControl from './EQBandControl';
import EQPresetManager from './EQPresetManager';
import AutomationEditor from './AutomationEditor';

const SettingsDisplay: React.FC<{ label: string; value: string | number; unit: string; tooltip?: string }> = ({ label, value, unit, tooltip }) => (
  <div className="flex justify-between items-baseline text-sm" title={tooltip}>
    <span className={`text-gray-400 ${tooltip ? 'cursor-help border-b border-dashed border-gray-600' : ''}`}>{label}</span>
    <span className="font-mono font-semibold text-cyan-300">{value} <span className="text-gray-500">{unit}</span></span>
  </div>
);

const SliderControl: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit: string;
    onChange: (value: number) => void;
    tooltip: string;
}> = ({ label, value, min, max, step, unit, onChange, tooltip }) => {
    const displayValue = () => {
        if (unit === 's') return value.toFixed(2);
        if (step < 1) return value.toFixed(1);
        return value.toFixed(0);
    };

    return (
        <div className="space-y-1" title={tooltip}>
            <div className="flex justify-between items-baseline text-sm">
                <span className="text-gray-400 cursor-help border-b border-dashed border-gray-600">{label}</span>
                <span className="font-mono font-semibold text-fuchsia-300">{displayValue()}<span className="text-gray-500">{unit}</span></span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                aria-label={label}
            />
        </div>
    );
};

const getPanTooltip = (position: number): string => {
    if (position === 0) {
        return "Pan: Center";
    }
    const direction = position < 0 ? 'Left' : 'Right';
    const percentage = Math.abs(position * 100).toFixed(0);
    return `Pan: ${position.toFixed(2)} (${percentage}% ${direction})`;
};

interface TrackCardProps {
    result: MixdownResult;
    trackDuration: number;
    isMuted: boolean;
    isSoloed: boolean;
    isAnyTrackSoloed: boolean;
    onToggleMute: () => void;
    onToggleSolo: () => void;
    onInputGainChange: (gainDb: number) => void;
    isPlaying: boolean;
    isLinked: boolean;
    onStartLinking: (trackName: string) => void;
    eqPresets: EQPreset[];
    onSaveEqPreset: (presetName: string) => void;
    onApplyEqPreset: (eqSettings: EQSettings) => void;
    onDeleteEqPreset: (presetName: string) => void;
    onEqChange: (bandIndex: number, updatedBand: EQBand) => void;
    onFxChange: (fxType: keyof FXSettings, param: string, value: number) => void;
    onAutomationChange: (type: 'volume' | 'pan', newPoints: AutomationPoint[]) => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ 
    result, 
    trackDuration,
    isMuted, 
    isSoloed, 
    isAnyTrackSoloed, 
    onToggleMute, 
    onToggleSolo, 
    onInputGainChange, 
    isPlaying,
    isLinked,
    onStartLinking,
    eqPresets,
    onSaveEqPreset,
    onApplyEqPreset,
    onDeleteEqPreset,
    onEqChange,
    onFxChange,
    onAutomationChange,
}) => {
  const [isAutomationVisible, setIsAutomationVisible] = useState(false);
  const [activeAutomation, setActiveAutomation] = useState<'volume' | 'pan'>('volume');
  const isAudible = isAnyTrackSoloed ? isSoloed : !isMuted;
  const cardOpacityClass = isPlaying && !isAudible ? 'opacity-40' : 'opacity-100';
  const panTooltip = getPanTooltip(result.panning.position);
  const inputGain = result.volume.inputGainDb ?? 0;
  const volumeAutomationPoints = result.automation?.clipGain ?? [];
  const panAutomationPoints = result.automation?.pan ?? [];

  return (
    <div className={`bg-gradient-to-br from-[#1a1a2e] to-[#10101f] border border-cyan-500/20 rounded-lg p-5 flex flex-col gap-6 shadow-lg transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] ${cardOpacityClass}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 min-w-0 mr-2">
            {isPlaying && isAudible && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0 shadow-[0_0_8px_rgba(0,255,255,0.7)]"></div>}
            <h3 className="text-xl font-bold text-white truncate" title={result.trackName}>
                {result.trackName}
            </h3>
            {isMuted && (
                <span className="text-xs font-bold bg-fuchsia-500 text-black px-2 py-0.5 rounded-md select-none flex-shrink-0 uppercase">Muted</span>
            )}
            {isSoloed && (
                <span className="text-xs font-bold bg-yellow-400 text-black px-2 py-0.5 rounded-md select-none flex-shrink-0 uppercase">Solo</span>
            )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
            <button 
                onClick={onToggleMute}
                className={`w-8 h-8 rounded-md font-bold text-sm flex items-center justify-center transition-colors ${isMuted ? 'bg-fuchsia-500 text-black' : 'bg-[#10101f] text-gray-300 hover:bg-fuchsia-500/20 border border-fuchsia-500/30'}`}
                title="Mute Track"
                aria-pressed={isMuted}
            >
                M
            </button>
            <button 
                onClick={onToggleSolo}
                className={`w-8 h-8 rounded-md font-bold text-sm flex items-center justify-center transition-colors ${isSoloed ? 'bg-yellow-400 text-black' : 'bg-[#10101f] text-gray-300 hover:bg-yellow-400/20 border border-yellow-400/30'}`}
                title="Solo Track"
                aria-pressed={isSoloed}
            >
                S
            </button>
        </div>
      </div>
      
      {/* Input Gain */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-300 flex items-center gap-2 uppercase tracking-wider text-sm">
                <InputIcon className="w-5 h-5 text-cyan-400"/>
                <span className="cursor-help border-b border-dashed border-gray-600" title="Adjusts the track's volume BEFORE any processing (EQ, compression). Use this for gain staging.">
                    Input Gain
                </span>
            </h4>
            <button 
                onClick={() => onStartLinking(result.trackName)} 
                className={`p-1 rounded-md transition-colors ${isLinked ? 'text-cyan-400 hover:text-cyan-300 bg-cyan-500/10' : 'text-gray-500 hover:text-white hover:bg-gray-700'}`}
                title="Link this parameter to other tracks"
            >
                <LinkIcon className="w-5 h-5" />
            </button>
        </div>
        <div className="bg-[#10101f] p-3 rounded-md">
            <div className="flex items-center gap-4">
                <input
                    type="range"
                    min="-24"
                    max="24"
                    step="0.1"
                    value={inputGain}
                    onChange={(e) => onInputGainChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    aria-label="Input Gain"
                />
                <span className="font-mono text-cyan-300 w-24 text-center bg-[#0a0a1a] py-1 rounded-md border border-cyan-500/20">{inputGain.toFixed(1)} dB</span>
            </div>
        </div>
      </div>

      {/* DSP Routing & Matrix */}
      {(result.busRouting || result.sidechain || result.midSide) && (
        <div className="space-y-2">
            <h4 className="font-semibold text-gray-300 flex items-center gap-2 uppercase tracking-wider text-sm">
                <SparklesIcon className="w-5 h-5 text-cyan-400"/>
                DSP Routing Matrix
            </h4>
            <div className="bg-[#10101f] p-3 rounded-md space-y-2">
                {result.busRouting && (
                    <SettingsDisplay 
                        label="Bus Assignment" 
                        value={result.busRouting.replace('_', ' ')} 
                        unit=""
                        tooltip="The strict frequency bus this track is routed to according to the Master Matrix."
                    />
                )}
                {result.sidechain?.enable && (
                    <SettingsDisplay 
                        label="Sidechain Ducking" 
                        value="ACTIVE" 
                        unit={`(${result.sidechain.releaseMs}ms)`}
                        tooltip="Amplitude envelope ducking triggered by the Kick drum for temporal masking."
                    />
                )}
                {result.midSide?.enable && (
                    <SettingsDisplay 
                        label="Mid/Side Processing" 
                        value="ACTIVE" 
                        unit=""
                        tooltip="Spatial allocation using Mid/Side EQ to ensure mono compatibility and clear the phantom center."
                    />
                )}
            </div>
        </div>
      )}

      {/* Channel Fader */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-300 flex items-center gap-2 uppercase tracking-wider text-sm"><SpeakerWaveIcon className="w-5 h-5 text-cyan-400"/>Channel Fader</h4>
        <div className="bg-[#10101f] p-3 rounded-md">
          <SettingsDisplay 
            label="Level" 
            value={result.volume.leveldB.toFixed(1)} 
            unit="dB"
            tooltip="The final volume of the track (post-processing) in decibels (dB). Adjust this to balance the track within the mix." 
          />
        </div>
      </div>

      {/* Automation */}
      <div className="space-y-2">
          <button
              onClick={() => setIsAutomationVisible(!isAutomationVisible)}
              className="w-full font-semibold text-gray-300 flex items-center justify-between gap-2 uppercase tracking-wider text-sm"
              aria-expanded={isAutomationVisible}
          >
              <span className="flex items-center gap-2">
                  <BeakerIcon className="w-5 h-5 text-cyan-400" />
                  Automation
              </span>
              <span className={`transition-transform duration-300 ${isAutomationVisible ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {isAutomationVisible && (
              <div className="bg-[#10101f] p-3 rounded-md animate-fade-in-sm space-y-3">
                  <div className="flex gap-2">
                      <button 
                          onClick={() => setActiveAutomation('volume')}
                          className={`flex-1 py-1 text-xs font-bold uppercase rounded transition-colors ${activeAutomation === 'volume' ? 'bg-fuchsia-500 text-black' : 'bg-black/40 text-gray-400 hover:bg-fuchsia-500/20'}`}
                      >
                          Volume
                      </button>
                      <button 
                          onClick={() => setActiveAutomation('pan')}
                          className={`flex-1 py-1 text-xs font-bold uppercase rounded transition-colors ${activeAutomation === 'pan' ? 'bg-cyan-500 text-black' : 'bg-black/40 text-gray-400 hover:bg-cyan-500/20'}`}
                      >
                          Pan
                      </button>
                  </div>
                  <AutomationEditor
                      points={activeAutomation === 'volume' ? volumeAutomationPoints : panAutomationPoints}
                      onChange={(points) => onAutomationChange(activeAutomation, points)}
                      duration={trackDuration}
                      type={activeAutomation}
                  />
              </div>
          )}
      </div>

      {/* Compression */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-300 flex items-center gap-2 uppercase tracking-wider text-sm"><AdjustmentsHorizontalIcon className="w-5 h-5 text-cyan-400"/>Compression</h4>
        <div className="bg-[#10101f] p-3 rounded-md space-y-2">
          <SettingsDisplay 
            label="Threshold" 
            value={result.compression.thresholddB.toFixed(1)} 
            unit="dB"
            tooltip="The volume level (in dB) at which the compressor starts working. Sounds louder than this will be turned down, taming peaks and increasing overall loudness."
          />
          <SettingsDisplay 
            label="Ratio" 
            value={`${result.compression.ratio.toFixed(1)}:1`} 
            unit=""
            tooltip="The amount of volume reduction. A 4:1 ratio means for every 4dB the signal goes above the threshold, the output will only increase by 1dB. Higher ratios mean more aggressive compression."
          />
          <SettingsDisplay 
            label="Attack" 
            value={result.compression.attackMs} 
            unit="ms"
            tooltip="How quickly (in milliseconds) the compressor starts reducing volume. A fast attack tames sharp transients (like a snare hit), while a slow attack preserves them."
          />
          <SettingsDisplay 
            label="Release" 
            value={result.compression.releaseMs} 
            unit="ms"
            tooltip="How quickly (in milliseconds) the compressor stops working after the signal falls below the threshold. A fast release can sound punchy, while a slow release is smoother."
          />
        </div>
      </div>

      {/* EQ */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-300 flex items-center gap-2 uppercase tracking-wider text-sm"><ChartBarIcon className="w-5 h-5 text-cyan-400"/>Equalization</h4>
            <EQPresetManager
                presets={eqPresets}
                onSelect={(preset) => onApplyEqPreset({ bands: preset.bands })}
                onSave={onSaveEqPreset}
                onDelete={onDeleteEqPreset}
            />
        </div>
        <div className="bg-[#10101f] p-3 rounded-md space-y-3">
            {result.eq.bands.map((band, i) => (
                <EQBandControl
                    key={i}
                    band={band}
                    bandIndex={i}
                    onChange={onEqChange}
                />
            ))}
        </div>
      </div>

      {/* Panning */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-300 flex items-center gap-2 uppercase tracking-wider text-sm"><ArrowsRightLeftIcon className="w-5 h-5 text-cyan-400"/>Panning & Stereo Image</h4>
        <div className="bg-[#10101f] p-4 rounded-md">
            <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500">L</span>
                <div className="w-full bg-gray-700 h-1.5 rounded-full relative">
                    <div className="absolute h-full w-px bg-cyan-900 left-1/2 -translate-x-1/2"></div>
                    <div
                        className="absolute top-1/2 h-4 w-4 bg-cyan-400 rounded-full border-2 border-[#10101f] shadow-lg shadow-cyan-500/50"
                        style={{ left: `${(result.panning.position + 1) / 2 * 100}%`, transform: 'translate(-50%, -50%)' }}
                        title={panTooltip}
                    />
                </div>
                <span className="text-xs font-bold text-gray-500">R</span>
            </div>
            <p className="text-sm text-gray-300 italic mt-4 text-center">"{result.panning.advice}"</p>
        </div>
      </div>

      {/* FX */}
      {result.fx && (
        <div className="space-y-2 animate-fade-in border-t border-fuchsia-500/20 pt-4">
          <h4 className="font-semibold text-gray-300 flex items-center gap-2 uppercase tracking-wider text-sm"><SparklesIcon className="w-5 h-5 text-fuchsia-400"/>Creative FX</h4>
          <div className="bg-[#10101f] p-3 rounded-md space-y-4">
            <div>
                <h5 className="text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Saturation</h5>
                <div className="space-y-2">
                    <SliderControl 
                        label="Drive"
                        value={result.fx.saturation.drive}
                        min={1} max={10} step={0.1} unit=""
                        onChange={(v) => onFxChange('saturation', 'drive', v)}
                        tooltip="How much harmonic distortion to add. Higher values create a warmer, richer, or more aggressive sound." 
                    />
                    <SliderControl 
                        label="Tone"
                        value={result.fx.saturation.tone}
                        min={1} max={10} step={0.1} unit=""
                        onChange={(v) => onFxChange('saturation', 'tone', v)}
                        tooltip="Shapes the character of the saturation. Lower values are darker/warmer, higher values are brighter/harsher."
                    />
                </div>
            </div>
            <div>
                <h5 className="text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Reverb</h5>
                 <div className="space-y-2">
                    <SliderControl
                        label="Decay"
                        value={result.fx.reverb.decayS}
                        min={0.1} max={10} step={0.05} unit="s"
                        onChange={(v) => onFxChange('reverb', 'decayS', v)}
                        tooltip="The time (in seconds) it takes for the reverb tail to fade away. Longer decays create a sense of a larger space."
                    />
                    <SliderControl
                        label="Mix"
                        value={result.fx.reverb.mixPercent}
                        min={0} max={100} step={1} unit="%"
                        onChange={(v) => onFxChange('reverb', 'mixPercent', v)}
                        tooltip="The balance between the original 'dry' signal and the 'wet' reverb signal. Higher percentage means more reverb."
                    />
                </div>
            </div>
            <div>
                <h5 className="text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Delay</h5>
                <div className="space-y-2">
                    <SliderControl
                        label="Time"
                        value={result.fx.delay.timeMs}
                        min={1} max={2000} step={1} unit="ms"
                        onChange={(v) => onFxChange('delay', 'timeMs', v)}
                        tooltip="The time (in milliseconds) between the original sound and its echo. Often synchronized to the song's tempo."
                    />
                    <SliderControl
                        label="Feedback"
                        value={result.fx.delay.feedbackPercent}
                        min={0} max={100} step={1} unit="%"
                        onChange={(v) => onFxChange('delay', 'feedbackPercent', v)}
                        tooltip="The percentage of the delayed signal that is fed back into the delay input, creating multiple echoes. Higher values create more repeats."
                    />
                    <SliderControl
                        label="Mix"
                        value={result.fx.delay.mixPercent}
                        min={0} max={100} step={1} unit="%"
                        onChange={(v) => onFxChange('delay', 'mixPercent', v)}
                        tooltip="The balance between the original 'dry' signal and the 'wet' delay signal. Higher percentage means a louder echo."
                    />
                </div>
            </div>
            {result.fx.autoPan && result.fx.autoPan.rateHz > 0 && (
                <div>
                    <h5 className="text-xs font-bold uppercase text-gray-400 pt-2 tracking-widest">Auto-Pan</h5>
                    <SettingsDisplay
                        label="Rate"
                        value={result.fx.autoPan.rateHz.toFixed(2)}
                        unit="Hz"
                        tooltip="The speed of the left-right panning effect."
                    />
                    <SettingsDisplay
                        label="Depth"
                        value={(result.fx.autoPan.depth * 100).toFixed(0)}
                        unit="%"
                        tooltip="The width of the panning effect. 100% is a full sweep from left to right."
                    />
                </div>
            )}
            {result.fx.limiter && (
                <div className="pt-2">
                    <h5 className="text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Limiter</h5>
                    <div className="space-y-2">
                        <SliderControl
                            label="Threshold"
                            value={result.fx.limiter.thresholddB}
                            min={-24} max={0} step={0.1} unit="dB"
                            onChange={(v) => onFxChange('limiter', 'thresholddB', v)}
                            tooltip="The maximum level (ceiling) the track's peaks will reach. The limiter prevents audio from getting louder than this value."
                        />
                        <SliderControl
                            label="Release"
                            value={result.fx.limiter.releaseMs}
                            min={1} max={1000} step={1} unit="ms"
                            onChange={(v) => onFxChange('limiter', 'releaseMs', v)}
                            tooltip="How quickly (in milliseconds) the limiter stops reducing volume after a peak has passed. Faster releases are more aggressive."
                        />
                    </div>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackCard;
