import React, { useState, useEffect } from 'react';
import { fetchDashboardSummary } from '../services/api';
import { computeArrearCount } from '../services/academicMockData';
import {
    AlertTriangle,
    TrendingUp,
    CheckCircle,
    XOctagon,
    Award,
    Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import './DashboardHeader.css';

/* ── Circular Progress Ring ────────────────────────────────────── */
const CircularGauge = ({ value, max, label, color, icon: Icon, suffix = '', onClick, subLabel }) => {
    const radius = 54;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const pct = Math.min(value / max, 1);
    const offset = circumference - pct * circumference;

    return (
        <div
            className="circular-gauge"
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <div className="gauge-ring-wrapper">
                <svg width={radius * 2} height={radius * 2} className="gauge-svg">
                    {/* background track */}
                    <circle
                        cx={radius}
                        cy={radius}
                        r={normalizedRadius}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth={stroke}
                    />
                    {/* progress arc */}
                    <circle
                        cx={radius}
                        cy={radius}
                        r={normalizedRadius}
                        fill="none"
                        stroke={color}
                        strokeWidth={stroke}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="gauge-progress"
                        style={{ filter: `drop-shadow(0 0 6px ${color}55)` }}
                    />
                </svg>
                {/* centre content */}
                <div className="gauge-center">
                    <span className="gauge-value" style={{ color }}>
                        {value}{suffix}
                    </span>
                </div>
            </div>
            <div className="gauge-label-area">
                <div className="gauge-icon-dot" style={{ background: color }}>
                    <Icon size={14} color="#fff" />
                </div>
                <span className="gauge-label">{label}</span>
            </div>
            {subLabel && <span className="gauge-sub-label" style={{ color }}>{subLabel}</span>}
        </div>
    );
};

/* ── Dashboard Header ──────────────────────────────────────────── */
const DashboardHeader = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const getSummary = async () => {
            try {
                const response = await fetchDashboardSummary();
                setSummary(response.data);
            } catch (error) {
                console.error("Error fetching dashboard summary:", error);
            } finally {
                setLoading(false);
            }
        };

        getSummary();
    }, []);

    if (loading || !summary) return null;

    const arrearCount = computeArrearCount();

    return (
        <div className="dashboard-header-section">

            {/* Circular Dashboard Gauges */}
            <div className="circular-dashboard">
                <CircularGauge
                    value={summary.cgpa.toFixed(1)}
                    max={10}
                    label="GPA"
                    color="#60a5fa"
                    icon={TrendingUp}
                    suffix=""
                />

                <CircularGauge
                    value={summary.attendancePercentage}
                    max={100}
                    label="Attendance"
                    color={summary.attendancePercentage < 85 ? '#f59e0b' : '#22c55e'}
                    icon={summary.attendancePercentage < 85 ? AlertTriangle : CheckCircle}
                    suffix="%"
                    onClick={() => router.push('/student/dashboard/attendance')}
                    subLabel={summary.attendancePercentage < 85 ? 'Low' : 'Good'}
                />

                <CircularGauge
                    value={arrearCount}
                    max={Math.max(arrearCount, 10)}
                    label="Backlogs"
                    color={arrearCount > 0 ? '#ef4444' : '#22c55e'}
                    icon={XOctagon}
                    onClick={() => router.push('/student/dashboard/academic-records?filterBacklogs=true')}
                />

                <CircularGauge
                    value={summary.activitiesCount}
                    max={Math.max(summary.activitiesCount, 5)}
                    label="Activities"
                    color="#a78bfa"
                    icon={Award}
                />
            </div>

        </div>
    );
};

export default DashboardHeader;
