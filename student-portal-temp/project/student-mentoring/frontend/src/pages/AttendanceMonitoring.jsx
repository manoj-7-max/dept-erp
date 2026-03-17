import React, { useState, useEffect } from 'react';
import { fetchAttendance } from '../services/api';
import { 
    CheckCircle, XCircle, AlertTriangle, UserCheck, 
    BookOpen, Loader2, Calendar, Target, ShieldAlert
} from 'lucide-react';
import './AttendanceMonitoring.css';

const AttendanceMonitoring = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animateBars, setAnimateBars] = useState(false);

    useEffect(() => {
        const getAttendance = async () => {
            try {
                const response = await fetchAttendance();
                setAttendanceData(response.data);
                // Trigger animation entry for bars after a short delay
                setTimeout(() => setAnimateBars(true), 150);
            } catch (error) {
                console.error("Error fetching attendance:", error);
            } finally {
                setLoading(false);
            }
        };
        getAttendance();
    }, []);

    if (loading) {
        return (
            <div className="loading-spinner">
                <Loader2 size={40} className="spin" color="#3b82f6" />
                <p style={{marginTop:'15px', color:'var(--text-muted)'}}>Loading attendance records…</p>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Calculate Summary
    let totalClasses = 0;
    let classesAttended = 0;
    let lowAttendanceCount = 0;

    attendanceData.forEach(item => {
        totalClasses += item.totalClasses;
        classesAttended += item.classesAttended;
        const percentage = (item.classesAttended / item.totalClasses) * 100;
        if (percentage < 75) lowAttendanceCount++;
    });

    const overallPercentage = totalClasses > 0 ? ((classesAttended / totalClasses) * 100).toFixed(1) : 0;
    
    // Determine overall status
    let statusTheme = 'good';
    if (overallPercentage < 75) statusTheme = 'critical';
    else if (overallPercentage < 85) statusTheme = 'warning';

    const StatusIcon = statusTheme === 'good' ? CheckCircle : 
                       statusTheme === 'warning' ? AlertTriangle : XCircle;

    return (
        <div className="attendance-container">
            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="att-page-header">
                <div>
                    <h2 className="att-page-title">
                        <UserCheck size={28} />
                        Attendance Monitoring
                    </h2>
                    <p className="att-subtitle">Track your presence and subject-wise lecture statistics.</p>
                </div>
                {/* Overall Assessment Chip */}
                {totalClasses > 0 && (
                    <div className={`att-status-chip ${statusTheme}`}>
                        <StatusIcon size={18} />
                        <span>STATUS:</span>
                        <strong>{statusTheme.toUpperCase()}</strong>
                    </div>
                )}
            </div>

            {/* ── Summary Cards ────────────────────────────────────────── */}
            <div className="att-summary-row">
                <div className="att-summary-card">
                    <div className={`att-icon-wrapper ${statusTheme}`}>
                        <Target size={24} />
                    </div>
                    <div className="att-summary-info">
                        <h4>Overall Attendance %</h4>
                        <div className="att-val">{overallPercentage}%</div>
                    </div>
                </div>
                
                <div className="att-summary-card">
                    <div className="att-icon-wrapper">
                        <Calendar size={24} />
                    </div>
                    <div className="att-summary-info">
                        <h4>Total Classes Logged</h4>
                        <div className="att-val">{totalClasses}</div>
                    </div>
                </div>

                <div className="att-summary-card">
                    <div className={`att-icon-wrapper ${lowAttendanceCount > 0 ? 'danger' : 'success'}`}>
                        {lowAttendanceCount > 0 ? <ShieldAlert size={24} /> : <CheckCircle size={24} />}
                    </div>
                    <div className="att-summary-info">
                        <h4>Subjects &lt; 75%</h4>
                        <div className="att-val">{lowAttendanceCount}</div>
                    </div>
                </div>
            </div>

            {/* ── Low Attendance Alerts ──────────────────────────────────────── */}
            {lowAttendanceCount > 0 && (
                <div style={{ marginBottom: '30px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '20px' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldAlert size={20} /> Action Required: Low Attendance Subjects
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                        {attendanceData.filter(item => (item.classesAttended / item.totalClasses) * 100 < 75).map(item => (
                            <div key={item.subjectCode} style={{ background: '#0b1220', padding: '16px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', borderLeft: '4px solid #f87171' }}>
                                <div style={{ fontSize: '12px', color: '#60a5fa', fontFamily: 'monospace', marginBottom: '6px' }}>{item.subjectCode}</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.subjectName}</div>
                                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f87171' }}>{((item.classesAttended / item.totalClasses) * 100).toFixed(1)}%</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.classesAttended} / {item.totalClasses} Attended</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Table Area ───────────────────────────────────────────── */}
            <div className="att-table-wrapper">
                <h3 className="att-section-title">
                    <BookOpen size={18} color="#60a5fa" />
                    Subject-wise Attendance records
                </h3>
                <div style={{ overflowX: 'auto' }}>
                    <table className="att-table">
                        <thead>
                            <tr>
                                <th>Subject Code</th>
                                <th>Subject Name</th>
                                <th>Total Classes</th>
                                <th>Classes Attended</th>
                                <th>Attendance %</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                        No attendance records found for this term.
                                    </td>
                                </tr>
                            ) : (
                                attendanceData.map((item) => {
                                    const percentageRaw = (item.classesAttended / item.totalClasses) * 100;
                                    const percentage = percentageRaw.toFixed(1);
                                    
                                    const isCritical = percentageRaw < 75;
                                    const isWarning = percentageRaw >= 75 && percentageRaw < 85;
                                    
                                    let rowStatus = 'good';
                                    let fillColor = '#34d399';
                                    if (isCritical) {
                                        rowStatus = 'critical';
                                        fillColor = '#f87171';
                                    } else if (isWarning) {
                                        rowStatus = 'warning';
                                        fillColor = '#fbbf24';
                                    }

                                    return (
                                        <tr key={item._id} className={isCritical ? 'att-fail-row' : ''}>
                                            <td><span className="att-subject-code">{item.subjectCode}</span></td>
                                            <td className="att-subject-name">{item.subjectName}</td>
                                            <td>{item.totalClasses}</td>
                                            <td>
                                                <span style={{color:'var(--text-main)', fontWeight:'600'}}>{item.classesAttended}</span>
                                            </td>
                                            
                                            {/* Progress Bar Column */}
                                            <td className="att-progress-cell">
                                                <div className="att-progress-wrap">
                                                    <div className="att-progress-track">
                                                        <div 
                                                            className="att-progress-fill" 
                                                            style={{ 
                                                                width: animateBars ? `${percentageRaw}%` : '0%', 
                                                                '--fill-color': fillColor 
                                                            }} 
                                                        />
                                                    </div>
                                                    <span className="att-pct-text" style={{ color: fillColor }}>
                                                        {percentage}%
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status Column */}
                                            <td>
                                                {isCritical ? (
                                                    <span className="att-status-badge warning">
                                                        <XCircle size={14} /> Critical
                                                    </span>
                                                ) : isWarning ? (
                                                    <span className="att-status-badge" style={{ background: 'rgba(245,158,11,0.12)', color:'#fbbf24', border:'1px solid rgba(245,158,11,0.25)'}}>
                                                        <AlertTriangle size={14} /> Low
                                                    </span>
                                                ) : (
                                                    <span className="att-status-badge good">
                                                        <CheckCircle size={14} /> Good
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceMonitoring;
