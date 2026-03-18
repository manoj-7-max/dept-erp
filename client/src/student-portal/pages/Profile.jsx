import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchProfile, updateProfile, fetchCirculars, fetchParentDetails } from '../services/api';
import { User, Edit2, Save, X, BookOpen, Calendar, Droplet, UserCheck, Shield, MapPin, Phone, Mail, Bell, FileSignature, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';
import DashboardHeader from './DashboardHeader';
import SemesterBarGraph from './SemesterBarGraph';
import ActivityTimeline from './ActivityTimeline';
import './SemesterBarGraph.css';
import './CardStyles.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ phone: '', email: '', homeAddress: '' });
    const [parentDetails, setParentDetails] = useState(null);
    const [recentCirculars, setRecentCirculars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const router = useRouter();

    useEffect(() => {
        loadProfile();
        // Show circular notification after 2 seconds
        const timer = setTimeout(() => setShowNotification(true), 2000);
        // Auto-dismiss after 10 seconds
        const dismiss = setTimeout(() => setShowNotification(false), 10000);
        return () => { clearTimeout(timer); clearTimeout(dismiss); };
    }, []);

    const loadProfile = async () => {
        try {
            const res = await fetchProfile();
            setProfile(res.data);
            setEditForm({
                phone: res.data.phoneNumber,
                email: res.data.email,
                homeAddress: res.data.homeAddress || ''
            });
            const circRes = await fetchCirculars();
            setRecentCirculars(circRes.data.slice(0, 3));
            
            const parentRes = await fetchParentDetails();
            setParentDetails(parentRes.data);
        } catch (err) {
            setError('Failed to load profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await updateProfile({
                phoneNumber: editForm.phone,
                email: editForm.email,
                homeAddress: editForm.homeAddress
            });
            setProfile({
                ...profile,
                phoneNumber: editForm.phone,
                email: editForm.email,
                homeAddress: editForm.homeAddress
            });
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update profile.');
        }
    };

    if (loading) return <div className="loading">Loading profile...</div>;
    if (!profile) return <div className="error">{error}</div>;

    // Format DOB
    const formattedDate = profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'N/A';

    /* notification popup styles */
    const notifStyles = {
        overlay: {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            animation: 'notifSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            maxWidth: '380px',
            width: '100%',
        },
        card: {
            background: 'linear-gradient(135deg, #0f1729 0%, #162040 100%)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            borderRadius: '14px',
            padding: '18px 20px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.15)',
            color: '#e2e8f0',
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
        },
        headerLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        bellIcon: {
            background: 'rgba(99, 102, 241, 0.2)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#818cf8',
            animation: 'notifBellShake 0.6s ease 1s 1',
        },
        title: {
            fontSize: '14px',
            fontWeight: 700,
            color: '#c7d2fe',
            margin: 0,
        },
        closeBtn: {
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            transition: 'color 0.2s',
        },
        body: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '14px',
        },
        iconCircle: {
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: '#818cf8',
        },
        msgText: {
            fontSize: '13px',
            color: '#94a3b8',
            lineHeight: '1.5',
            margin: 0,
        },
        sender: {
            fontWeight: 600,
            color: '#e2e8f0',
        },
        highlight: {
            color: '#818cf8',
            fontWeight: 600,
        },
        actions: {
            display: 'flex',
            gap: '10px',
        },
        viewBtn: {
            flex: 1,
            padding: '9px 16px',
            borderRadius: '8px',
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s',
        },
        dismissBtn: {
            padding: '9px 16px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.06)',
            color: '#94a3b8',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
        },
        dot: {
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#22c55e',
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            boxShadow: '0 0 6px #22c55e',
        },
    };

    return (
        <div className="page-container">
            {/* Notification animation keyframes */}
            <style>{`
                @keyframes notifSlideIn {
                    from { opacity: 0; transform: translateX(100px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes notifSlideOut {
                    from { opacity: 1; transform: translateX(0); }
                    to   { opacity: 0; transform: translateX(100px); }
                }
                @keyframes notifBellShake {
                    0%, 100% { transform: rotate(0); }
                    20% { transform: rotate(15deg); }
                    40% { transform: rotate(-15deg); }
                    60% { transform: rotate(10deg); }
                    80% { transform: rotate(-5deg); }
                }
            `}</style>

            {/* Popup Notification */}
            {showNotification && (
                <div style={notifStyles.overlay}>
                    <div style={notifStyles.card}>
                        <div style={notifStyles.header}>
                            <div style={notifStyles.headerLeft}>
                                <div style={{ ...notifStyles.bellIcon, position: 'relative' }}>
                                    <Bell size={16} />
                                    <div style={notifStyles.dot}></div>
                                </div>
                                <h4 style={notifStyles.title}>New Circular from Faculty</h4>
                            </div>
                            <button
                                style={notifStyles.closeBtn}
                                onClick={() => setShowNotification(false)}
                                onMouseOver={e => e.currentTarget.style.color = '#e2e8f0'}
                                onMouseOut={e => e.currentTarget.style.color = '#64748b'}
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div style={notifStyles.body}>
                            <div style={notifStyles.iconCircle}>
                                <FileSignature size={20} />
                            </div>
                            <p style={notifStyles.msgText}>
                                <span style={notifStyles.sender}>Dr. Jane Smith</span> posted a new{' '}
                                <span style={notifStyles.highlight}>internship opportunity</span> —
                                Software Engineering Intern at Google. Apply before the deadline!
                            </p>
                        </div>
                        <div style={notifStyles.actions}>
                            <button
                                style={notifStyles.viewBtn}
                                onClick={() => { setShowNotification(false); router.push('/student/dashboard/circular'); }}
                                onMouseOver={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseOut={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <FileSignature size={14} /> View Circulars
                            </button>
                            <button
                                style={notifStyles.dismissBtn}
                                onClick={() => setShowNotification(false)}
                                onMouseOver={e => e.currentTarget.style.color = '#e2e8f0'}
                                onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <DashboardHeader />
            <div className="page-header flex justify-between items-center" style={{ marginTop: '20px' }}>
                <h2 className="page-title">Personal Information</h2>
                {!isEditing ? (
                    <button className="action-btn" onClick={() => setIsEditing(true)}>
                        <Edit2 size={16} /> Edit Contact Info
                    </button>
                ) : (
                    <div className="action-group">
                        <button className="action-btn save" onClick={handleSave}>
                            <Save size={16} /> Save
                        </button>
                        <button className="action-btn cancel" onClick={() => setIsEditing(false)}>
                            <X size={16} /> Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* ── ROW 1: Hero card + Bar graph ────────────────── */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

                {/* Hero Profile Card */}
                <div className="card" style={{ flex: '0 0 420px', minWidth: 0, marginBottom: 0 }}>
                    <div className="profile-header-bg">
                        <div className="profile-avatar">
                            <User size={48} color="#fff" />
                        </div>
                    </div>
                    <div className="profile-info" style={{ paddingTop: '58px', paddingBottom: '24px', paddingLeft: '24px', paddingRight: '24px' }}>
                        <h3 style={{ margin: '0 0 4px', fontSize: '20px' }}>{profile.name}</h3>
                        <p style={{ margin: '0 0 16px', fontSize: '14px', color: 'var(--primary)', fontWeight: 600 }}>
                            {profile.registerNumber}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[
                                { label: 'Department', value: profile.department },
                                { label: 'Year', value: `Year ${profile.year}` },
                                { label: 'Blood Group', value: profile.bloodGroup },
                                { label: 'Category', value: profile.category },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bar Graph */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <SemesterBarGraph />
                </div>
            </div>

            {/* ── ROW 2: Info mini-cards grid ──────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>

                {/* Academic Details Card */}
                <div className="pinfo-card">
                    <div className="pinfo-card-header">
                        <BookOpen size={16} className="pinfo-icon" />
                        <h4>Academic Details</h4>
                    </div>
                    <div className="pinfo-rows">
                        <div className="pinfo-row">
                            <span className="pinfo-label">Course / Branch</span>
                            <span className="pinfo-value">{profile.department}</span>
                        </div>
                        <div className="pinfo-row">
                            <span className="pinfo-label">Year of Study</span>
                            <span className="pinfo-value">Year {profile.year}</span>
                        </div>
                        <div className="pinfo-row">
                            <span className="pinfo-label">Register Number</span>
                            <span className="pinfo-value">{profile.registerNumber}</span>
                        </div>
                    </div>
                </div>

                {/* Demographic Info Card */}
                <div className="pinfo-card">
                    <div className="pinfo-card-header">
                        <UserCheck size={16} className="pinfo-icon" />
                        <h4>Demographic Info</h4>
                    </div>
                    <div className="pinfo-rows">
                        <div className="pinfo-row">
                            <span className="pinfo-label">Date of Birth</span>
                            <span className="pinfo-value">{formattedDate}</span>
                        </div>
                        <div className="pinfo-row">
                            <span className="pinfo-label">Blood Group</span>
                            <span className="pinfo-value">{profile.bloodGroup}</span>
                        </div>
                        <div className="pinfo-row">
                            <span className="pinfo-label">Admission Type</span>
                            <span className="pinfo-value">{profile.admissionType}</span>
                        </div>
                        <div className="pinfo-row">
                            <span className="pinfo-label">Category</span>
                            <span className="pinfo-value">{profile.category}</span>
                        </div>
                    </div>
                </div>

                {/* Contact Information Card */}
                <div className="pinfo-card">
                    <div className="pinfo-card-header">
                        <Phone size={16} className="pinfo-icon" />
                        <h4>Contact Information</h4>
                    </div>
                    <div className="pinfo-rows">
                        <div className="pinfo-row">
                            <span className="pinfo-label">Phone</span>
                            {isEditing ? (
                                <input type="text" className="edit-input full-width" value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                            ) : (
                                <span className="pinfo-value">{profile.phoneNumber}</span>
                            )}
                        </div>
                        <div className="pinfo-row">
                            <span className="pinfo-label">Email</span>
                            {isEditing ? (
                                <input type="email" className="edit-input full-width" value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                            ) : (
                                <span className="pinfo-value">{profile.email}</span>
                            )}
                        </div>
                        <div className="pinfo-row">
                            <span className="pinfo-label">Address</span>
                            {isEditing ? (
                                <textarea className="edit-input auto-expand" rows="3" value={editForm.homeAddress}
                                    onChange={(e) => setEditForm({ ...editForm, homeAddress: e.target.value })} />
                            ) : (
                                <span className="pinfo-value" style={{ whiteSpace: 'pre-wrap' }}>{profile.homeAddress}</span>
                            )}
                        </div>
                    </div>
                </div>

            </div>{/* end row 2 */}
            
            {/* ── ROW 2.5: Parent Information ──────────────────── */}
            {parentDetails && (
                <div style={{ marginTop: '20px' }}>
                    <div className="pinfo-card" style={{ maxWidth: '100%' }}>
                        <div className="pinfo-card-header">
                            <Heart size={16} className="pinfo-icon" />
                            <h4>Parent Information</h4>
                        </div>
                        <div className="pinfo-parent-grid">
                            {/* Father Column */}
                            <div className="pinfo-column">
                                <div className="pinfo-row">
                                    <span className="pinfo-label">Father Name</span>
                                    <span className="pinfo-value">{parentDetails.fatherName}</span>
                                </div>
                                <div className="pinfo-row">
                                    <span className="pinfo-label">Father Phone</span>
                                    <span className="pinfo-value">{parentDetails.fatherPhone}</span>
                                </div>
                                <div className="pinfo-row">
                                    <span className="pinfo-label">Father Email</span>
                                    <span className="pinfo-value">{parentDetails.fatherEmail || 'N/A'}</span>
                                </div>
                            </div>
                            
                            {/* Mother Column */}
                            <div className="pinfo-column">
                                <div className="pinfo-row">
                                    <span className="pinfo-label">Mother Name</span>
                                    <span className="pinfo-value">{parentDetails.motherName}</span>
                                </div>
                                <div className="pinfo-row">
                                    <span className="pinfo-label">Mother Phone</span>
                                    <span className="pinfo-value">{parentDetails.motherPhone}</span>
                                </div>
                                <div className="pinfo-row">
                                    <span className="pinfo-label">Mother Email</span>
                                    <span className="pinfo-value">{parentDetails.motherEmail || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── ROW 3: Recent Circulars Widget ──────────────────── */}
            <div style={{ marginTop: '20px' }}>
                <div className="d-circular-widget">
                    <div className="d-widget-header">
                        <h3><Calendar size={18} color="var(--primary)" /> Recent Circulars</h3>
                        <Link href="/student/dashboard/circular" style={{ color: 'var(--primary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}>
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="d-widget-list">
                        {recentCirculars.length === 0 ? (
                            <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '10px 0' }}>No recent circulars available.</div>
                        ) : (
                            recentCirculars.map(circ => (
                                <div key={circ._id} className="d-circular-item" onClick={() => router.push('/student/dashboard/circular')}>
                                    <div className="d-ci-top">
                                        <span className="d-ci-title">{circ.title}</span>
                                        <span className={`c-badge bg-${circ.category.toLowerCase()}`} style={{fontSize: '9px', padding: '2px 6px'}}>{circ.category}</span>
                                    </div>
                                    <div className="d-ci-date">Posted: {new Date(circ.posted_date).toLocaleDateString()} | by {circ.posted_by}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ── ROW 4: Student Activity Timeline ──────────────────── */}
            <ActivityTimeline />

        </div>
    );
};

export default Profile;
