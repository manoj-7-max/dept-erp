import React, { useState, useEffect } from 'react';
import { fetchMentoringReports } from '../services/api';
import { FileSignature, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import './CardStyles.css';

const MentoringReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const res = await fetchMentoringReports();
            setReports(res.data);
        } catch (err) {
            setError('Failed to load mentoring reports.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading reports...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2 className="page-title">Mentoring Reports</h2>
            </div>

            {reports.length === 0 ? (
                <div className="alert-info">No mentoring reports available yet.</div>
            ) : (
                <div className="reports-timeline">
                    {reports.map((report) => (
                        <div className="card" key={report._id} style={{ position: 'relative', borderLeft: '4px solid var(--primary)' }}>
                            <div className="card-body">

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600, marginBottom: '16px' }}>
                                    <Calendar size={18} /> Meeting Date: {new Date(report.meetingDate).toLocaleDateString()}
                                </div>

                                <div className="info-item" style={{ marginBottom: '16px' }}>
                                    <span className="info-label"><MessageSquare size={16} /> Discussion Summary</span>
                                    <div style={{ padding: '12px 0 0' }}>
                                        <span className="info-value">{report.discussionSummary}</span>
                                    </div>
                                </div>

                                <div className="info-grid" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', gap: '16px' }}>
                                    <div className="info-item">
                                        <span className="info-label"><FileSignature size={15} /> Follow-up Action</span>
                                        <span className="info-value" style={{ fontSize: '14px' }}>{report.followUpAction}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label"><ArrowRight size={15} /> Next Meeting</span>
                                        <span className="info-value" style={{ fontSize: '14px', color: 'var(--primary)' }}>
                                            {new Date(report.nextMeetingDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MentoringReports;
