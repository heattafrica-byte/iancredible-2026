import React, { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  analyserNode: AnalyserNode | null;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyserNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!analyserNode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    analyserNode.fftSize = 2048;
    analyserNode.minDecibels = -90;
    analyserNode.maxDecibels = -10;
    analyserNode.smoothingTimeConstant = 0.85;

    const frequencyBinCount = analyserNode.frequencyBinCount;
    const frequencyData = new Uint8Array(frequencyBinCount);

    let animationFrameId: number;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      // --- Get Data ---
      analyserNode.getByteFrequencyData(frequencyData);

      // --- Drawing ---
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#10101f'; // bg-cyber-darker
      ctx.fillRect(0, 0, width, height);

      // --- Draw Spectrum ---
      const barWidth = (width / frequencyBinCount) * 2.5;
      let barHeight;
      let x = 0;

      const spectrumGradient = ctx.createLinearGradient(0, height, 0, 0);
      spectrumGradient.addColorStop(0, '#00f6ff'); // cyan
      spectrumGradient.addColorStop(0.7, '#ff00f3'); // magenta
      
      for (let i = 0; i < frequencyBinCount; i++) {
        barHeight = (frequencyData[i] / 255) * height;
        ctx.fillStyle = spectrumGradient;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [analyserNode]);


  return <canvas ref={canvasRef} width="600" height="80" className="w-full h-auto" />;
};

export default AudioVisualizer;