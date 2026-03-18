import React, { useRef, useEffect, useState } from 'react';

interface VUMeterProps {
  analyserNode: AnalyserNode | null;
  label: string;
}

const dbfsToRotation = (dbfs: number): number => {
    // A linear mapping from -45 dBFS to -5 dBFS to a -45 to +45 degree rotation.
    // This provides a good range for typical mix levels.
    const MIN_DB = -45;
    const MAX_DB = -5;
    const MIN_ANGLE = -45;
    const MAX_ANGLE = 45;

    if (dbfs < MIN_DB) return MIN_ANGLE;
    if (dbfs > MAX_DB) return MAX_ANGLE;

    const dbRange = MAX_DB - MIN_DB;
    const angleRange = MAX_ANGLE - MIN_ANGLE;
    const percent = (dbfs - MIN_DB) / dbRange;
    
    return MIN_ANGLE + percent * angleRange;
};

const VUMeter: React.FC<VUMeterProps> = ({ analyserNode, label }) => {
    const [rotation, setRotation] = useState(-45);
    const smoothedDbRef = useRef(-60);

    useEffect(() => {
        if (!analyserNode) return;

        analyserNode.fftSize = 1024;
        const timeDomainData = new Float32Array(analyserNode.fftSize);
        let animationFrameId: number;

        const draw = () => {
            animationFrameId = requestAnimationFrame(draw);

            analyserNode.getFloatTimeDomainData(timeDomainData);

            let sumSquares = 0.0;
            for (const amplitude of timeDomainData) {
                sumSquares += amplitude * amplitude;
            }
            const rms = Math.sqrt(sumSquares / timeDomainData.length);
            const dbfs = 20 * Math.log10(rms || 1e-10); // Use a floor to avoid -Infinity

            // Apply smoothing for VU ballistics (slow response)
            const smoothingFactor = 0.95; // Slower response
            smoothedDbRef.current = smoothingFactor * smoothedDbRef.current + (1 - smoothingFactor) * dbfs;
            
            const newRotation = dbfsToRotation(smoothedDbRef.current);
            setRotation(newRotation);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [analyserNode]);

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="w-32 h-20 bg-black/50 border-2 border-cyan-500/30 rounded-md shadow-inner relative overflow-hidden p-2">
                {/* Meter Background */}
                <div className="absolute inset-0 flex justify-center items-end">
                    <div className="w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent">
                        <div className="w-full h-full border-t border-cyan-800/50 rounded-t-full"></div>
                    </div>
                </div>

                {/* Scale Markings */}
                <div className="absolute inset-2 text-cyan-500/70 text-[8px] font-mono">
                    <span className="absolute left-[15%]" style={{transform: 'translate(-50%) rotate(-45deg)'}}>-20</span>
                    <span className="absolute left-[30%]" style={{transform: 'translate(-50%) rotate(-22deg)'}}>-7</span>
                    <span className="absolute left-1/2 top-[5%]" style={{transform: 'translateX(-50%)'}}>0</span>
                    <span className="absolute left-[80%]" style={{transform: 'translate(-50%) rotate(35deg)'}}>+3</span>
                </div>
                {/* Red zone */}
                <div 
                    className="absolute bottom-0 left-1/2 w-[200%] h-[100%] origin-bottom"
                    style={{
                        transform: 'translateX(-50%) rotate(-45deg)',
                        background: 'conic-gradient(from 120deg, transparent 0 15deg, #ff00f340 15deg 22.5deg, transparent 22.5deg 90deg)'
                    }}
                ></div>

                {/* Needle */}
                <div
                    className="absolute bottom-2 left-1/2 w-px h-10 bg-fuchsia-400 origin-bottom transition-transform duration-75 ease-out shadow-[0_0_5px_rgba(255,0,243,1)]"
                    style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
                >
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#10101f] border border-fuchsia-400 rounded-full"></div>
                </div>
            </div>
            <span className="font-bold text-gray-400 bg-[#1a1a2e] px-3 py-0.5 rounded-md text-sm border border-cyan-500/20">{label}</span>
        </div>
    );
};

export default VUMeter;