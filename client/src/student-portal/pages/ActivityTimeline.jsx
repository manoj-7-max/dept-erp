import React, { useState, useEffect } from 'react';
import { fetchTimeline } from '../services/api';
import { Activity, BookOpen, Users, FileText, Trophy, HeartPulse, MoreHorizontal } from 'lucide-react';
import './ActivityTimeline.css';

const getCategoryDetails = (eventType) => {
    switch(eventType) {
        case 'Academic':
            return { colorClass: 'tl-type-academic', icon: BookOpen, label: 'Academic' };
        case 'Mentor Meeting':
            return { colorClass: 'tl-type-mentormeeting', icon: Users, label: 'Mentor Meeting' };
        case 'Document':
            return { colorClass: 'tl-type-document', icon: FileText, label: 'Document' };
        case 'Competition':
            return { colorClass: 'tl-type-competition', icon: Trophy, label: 'Competition' };
        case 'Health / Personal':
            return { colorClass: 'tl-type-healthpersonal', icon: HeartPulse, label: 'Health / Personal' };
        default:
            return { colorClass: 'tl-type-default', icon: MoreHorizontal, label: eventType || 'General' };
    }
};

const ActivityTimeline = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const res = await fetchTimeline();
            // Assuming API sorts by descending chronologically.
            setEvents(res.data);
        } catch(err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if(loading) return <div style={{padding: '20px', color: 'var(--text-muted)'}}>Loading timeline...</div>;

    if(events.length === 0) return null; // Or show empty state

    return (
        <div className="timeline-container">
            <div className="timeline-header">
                <Activity size={24} color="#a855f7" />
                <h3>Student Activity Timeline</h3>
            </div>
            
            <div className="timeline-list">
                {events.map((ev) => {
                    const { colorClass, icon: Icon, label } = getCategoryDetails(ev.eventType);
                    const dateStr = new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    
                    return (
                        <div key={ev._id} className={`timeline-item ${colorClass}`}>
                            <div className="timeline-marker">
                                <Icon size={16} />
                            </div>
                            <div className="timeline-card">
                                <div className="tl-card-header">
                                    <span className="tl-category">{label}</span>
                                    <span className="tl-date">{dateStr}</span>
                                </div>
                                <h4 className="tl-title">{ev.title}</h4>
                                <p className="tl-desc">{ev.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActivityTimeline;
