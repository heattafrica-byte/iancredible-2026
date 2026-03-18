import React from 'react';
import { EQBand } from '../types';

interface EQBandControlProps {
  band: EQBand;
  bandIndex: number;
  onChange: (bandIndex: number, updatedBand: EQBand) => void;
}

const MIN_FREQ = 20;
const MAX_FREQ = 20000;
const MIN_LOG_FREQ = Math.log(MIN_FREQ);
const MAX_LOG_FREQ = Math.log(MAX_FREQ);
const LOG_RANGE = MAX_LOG_FREQ - MIN_LOG_FREQ;

// Convert a frequency value to a 0-100 scale for the slider
const freqToSliderVal = (freq: number): number => {
    return ((Math.log(freq) - MIN_LOG_FREQ) / LOG_RANGE) * 100;
};

// Convert a 0-100 slider value to a frequency
const sliderValToFreq = (val: number): number => {
    return Math.exp(MIN_LOG_FREQ + (val / 100) * LOG_RANGE);
};


const SliderControl: React.FC<{
    label: string, 
    value: number, 
    min: number, 
    max: number, 
    step: number,
    unit: string, 
    onChange: (value: number) => void,
    disabled?: boolean,
    isLog?: boolean
}> = ({ label, value, min, max, step, unit, onChange, disabled, isLog }) => {
    
    const sliderValue = isLog ? freqToSliderVal(value) : value;
    const minSlider = isLog ? 0 : min;
    const maxSlider = isLog ? 100 : max;
    const stepSlider = isLog ? 0.1 : step;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sliderVal = parseFloat(e.target.value);
        const finalVal = isLog ? sliderValToFreq(sliderVal) : sliderVal;
        onChange(finalVal);
    };

    const displayValue = isLog 
        ? (value < 1000 ? value.toFixed(0) : (value / 1000).toFixed(1) + 'k')
        : value.toFixed(1);

    return (
        <div className="grid grid-cols-6 items-center gap-2 text-xs">
            <label htmlFor={`${label}-${Math.random()}`} className="text-gray-400 col-span-1">{label}</label>
            <input
                id={`${label}-${Math.random()}`}
                type="range"
                min={minSlider}
                max={maxSlider}
                step={stepSlider}
                value={sliderValue}
                onChange={handleChange}
                disabled={disabled}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed col-span-4"
            />
            <span className={`font-mono text-cyan-300 w-14 text-center bg-[#0a0a1a] py-1 rounded-md border border-cyan-500/20 ${disabled ? 'text-gray-500' : ''}`}>
                {displayValue}{unit}
            </span>
        </div>
    );
};

const EQBandControl: React.FC<EQBandControlProps> = ({ band, bandIndex, onChange }) => {
    const handleParamChange = (param: keyof EQBand, value: string | number) => {
        let numericValue = typeof value === 'string' ? parseFloat(value) : value;
        // Clamp values to sane ranges
        if (param === 'frequencyHz') numericValue = Math.max(MIN_FREQ, Math.min(MAX_FREQ, numericValue));
        if (param === 'gaindB') numericValue = Math.max(-24, Math.min(24, numericValue));
        if (param === 'q') numericValue = Math.max(0.1, Math.min(30, numericValue));
        
        const updatedBand = { ...band, [param]: param === 'type' ? value : numericValue };
        onChange(bandIndex, updatedBand);
    };

    const isShelf = band.type === 'LOW_SHELF' || band.type === 'HIGH_SHELF';

    return (
        <div className="p-2 bg-[#1a1a2e]/60 rounded-md space-y-2 border-l-2 border-cyan-500/50">
            <div className="flex items-center gap-2">
                 <select
                    value={band.type}
                    onChange={(e) => handleParamChange('type', e.target.value)}
                    className="bg-gray-700 text-white text-xs rounded p-1 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                    <option value="PEAK">Peak</option>
                    <option value="LOW_SHELF">Low Shelf</option>
                    <option value="HIGH_SHELF">High Shelf</option>
                </select>
                <div className="w-full space-y-1">
                    <SliderControl
                        label="Freq"
                        value={band.frequencyHz}
                        min={MIN_FREQ}
                        max={MAX_FREQ}
                        step={1}
                        unit="Hz"
                        onChange={(v) => handleParamChange('frequencyHz', v)}
                        isLog
                    />
                     <SliderControl
                        label="Gain"
                        value={band.gaindB}
                        min={-18}
                        max={18}
                        step={0.1}
                        unit="dB"
                        onChange={(v) => handleParamChange('gaindB', v)}
                    />
                     <SliderControl
                        label="Q"
                        value={band.q}
                        min={0.1}
                        max={18}
                        step={0.1}
                        unit=""
                        onChange={(v) => handleParamChange('q', v)}
                        disabled={isShelf}
                    />
                </div>
            </div>
        </div>
    );
};

export default EQBandControl;