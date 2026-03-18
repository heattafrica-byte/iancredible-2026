import React, { useState, useRef, useCallback, MouseEvent } from 'react';
import { AutomationPoint } from '../types';

interface AutomationEditorProps {
    points: AutomationPoint[];
    onChange: (newPoints: AutomationPoint[]) => void;
    duration: number;
    type?: 'volume' | 'pan';
}

const AutomationEditor: React.FC<AutomationEditorProps> = ({ points, onChange, duration, type = 'volume' }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [draggingPointIndex, setDraggingPointIndex] = useState<number | null>(null);

    const PADDING = 20;
    const EDITOR_HEIGHT = 120;
    const EDITOR_WIDTH = 300; // Fallback width for initial render

    const getDrawableDimensions = useCallback(() => {
        const svgWidth = svgRef.current?.clientWidth || EDITOR_WIDTH;
        const drawableWidth = svgWidth - PADDING * 2;
        const drawableHeight = EDITOR_HEIGHT - PADDING * 2;
        return { svgWidth, drawableWidth, drawableHeight };
    }, []);

    const valueRange = type === 'volume' ? 2.0 : 2.0; // Pan is -1 to 1 (range 2), Volume is 0 to 2 (range 2)
    const valueOffset = type === 'volume' ? 0 : -1.0; // Pan starts at -1.0

    const valueToY = useCallback((value: number) => {
        const { drawableHeight } = getDrawableDimensions();
        const normalizedValue = (value - valueOffset) / valueRange;
        return EDITOR_HEIGHT - PADDING - normalizedValue * drawableHeight;
    }, [getDrawableDimensions, valueOffset, valueRange]);

    const timeToX = useCallback((time: number) => {
        const { drawableWidth } = getDrawableDimensions();
        if (duration <= 0) return PADDING;
        return PADDING + (time / duration) * drawableWidth;
    }, [duration, getDrawableDimensions]);

    const yToValue = useCallback((y: number) => {
        const { drawableHeight } = getDrawableDimensions();
        const clampedY = Math.max(PADDING, Math.min(EDITOR_HEIGHT - PADDING, y));
        const normalizedValue = (EDITOR_HEIGHT - PADDING - clampedY) / drawableHeight;
        return normalizedValue * valueRange + valueOffset;
    }, [getDrawableDimensions, valueOffset, valueRange]);

    const xToTime = useCallback((x: number) => {
        const { drawableWidth } = getDrawableDimensions();
        if (drawableWidth <= 0 || duration <= 0) return 0;
        const clampedX = Math.max(PADDING, Math.min(PADDING + drawableWidth, x));
        return ((clampedX - PADDING) / drawableWidth) * duration;
    }, [duration, getDrawableDimensions]);

    const getCoords = (e: MouseEvent) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const rect = svgRef.current.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const handleMouseDown = (e: MouseEvent, index: number) => {
        e.preventDefault();
        setDraggingPointIndex(index);
    };

    const handleMouseUp = useCallback(() => {
        setDraggingPointIndex(null);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (draggingPointIndex === null) return;

        const { x, y } = getCoords(e);
        const newTime = xToTime(x);
        const newValue = yToValue(y);

        // State update will trigger re-render with sorted points
        const newPoints = [...points];
        newPoints[draggingPointIndex] = { time: newTime, value: newValue };
        onChange(newPoints.sort((a, b) => a.time - b.time));
    }, [draggingPointIndex, points, onChange, xToTime, yToValue]);
    
    const handleAddPoint = (e: MouseEvent) => {
        // Only add a point if clicking on the background (svg or path)
        if ((e.target as SVGElement).tagName !== 'svg' && (e.target as SVGElement).tagName !== 'path') return;
        // Don't add a point if we just finished dragging one
        if (draggingPointIndex !== null) return;
        
        const { x, y } = getCoords(e);
        const time = xToTime(x);
        const value = yToValue(y);

        const newPoints = [...points, { time, value }].sort((a, b) => a.time - b.time);
        onChange(newPoints);
    };

    const handleDeletePoint = (e: MouseEvent, index: number) => {
        e.preventDefault(); // Prevent text selection on double click
        const newPoints = points.filter((_, i) => i !== index);
        onChange(newPoints);
    };

    const sortedPoints = [...points].sort((a, b) => a.time - b.time);
    
    // Create a new array for drawing the line that includes implicit start/end points
    const drawablePoints: AutomationPoint[] = [...sortedPoints];

    // Prepend a point at time 0 with value 1.0 (unity gain) if the first point isn't at the start.
    // Or if there are no points at all.
    const defaultValue = type === 'volume' ? 1.0 : 0.0;
    if (drawablePoints.length === 0 || drawablePoints[0].time > 0) {
        drawablePoints.unshift({ time: 0, value: defaultValue });
    }

    // Append a point at the end of the track that holds the last value, if the last point isn't at the end.
    const lastPoint = drawablePoints[drawablePoints.length - 1];
    if (duration > 0 && lastPoint.time < duration) {
        drawablePoints.push({ time: duration, value: lastPoint.value });
    }

    const pathData = drawablePoints.length > 0
        ? drawablePoints.map((point, index) => {
            const x = timeToX(point.time);
            const y = valueToY(point.value);
            return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
        }).join(' ')
        : '';

    const { svgWidth } = getDrawableDimensions();

    const centerValue = type === 'volume' ? 1.0 : 0.0;
    const centerLabel = type === 'volume' ? '1.0' : 'C';
    const topValue = type === 'volume' ? 2.0 : 1.0;
    const bottomValue = type === 'volume' ? 0.0 : -1.0;
    const lineColor = type === 'volume' ? '#ff00f3' : '#00ffff';

    return (
        <div 
            className="w-full h-[120px] bg-[#0a0a1a] rounded-md relative select-none cursor-crosshair"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            <svg
                ref={svgRef}
                className="w-full h-full"
                onClick={handleAddPoint}
            >
                {/* Grid Lines */}
                <line x1={PADDING} y1={valueToY(centerValue)} x2={svgWidth - PADDING} y2={valueToY(centerValue)} stroke="#00ffff" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
                <text x={5} y={valueToY(centerValue) + 4} fill="#00ffff" fontSize="10" opacity="0.5">{centerLabel}</text>
                <line x1={PADDING} y1={valueToY(bottomValue)} x2={svgWidth - PADDING} y2={valueToY(bottomValue)} stroke="#fff" strokeWidth="0.5" opacity="0.1" />
                <line x1={PADDING} y1={valueToY(topValue)} x2={svgWidth - PADDING} y2={valueToY(topValue)} stroke="#fff" strokeWidth="0.5" opacity="0.1" />
                
                {/* Automation Line */}
                <path d={pathData} stroke={lineColor} strokeWidth="2" fill="none" pointerEvents="none" />

                {/* Automation Points (rendered from the original user data) */}
                {sortedPoints.map((point, index) => (
                    <circle
                        key={`${index}-${point.time}-${point.value}`}
                        cx={timeToX(point.time)}
                        cy={valueToY(point.value)}
                        r="5"
                        fill="#1a1a2e"
                        stroke={lineColor}
                        strokeWidth="2"
                        className={`cursor-grab active:cursor-grabbing ${type === 'volume' ? 'hover:fill-fuchsia-400' : 'hover:fill-cyan-400'}`}
                        onMouseDown={(e) => handleMouseDown(e, index)}
                        onDoubleClick={(e) => handleDeletePoint(e, index)}
                    />
                ))}
            </svg>
             <p className="absolute bottom-1 right-2 text-xs text-gray-500 font-mono">
                Double-click point to delete
            </p>
        </div>
    );
};

export default AutomationEditor;