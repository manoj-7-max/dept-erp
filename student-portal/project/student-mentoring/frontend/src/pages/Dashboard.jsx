import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchDashboardSummary } from '../services/api';
import { AlertTriangle, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './Dashboard.css';


const Dashboard = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [attendanceData, setAttendanceData] = useState(null);
    const [showAttendanceWarning, setShowAttendanceWarning] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            router.push('/login');
        }
    }, [router]);

    // Fetch attendance and show warning
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchDashboardSummary();
                const summary = response.data;
                setAttendanceData(summary);
                if (summary.attendancePercentage < 85) {
                    setShowAttendanceWarning(true);
                }
            } catch (err) {
                console.error('Error fetching attendance:', err);
            }
        };
        fetchData();
    }, []);

    const dismissAttendanceWarning = () => {
        setShowAttendanceWarning(false);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const isShortage = attendanceData && attendanceData.attendancePercentage < 75;

    return (
        <div className="dashboard-layout">
            <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
                <Sidebar />
            </div>

            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={toggleSidebar}></div>
            )}

            <div className="main-content">
                <Header toggleSidebar={toggleSidebar} />

                {/* Global Attendance Warning Banner */}
                {showAttendanceWarning && attendanceData && (
                    <div className={`global-attendance-banner ${isShortage ? 'danger' : 'warning'}`}>
                        <div className="gab-content">
                            <AlertTriangle size={16} className="gab-icon" />
                            <div className="gab-text">
                                <strong>
                                    {isShortage ? 'Attendance Shortage' : 'Attendance Warning'}
                                </strong>
                                <span>
                                    {isShortage
                                        ? `Your overall attendance is ${attendanceData.attendancePercentage}%. Minimum 75% is required.`
                                        : `Your attendance is ${attendanceData.attendancePercentage}%. Be careful not to miss upcoming classes.`
                                    }
                                </span>
                            </div>
                        </div>
                        <button className="gab-dismiss" onClick={dismissAttendanceWarning} title="Dismiss permanently">
                            <X size={18} />
                        </button>
                    </div>
                )}

                <main className="content-area">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
