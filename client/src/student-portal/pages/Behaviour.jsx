import React, { useState, useEffect } from 'react';
import { fetchBehaviour } from '../services/api';
import { Activity, Clock, ShieldCheck, MessageCircle } from 'lucide-react';
import './CardStyles.css';

const Behaviour = () => {
    const [behaviour, setBehaviour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadBehaviour();
    }, []);

    const loadBehaviour = async () => {
        try {
            const res = await fetchBehaviour();
            setBehaviour(res.data);
        } catch (err) {
            setError('Failed to load behaviour records.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading behaviour records...</div>;
    if (!behaviour) return <div className="alert-info">No behaviour records documented yet.</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2 className="page-title">Academic Behaviour</h2>
            </div>

            <div className="card">
                <div className="card-body">

                    <div className="info-item" style={{ marginBottom: '24px' }}>
                        <span className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}><Clock size={16} /> Attendance Remarks</span>
                        <div style={{ padding: '16px', backgroundColor: '#1e293b', color: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid var(--primary)', border: '1px solid rgba(255, 255, 255, 0.05)', borderLeftWidth: '4px', borderLeftColor: 'var(--primary)' }}>
                            <span className="info-value">{behaviour.attendanceRemarks}</span>
                        </div>
                    </div>

                    <div className="info-item" style={{ marginBottom: '24px' }}>
                        <span className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}><ShieldCheck size={16} /> Discipline Remarks</span>
                        <div style={{ padding: '16px', backgroundColor: '#1e293b', color: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid var(--success)', border: '1px solid rgba(255, 255, 255, 0.05)', borderLeftWidth: '4px', borderLeftColor: 'var(--success)' }}>
                            <span className="info-value">{behaviour.disciplineRemarks}</span>
                        </div>
                    </div>

                    <div className="info-item">
                        <span className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}><MessageCircle size={16} /> Faculty Comments</span>
                        <div style={{ padding: '16px', backgroundColor: '#1e293b', color: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid var(--warning)', border: '1px solid rgba(255, 255, 255, 0.05)', borderLeftWidth: '4px', borderLeftColor: 'var(--warning)' }}>
                            <span className="info-value">{behaviour.facultyComments}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Behaviour;
