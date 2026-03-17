import React, { useEffect, useState } from 'react';
import { MOCK_RECORDS, getGradeInfo } from '../services/academicMockData';

/* ── Compute per-semester CGPA from mock data ─────────────────── */
const computeSemCGPAs = () => {
    const result = [];
    for (let sem = 1; sem <= 8; sem++) {
        const rec = MOCK_RECORDS.find(r => r.semester === sem && r.assessmentType === 'Semester Marks');
        if (!rec) continue;
        const totalCredits = rec.subjects.reduce((s, x) => s + x.credits, 0);
        const weightedGP   = rec.subjects.reduce((s, x) => s + x.credits * x.gradePoint, 0);
        const cgpa = totalCredits > 0 ? parseFloat((weightedGP / totalCredits).toFixed(2)) : 0;
        result.push({ sem, cgpa });
    }
    return result;
};

const BAR_COLORS = [
    '#6366f1', '#3b82f6', '#06b6d4', '#10b981',
    '#84cc16', '#f59e0b', '#f97316', '#ec4899',
];

const SemesterBarGraph = () => {
    const data = computeSemCGPAs();
    const maxCGPA = 10;
    const [animated, setAnimated] = useState(false);
    const [tooltip, setTooltip] = useState(null);   // { sem, cgpa, x, y }

    useEffect(() => {
        // trigger bar rise after mount
        const t = setTimeout(() => setAnimated(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="sem-bar-graph-card">
            <div className="sbg-header">
                <h4 className="sbg-title">📊 Semester-wise GPA</h4>
                <span className="sbg-subtitle">out of 10.0</span>
            </div>

            <div className="sbg-chart-area">
                {/* Y-axis labels */}
                <div className="sbg-y-axis">
                    {[10, 8, 6, 4, 2, 0].map(v => (
                        <span key={v} className="sbg-y-label">{v}</span>
                    ))}
                </div>

                {/* Bars */}
                <div className="sbg-bars-wrapper">
                    {/* horizontal grid lines */}
                    <div className="sbg-grid">
                        {[0, 1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="sbg-grid-line" />
                        ))}
                    </div>

                    <div className="sbg-bars">
                        {data.map(({ sem, cgpa }, idx) => {
                            const pct = (cgpa / maxCGPA) * 100;
                            const color = BAR_COLORS[idx % BAR_COLORS.length];
                            return (
                                <div key={sem} className="sbg-bar-col">
                                    <div className="sbg-bar-track">
                                        <div
                                            className="sbg-bar"
                                            style={{
                                                height: animated ? `${pct}%` : '0%',
                                                background: `linear-gradient(to top, ${color}, ${color}aa)`,
                                                boxShadow: `0 0 10px ${color}55`,
                                                transitionDelay: `${idx * 80}ms`,
                                            }}
                                            onMouseEnter={e => setTooltip({ sem, cgpa, color })}
                                            onMouseLeave={() => setTooltip(null)}
                                        >
                                            {/* glow cap */}
                                            <div className="sbg-bar-cap" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                                        </div>
                                    </div>
                                    <span className="sbg-x-label">S{sem}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div className="sbg-tooltip" style={{ borderColor: tooltip.color }}>
                    <span style={{ color: tooltip.color, fontWeight: 700 }}>Sem {tooltip.sem}</span>
                    <span className="sbg-tooltip-val">{tooltip.cgpa} <small>/ 10</small></span>
                </div>
            )}

            {/* Legend strip */}
            <div className="sbg-legend">
                {data.map(({ sem, cgpa }, idx) => (
                    <div key={sem} className="sbg-legend-item">
                        <div className="sbg-legend-dot" style={{ background: BAR_COLORS[idx % BAR_COLORS.length] }} />
                        <span>Sem {sem}: <strong>{cgpa}</strong></span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SemesterBarGraph;
