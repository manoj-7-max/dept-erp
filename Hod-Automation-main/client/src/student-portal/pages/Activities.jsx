import React from 'react';
import { Award, Target, Trophy, Code, Medal } from 'lucide-react';
import './CardStyles.css';

const Activities = () => {
    // Static dummy data for Technical Achievements
    const technicalActivities = [
        {
            id: 1,
            eventName: 'Hackathon 2024',
            achievement: '1st Runner Up',
            hasCertificate: true,
            certificateUrl: '#',
        },
        {
            id: 2,
            eventName: 'National Level Coding Contest',
            achievement: 'Winner',
            hasCertificate: false,
        },
        {
            id: 3,
            eventName: 'Tech Symposium Paper Presentation',
            achievement: '2nd Prize',
            hasCertificate: false,
        }
    ];

    // Static dummy data for Non-Technical Achievements
    const nonTechnicalActivities = [
        {
            id: 4,
            eventName: 'Inter-College Football Tournament',
            achievement: 'Winner',
            hasCertificate: false,
        },
        {
            id: 5,
            eventName: 'College Cultural Fest – Dance Competition',
            achievement: '2nd Prize',
            hasCertificate: false,
        }
    ];

    const renderCard = (activity, iconType) => (
        <div className="card" key={activity.id} style={{ marginBottom: '16px', borderLeft: `4px solid ${iconType === 'tech' ? 'var(--primary)' : 'var(--secondary)'}` }}>
            <div className="card-body" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="avatar" style={{ 
                        backgroundColor: iconType === 'tech' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                        width: '50px',
                        height: '50px',
                        flexShrink: 0
                    }}>
                        {iconType === 'tech' ? (
                            <Code size={24} color="var(--primary)" />
                        ) : (
                            <Medal size={24} color="var(--secondary)" />
                        )}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-main)', fontWeight: 600 }}>{activity.eventName}</h3>
                            <span style={{ 
                                fontSize: '13px', 
                                color: iconType === 'tech' ? 'var(--primary)' : 'var(--secondary)',
                                fontWeight: 700,
                                padding: '4px 12px',
                                background: iconType === 'tech' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                                borderRadius: '20px'
                            }}>
                                {activity.achievement}
                            </span>
                        </div>
                        
                        {/* Progress-bar style bar */}
                        <div style={{ 
                            height: '6px', 
                            background: 'rgba(255,255,255,0.05)', 
                            borderRadius: '10px', 
                            overflow: 'hidden',
                            marginBottom: '12px'
                        }}>
                            <div style={{ 
                                height: '100%', 
                                width: '100%', 
                                background: `linear-gradient(90deg, ${iconType === 'tech' ? 'var(--primary)' : 'var(--secondary)'}, transparent)`,
                                borderRadius: '10px'
                            }} />
                        </div>

                        {activity.hasCertificate && (
                            <a href={activity.certificateUrl} target="_blank" rel="noopener noreferrer" style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                fontSize: '12px', 
                                color: 'var(--text-muted)',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'}
                            onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                                <Award size={14} /> View Certificate
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="page-container" style={{ padding: '24px' }}>
            <div className="page-header" style={{ marginBottom: '32px' }}>
                <div>
                    <h2 className="page-title" style={{ fontSize: '28px' }}>Co-Curricular Activities</h2>
                    <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Track your technical and personal achievements</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '40px' }}>
                {/* Left Section - Technical */}
                <div>
                    <h3 style={{ 
                        color: 'var(--text-main)', 
                        fontSize: '18px',
                        marginBottom: '20px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px' 
                    }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Code size={18} color="var(--primary)" />
                        </div>
                        Technical Achievements
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {technicalActivities.map(activity => renderCard(activity, 'tech'))}
                    </div>
                </div>

                {/* Right Section - Non-Technical */}
                <div>
                    <h3 style={{ 
                        color: 'var(--text-main)', 
                        fontSize: '18px',
                        marginBottom: '20px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px' 
                    }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Medal size={18} color="var(--secondary)" />
                        </div>
                        Non-Technical Achievements
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {nonTechnicalActivities.map(activity => renderCard(activity, 'non-tech'))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activities;
