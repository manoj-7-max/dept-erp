import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    BookOpen, Calendar, FileText, CheckCircle,
    XCircle, Loader2, ChevronUp, ChevronDown,
    ChevronsUpDown, AlertTriangle, Award, Layers
} from 'lucide-react';

import './AcademicRecords.css';
import SubjectGradeBarChart from './SubjectGradeBarChart';
import MarksBarChart from './MarksBarChart';
import { getGradeInfo, MOCK_RECORDS } from '../services/academicMockData';

// ─────────────────────────────────────────────────────────────────────────────
// Grade colour map (local — display only, not needed in shared module)
// ─────────────────────────────────────────────────────────────────────────────
const gradeColorMap = {
    O: '#a78bfa',   // violet
    'A+': '#60a5fa', // blue
    A: '#34d399',   // green
    'B+': '#4ade80',
    B: '#facc15',   // yellow
    C: '#fb923c',   // orange
    'RA': '#f87171',   // red
    'U': '#f87171',    // red
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
const AcademicRecords = () => {

    // ── core state ─────────────────────────────────────────────────────────
    const [records] = useState(MOCK_RECORDS);
    const [loading] = useState(false);
    const searchParams = useSearchParams();
    const [showArrearsOnly, setShowArrearsOnly] = useState(searchParams.get('filterBacklogs') === 'true');
    const [selectedSemester, setSelectedSemester] = useState(1);
    const [selectedAssessment, setSelectedAssessment] = useState('Semester Marks');
    const [switchingTab, setSwitchingTab] = useState(false);

    // ── sort state ─────────────────────────────────────────────────────────
    // key: 'subjectName' | 'marksScored' | 'grade' | 'credits' | null
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc'); // 'asc' | 'desc'

    // ── arrears selection ──────────────────────────────────────────────────
    const [selectedArrears, setSelectedArrears] = useState(new Set());

    const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
    const assessmentTypes = ['Internal Assessment 1', 'Internal Assessment 2', 'Class Test', 'Assignment 1', 'Assignment 2', 'Semester Marks', 'Seminar Marks', 'Quiz Marks'];

    // ── tab handlers ───────────────────────────────────────────────────────
    const handleSemesterChange = (sem) => {
        setSwitchingTab(true);
        setSelectedSemester(sem);
        setSelectedArrears(new Set());
        setTimeout(() => setSwitchingTab(false), 280);
    };
    const handleAssessmentChange = (a) => {
        setSwitchingTab(true);
        setSelectedAssessment(a);
        setSelectedArrears(new Set());
        setTimeout(() => setSwitchingTab(false), 280);
    };

    // ── sort handler ───────────────────────────────────────────────────────
    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    // ── derived display subjects ───────────────────────────────────────────
    const rawSubjects = useMemo(() => {
        if (showArrearsOnly) {
            const arr = [];
            records.forEach(rec => {
                if (rec.assessmentType === 'Semester Marks' && rec.subjects) {
                    rec.subjects.forEach(sub => {
                        if (sub.grade === 'RA' || sub.grade === 'U') {
                            arr.push({ ...sub, semester: rec.semester });
                        }
                    });
                }
            });
            return arr;
        }
        const active = records.find(r => r.semester === selectedSemester && r.assessmentType === selectedAssessment);
        return active?.subjects ?? [];
    }, [records, showArrearsOnly, selectedSemester, selectedAssessment]);

    const displaySubjects = useMemo(() => {
        if (!sortKey) return rawSubjects;
        return [...rawSubjects].sort((a, b) => {
            let va = a[sortKey], vb = b[sortKey];
            if (sortKey === 'grade') {
                // sort by gradePoint instead
                va = a.gradePoint; vb = b.gradePoint;
            }
            if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
            return sortDir === 'asc' ? va - vb : vb - va;
        });
    }, [rawSubjects, sortKey, sortDir]);

    // ── CGPA (cumulative up to selected semester) ───────────────────────────
    const cgpa = useMemo(() => {
        let totalCredits = 0, weightedGP = 0;
        records.forEach(rec => {
            if (rec.assessmentType === 'Semester Marks' && rec.subjects && rec.semester <= selectedSemester) {
                rec.subjects.forEach(sub => {
                    totalCredits += sub.credits;
                    weightedGP += sub.credits * sub.gradePoint;
                });
            }
        });
        return totalCredits > 0 ? (weightedGP / totalCredits).toFixed(2) : null;
    }, [records, selectedSemester]);

    // ── Selected Subjects for Graph ─────────────────────────────────────────
    const chartSubjects = useMemo(() => {
        const rec = records.find(r => r.semester === selectedSemester && r.assessmentType === 'Semester Marks');
        return rec?.subjects ?? [];
    }, [records, selectedSemester]);

    const showChart = chartSubjects.length > 0;
    const chartTitle = 'Semester Marks Subject Grades';

    // ── arrears selection helpers ──────────────────────────────────────────
    const toggleArrear = (code) => {
        setSelectedArrears(prev => {
            const next = new Set(prev);
            next.has(code) ? next.delete(code) : next.add(code);
            return next;
        });
    };
    const toggleAllArrears = () => {
        if (selectedArrears.size === displaySubjects.length) {
            setSelectedArrears(new Set());
        } else {
            setSelectedArrears(new Set(displaySubjects.map(s => s.subjectCode)));
        }
    };

    // ── sort icon helper ───────────────────────────────────────────────────
    const SortIcon = ({ col }) => {
        if (sortKey !== col) return <ChevronsUpDown size={14} className="sort-icon muted" />;
        return sortDir === 'asc'
            ? <ChevronUp size={14} className="sort-icon active-sort" />
            : <ChevronDown size={14} className="sort-icon active-sort" />;
    };

    // ── totals ─────────────────────────────────────────────────────────────
    const totalCredits = displaySubjects.reduce((s, x) => s + x.credits, 0);
    const totalMarksScored = displaySubjects.reduce((s, x) => s + x.marksScored, 0);
    const totalMaxMarks = displaySubjects.reduce((s, x) => s + x.maximumMarks, 0);
    const percentage = totalMaxMarks > 0 ? ((totalMarksScored / totalMaxMarks) * 100).toFixed(1) : 0;

    if (loading) {
        return (
            <div className="loading-spinner">
                <Loader2 size={40} className="spin" />
                <p>Loading academic records…</p>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="academic-records-container">

            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="page-header">
                <div>
                    <h2 className="page-title">Term Archives</h2>
                    <p className="subtitle">View your performance across all semesters and assessments.</p>
                </div>
                {/* CGPA chip always visible */}
                {cgpa && (
                    <div className="cgpa-chip">
                        <Award size={16} />
                        <span>GPA</span>
                        <strong>{cgpa}</strong>
                        <span className="cgpa-scale">/ 10</span>
                    </div>
                )}
            </div>

            {/* ── Semester / Assessment Selectors ─────────────────────── */}
            <div style={{ opacity: showArrearsOnly ? 0.4 : 1, pointerEvents: showArrearsOnly ? 'none' : 'auto', transition: 'opacity 0.3s' }}>
                <h3 className="section-title"><Calendar size={18} /> Select Academic Term</h3>
                
                {!showArrearsOnly ? (
                    <div className="term-dashboard-row">
                        {/* 40% Width: Semester Grid */}
                        <div className="term-grid-col">
                            <div className="semester-grid-v2">
                                {semesters.map(sem => (
                                    <div
                                        key={sem}
                                        className={`sem-box ${selectedSemester === sem ? 'active' : ''}`}
                                        onClick={() => setSelectedSemester(sem)}
                                    >
                                        Semester {sem}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 60% Width: Subject Grade Chart */}
                        {showChart ? (
                            <div className="term-chart-col">
                                <SubjectGradeBarChart subjects={chartSubjects} title={chartTitle} />
                            </div>
                        ) : (
                            <div className="term-chart-col">
                                {/* Blank placeholder or extended grid */}
                                <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'}}>
                                    Select an assessment with grades to view the bar chart.
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="semester-grid">
                        {semesters.map(sem => (
                            <div
                                key={sem}
                                className={`sem-box ${selectedSemester === sem ? 'active' : ''}`}
                                onClick={() => setSelectedSemester(sem)}
                            >
                                Semester {sem}
                            </div>
                        ))}
                    </div>
                )}

                <h3 className="section-title"><FileText size={18} /> Assessment Category</h3>
                <div className="assessment-tabs">
                    {assessmentTypes.map(type => (
                        <button
                            key={type}
                            className={`tab-btn ${selectedAssessment === type ? 'active' : ''}`}
                            onClick={() => handleAssessmentChange(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── CGPA Banner (semester exam only, not arrears) ────────── */}
            {!showArrearsOnly && selectedAssessment === 'Semester Exam' && cgpa && (
                <div className="sgpa-banner">
                    <div className="sgpa-info">
                        <Layers size={16} />
                        <span>Semester 1–{selectedSemester} — GPA</span>
                    </div>
                    <div className="sgpa-value">{cgpa} <span className="sgpa-scale">/ 10</span></div>
                </div>
            )}

            {/* ── Arrears Toggle ───────────────────────────────────────── */}
            <div className="arrears-toggle-row">
                <label className="arrears-label">
                    <input
                        type="checkbox"
                        checked={showArrearsOnly}
                        onChange={(e) => {
                            setShowArrearsOnly(e.target.checked);
                            setSelectedArrears(new Set());
                        }}
                    />
                    <AlertTriangle size={15} />
                    <span style={{ color: showArrearsOnly ? 'var(--danger)' : 'var(--text-main)' }}>
                        Display Only Arrears / Failed Subjects
                    </span>
                </label>
            </div>

            {/* ── Table ───────────────────────────────────────────────── */}
            {switchingTab ? (
                <div className="loading-spinner" style={{ padding: '40px' }}>
                    <Loader2 size={30} className="spin" />
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                </div>
            ) : displaySubjects.length > 0 ? (
                <div className="table-layout-wrapper" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    {/* Left Column (50%) */}
                    <div className="marks-container" style={{ flex: '1 1 50%', minWidth: 0 }}>
                        <div className="table-responsive">
                            <table className="marks-table">
                                <thead>
                                    <tr>
                                        {/* Checkbox col – arrears only */}
                                        {showArrearsOnly && (
                                            <th className="th-check">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedArrears.size === displaySubjects.length && displaySubjects.length > 0}
                                                    onChange={toggleAllArrears}
                                                    title="Select All"
                                                />
                                            </th>
                                        )}
                                        {showArrearsOnly && <th>SEMESTER</th>}
                                        <th>CODE</th>

                                        {/* Sortable: Course Title */}
                                        <th className="th-sort" onClick={() => handleSort('subjectName')}>
                                            COURSE TITLE <SortIcon col="subjectName" />
                                        </th>

                                        {/* Marks columns — hidden for Semester Marks (Grade focused) */}
                                        {selectedAssessment !== 'Semester Marks' && !showArrearsOnly && (
                                            <>
                                                <th className="th-sort" onClick={() => handleSort('marksScored')}>
                                                    MARKS SCORED <SortIcon col="marksScored" />
                                                </th>
                                                <th>MAX MARKS</th>
                                            </>
                                        )}

                                        {/* Grade — only for Semester Marks */}
                                        {selectedAssessment === 'Semester Marks' && !showArrearsOnly && (
                                            <th className="th-sort" onClick={() => handleSort('grade')}>
                                                GRADE <SortIcon col="grade" />
                                            </th>
                                        )}
                                        {(showArrearsOnly) && (
                                            <th className="th-sort" onClick={() => handleSort('grade')}>
                                                GRADE <SortIcon col="grade" />
                                            </th>
                                        )}

                                        {/* Status — hidden for Quiz/Seminar, Class Test, Assignments, Internal */}
                                        {selectedAssessment !== 'Quiz Marks' && selectedAssessment !== 'Seminar Marks' && selectedAssessment !== 'Class Test' && !selectedAssessment.startsWith('Assignment') && !selectedAssessment.startsWith('Internal') && (
                                            <th>STATUS</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {displaySubjects.map((sub, idx) => {
                                        const isFail = sub.grade === 'RA' || sub.grade === 'U';
                                        const gc = gradeColorMap[sub.grade] || '#94a3b8';
                                        const isChecked = selectedArrears.has(sub.subjectCode);
                                        return (
                                            <tr
                                                key={idx}
                                                className={isFail ? 'fail-row' : ''}
                                                onClick={showArrearsOnly ? () => toggleArrear(sub.subjectCode) : undefined}
                                                style={showArrearsOnly ? { cursor: 'pointer' } : {}}
                                            >
                                                {showArrearsOnly && (
                                                    <td className="td-check" onClick={e => e.stopPropagation()}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => toggleArrear(sub.subjectCode)}
                                                        />
                                                    </td>
                                                )}
                                                {showArrearsOnly && (
                                                    <td>
                                                        <span className="sem-badge">Sem {sub.semester}</span>
                                                    </td>
                                                )}
                                                <td><span className="subject-code">{sub.subjectCode}</span></td>
                                                <td className="subject-name-cell">{sub.subjectName}</td>
                                                {/* Marks cells — hidden for Semester Marks */}
                                                {selectedAssessment !== 'Semester Marks' && !showArrearsOnly && (
                                                    <>
                                                        <td className={`marks-highlight ${isFail ? 'fail-marks' : ''}`}>
                                                            {sub.marksScored}
                                                        </td>
                                                        <td className="max-marks">{sub.maximumMarks}</td>
                                                    </>
                                                )}
                                                {/* Grade — only for Semester Marks or arrear view */}
                                                {selectedAssessment === 'Semester Marks' || showArrearsOnly ? (
                                                    <td>
                                                        <span
                                                            className="grade-badge"
                                                            style={{ '--gc': gc }}
                                                        >
                                                            {sub.grade}
                                                        </span>
                                                    </td>
                                                ) : null}
                                                {/* Status — hidden for Quiz/Seminar, Class Test, Assignments, Internal */}
                                                {selectedAssessment !== 'Quiz Marks' && selectedAssessment !== 'Seminar Marks' && selectedAssessment !== 'Class Test' && !selectedAssessment.startsWith('Assignment') && !selectedAssessment.startsWith('Internal') && (
                                                    <td>
                                                        <span className={isFail ? 'fail-status' : 'pass-status'}>
                                                            {isFail
                                                                ? <><XCircle size={13} /> Fail</>
                                                                : <><CheckCircle size={13} /> Pass</>}
                                                        </span>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* ── Summary footer ─────────────────────────────── */}
                        <div className="table-summary">
                            <div className="summary-item">
                                <span className="summary-label">Total Score</span>
                                <span className="summary-value">
                                    {totalMarksScored}
                                    <span className="summary-denom">/ {totalMaxMarks}</span>
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Percentage</span>
                                <span className="summary-value">{percentage}%</span>
                            </div>
                            {cgpa && (
                                <div className="summary-item">
                                    <span className="summary-label">GPA</span>
                                    <span className="summary-value" style={{ color: '#a78bfa' }}>{cgpa}</span>
                                </div>
                            )}
                            {!showArrearsOnly && (
                                <div className="summary-item">
                                    <span className="summary-label">Overall Status</span>
                                    <span className="summary-value" style={{ color: parseFloat(percentage) >= 40 ? 'var(--success)' : 'var(--danger)', fontSize: '18px' }}>
                                        {parseFloat(percentage) >= 40
                                            ? <><CheckCircle size={20} /> CLEAR</>
                                            : <><XCircle size={20} /> RE-APPEAR</>}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* ── Re-exam action bar (arrears only) ─────────── */}
                        {showArrearsOnly && (
                            <div className="reexam-bar">
                                <span className="reexam-count">
                                    {selectedArrears.size > 0
                                        ? `${selectedArrears.size} subject${selectedArrears.size > 1 ? 's' : ''} selected`
                                        : 'Select subjects to apply'}
                                </span>
                                <div className="reexam-actions">
                                    <button
                                        className={`reexam-btn apply-btn ${selectedArrears.size === 0 ? 'disabled' : ''}`}
                                        disabled={selectedArrears.size === 0}
                                        onClick={() => alert(`Photocopy application submitted for:\n${[...selectedArrears].join(', ')}`)}
                                    >
                                        📋 Apply for Photocopy
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Right Column (50%) - Bar Graph */}
                    <div className="future-graph-container" style={{ flex: '1 1 50%', minWidth: 0 }}>
                        <MarksBarChart subjects={displaySubjects} category={showArrearsOnly ? 'Semester Marks' : selectedAssessment} />
                    </div>
                </div>
            ) : (
                <div className="empty-state">
                    {showArrearsOnly ? (
                        <>
                            <CheckCircle size={48} style={{ marginBottom: '16px', color: 'var(--success)' }} />
                            <h3>No Arrears Found!</h3>
                            <p>You have cleared all subjects across all semesters. 🎉</p>
                        </>
                    ) : (
                        <>
                            <BookOpen size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                            <h3>No Data Available</h3>
                            <p>Marks for this semester and assessment have not been uploaded yet.</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AcademicRecords;
