import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import './SubjectGradeBarChart.css';

const SubjectGradeBarChart = ({ subjects = [], title = "Semester Marks Subject Grades" }) => {
    const [animated, setAnimated] = useState(false);
    const [tooltip, setTooltip] = useState(null);

    useEffect(() => {
        setAnimated(false);
        const t = setTimeout(() => setAnimated(true), 100);
        return () => clearTimeout(t);
    }, [subjects]);

    // Grade Ladder: 0 (Hidden Baseline) to 7 (O)
    const gradeLadder = ['', 'RA', 'C', 'B', 'B+', 'A', 'A+', 'O'];
    
    // Labels for the Y-Axis (Top to Bottom)
    const yAxisLabels = ['O', 'A+', 'A', 'B+', 'B', 'C', 'RA'];

    const getGradeIndex = (g) => {
        const idx = gradeLadder.indexOf(g);
        if (idx !== -1) return idx;
        if (g === 'U') return 1; // Map U to RA level
        return 0; // Baseline
    };

    const gradeToColor = {
        'O': '#22c55e',   // green
        'A+': '#3b82f6',  // blue
        'A': '#14b8a6',   // teal
        'B+': '#84cc16',  // lime
        'B': '#eab308',   // yellow
        'C': '#f97316',   // orange
        'RA': '#ff3b3b',  // bright red
        'U': '#ff3b3b'    // bright red
    };

    if (!subjects || subjects.length === 0) return null;

    return (
        <div className="sg-chart-panel">
            <div className="sg-chart-header">
                <h4 className="sg-chart-title">📊 {title}</h4>
            </div>

            <div className="sg-chart-container">
                {/* Y-Axis (8 points: 7 to 0) */}
                <div className="sg-y-axis">
                    {yAxisLabels.map(g => (
                        <div key={g} className="sg-y-label">{g}</div>
                    ))}
                    <div className="sg-y-label" style={{ opacity: 0 }}>.</div> {/* Space for hidden baseline */}
                </div>

                {/* Bars Area */}
                <div className="sg-bars-wrapper">
                    {/* Grid Lines - Exactly 7 visible levels + 1 hidden baseline */}
                    <div className="sg-grid-overlay">
                        {yAxisLabels.map(g => (
                            <div key={g} className="sg-grid-line" />
                        ))}
                        <div className="sg-grid-line" style={{ opacity: 0 }} /> {/* Hidden Baseline line */}
                    </div>

                    <div className="sg-bars-container">
                        {subjects.map((sub, idx) => {
                            const gradeIdx = getGradeIndex(sub.grade);
                            // height: index / 7 * 100. RA (1) is 14.2%
                            const heightPercentage = (gradeIdx / 7) * 100;
                            const color = gradeToColor[sub.grade] || '#475569';
                            const isRA = sub.grade === 'RA' || sub.grade === 'U';

                            return (
                                <div key={idx} className="sg-bar-col">
                                    <div className="sg-bar-track">
                                        <div
                                            className={`sg-bar ${isRA ? 'ra-pulse' : ''} ${animated ? 'animated' : ''}`}
                                            style={{
                                                height: animated ? (isRA ? '0.25cm' : `${heightPercentage}%`) : '0%',
                                                width: 'calc(100% - 4px)',
                                                margin: '0 2px',
                                                background: `linear-gradient(to top, ${color}, ${color}aa)`,
                                                '--glow-color': color,
                                                borderRadius: '4px 4px 2px 2px',
                                                transitionDelay: `${idx * 50}ms`,
                                                boxShadow: isRA ? '0 0 8px #ff3b3b' : 'none'
                                            }}
                                            onMouseEnter={() => setTooltip({ name: sub.subjectName, grade: sub.grade, color })}
                                            onMouseLeave={() => setTooltip(null)}
                                        >
                                            <div className="sg-bar-cap" style={{ background: color }} />
                                        </div>
                                    </div>
                                    <span className="sg-x-label">{sub.subjectCode}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tooltip Overlay */}
                {tooltip && (
                    <div className="sg-tooltip" style={{ borderLeftColor: tooltip.color }}>
                        <div className="sg-tt-name">{tooltip.name}</div>
                        <div className="sg-tt-row">
                            <span className="sg-tt-label">Grade:</span>
                            <span className="sg-tt-val" style={{ color: tooltip.color }}>{tooltip.grade}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubjectGradeBarChart;
