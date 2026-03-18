import React, { useState, useEffect } from 'react';
import './MarksBarChart.css';

const MarksBarChart = ({ subjects = [], category = 'Semester Marks' }) => {
    const [animated, setAnimated] = useState(false);
    const [tooltip, setTooltip] = useState(null);

    const isSemesterExam = category === 'Semester Marks' || category === 'Semester Exam';

    useEffect(() => {
        setAnimated(false);
        const t = setTimeout(() => setAnimated(true), 100);
        return () => clearTimeout(t);
    }, [subjects]);

    if (!subjects || subjects.length === 0) {
        return (
            <div className="marks-chart-panel" style={{ alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>No data available for graph</p>
            </div>
        );
    }

    // Grade mapping to levels
    const gradeMap = {
        'O': 6,
        'A+': 5,
        'A': 4,
        'B+': 3,
        'B': 2,
        'C': 1,
        'RA': 0,
        'U': 0
    };

    const gradeLabels = ['O', 'A+', 'A', 'B+', 'B', 'C', 'RA'];

    const getGradeLevel = (grade) => {
        return gradeMap[grade] !== undefined ? gradeMap[grade] : 0;
    };

    const getNumColor = (marks, max) => {
        const percentage = max > 0 ? (marks / max) * 100 : 0;
        if (percentage >= 90) return '#22c55e'; // green
        if (percentage >= 75) return '#3b82f6'; // blue
        if (percentage >= 60) return '#14b8a6'; // teal
        if (percentage >= 50) return '#eab308'; // yellow
        if (percentage >= 40) return '#f97316'; // orange
        return '#ff3b3b'; // red
    };

    const getGradeColor = (grade) => {
        switch (grade) {
            case 'O': return '#22c55e'; // bright green
            case 'A+': return '#3b82f6'; // blue
            case 'A': return '#06b6d4'; // cyan
            case 'B+': return '#84cc16'; // light green
            case 'B': return '#eab308'; // yellow
            case 'C': return '#f97316'; // orange
            case 'RA': return '#ff3b3b'; // bright red
            default: return '#ff3b3b'; // default to red for unknown/lowest
        }
    };

    const getMaxMarksByCategory = () => {
        if (!category) return 100;
        if (category === 'Internal Assessment 1' || category === 'Internal Assessment 2') return 100;
        if (category === 'Assignment 1' || category === 'Assignment 2') return 100;
        if (category === 'Seminar Marks') return 100;
        if (category === 'Class Test' || category === 'Quiz Marks') return 25;
        return 100;
    };

    const maxNumericMarks = getMaxMarksByCategory();

    const numericLabels = [
        maxNumericMarks,
        Math.round(maxNumericMarks * 0.75),
        Math.round(maxNumericMarks * 0.5),
        Math.round(maxNumericMarks * 0.25),
        0
    ];

    const yAxisLabels = isSemesterExam ? gradeLabels : numericLabels;

    return (
        <div className="marks-chart-panel">
            <div className="marks-chart-header">
                <h4 className="marks-chart-title">
                    📊 {isSemesterExam ? 'Grade Distribution' : 'Marks Distribution'}
                </h4>
            </div>

            <div className="marks-chart-container">
                {/* Y-Axis */}
                <div className="marks-y-axis">
                    {yAxisLabels.map((val, i) => (
                        <div key={i} className="marks-y-label">{val}</div>
                    ))}
                </div>

                {/* Bars Area */}
                <div className="marks-bars-wrapper">
                    {/* Grid Lines */}
                    <div className="marks-grid-overlay">
                        {yAxisLabels.map((_, i) => (
                            <div key={i} className="marks-grid-line" />
                        ))}
                    </div>

                    <div className="marks-bars-container">
                        {subjects.map((sub, idx) => {
                            let heightPercentage = 0;
                            let color = '#ff3b3b';
                            let tooltipData = {};

                            if (isSemesterExam) {
                                const grade = sub.grade || 'RA';
                                const gradeLevel = getGradeLevel(grade);
                                heightPercentage = Math.min((gradeLevel / 6) * 100, 100);
                                color = getGradeColor(grade);
                                tooltipData = { name: sub.subjectName, code: sub.subjectCode, type: 'grade', value: grade, color };
                            } else {
                                const marks = sub.marksScored || 0;
                                heightPercentage = maxNumericMarks > 0 ? Math.min((marks / maxNumericMarks) * 100, 100) : 0;
                                color = getNumColor(marks, maxNumericMarks);
                                tooltipData = { name: sub.subjectName, code: sub.subjectCode, type: 'marks', value: `${marks} / ${maxNumericMarks}`, color };
                            }

                            return (
                                <div key={idx} className="marks-bar-col">
                                    <div className="marks-bar-track">
                                        <div
                                            className={`marks-bar`}
                                            style={{
                                                height: animated ? `${heightPercentage}%` : '0%',
                                                background: `linear-gradient(to top, ${color}, ${color}aa)`,
                                                borderRadius: '4px 4px 0 0',
                                                transitionDelay: `${idx * 50}ms`,
                                                border: `1px solid ${color}40`,
                                                borderBottom: 'none',
                                                boxShadow: `0 0 15px ${color}66`
                                            }}
                                            onMouseEnter={() => setTooltip(tooltipData)}
                                            onMouseLeave={() => setTooltip(null)}
                                        >
                                            <div className="marks-bar-cap" style={{ background: color, boxShadow: `0 0 10px ${color}, 0 2px 10px ${color}aa` }} />
                                        </div>
                                    </div>
                                    <span className="marks-x-label">{sub.subjectCode}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tooltip */}
                {tooltip && (
                    <div className="marks-tooltip" style={{ borderColor: tooltip.color }}>
                        <div className="marks-tt-name">{tooltip.code}</div>
                        <div className="marks-tt-row" style={{ marginBottom: '4px', color: 'var(--text-muted)' }}>
                            {tooltip.name}
                        </div>
                        <div className="marks-tt-row">
                            <span className="marks-tt-label">{tooltip.type === 'grade' ? 'Grade:' : 'Marks Scored:'}</span>
                            <span className="marks-tt-val" style={{ color: tooltip.color }}>{tooltip.value}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarksBarChart;
