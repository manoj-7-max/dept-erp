import React, { useState, useEffect } from 'react';
import {
    fetchMentor, fetchMentoringReports, createMentoringReport,
    scheduleMeeting, fetchMentoringTasks, addMentoringTask, 
    updateTaskStatus, submitConcern
} from '../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);
import {
    UserCheck, Phone, Mail, BookOpen, AlertCircle, Clock,
    CheckCircle, Calendar, MessageSquare, ArrowRight, FileText,
    Filter, Plus, List, Layout, Upload, Paperclip, ClipboardList,
    CheckSquare, Square, Mic, StopCircle, Trash2, Play, Pause
} from 'lucide-react';
import './CardStyles.css';

const Mentor = () => {
    const [mentor, setMentor] = useState(null);
    const [reports, setReports] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'table'
    const [filters, setFilters] = useState({ semester: '', year: '', meetingMode: '', status: '' });

    // Modals visibility
    const [showReportModal, setShowReportModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);

    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [filters]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [mentorRes, reportsRes, tasksRes] = await Promise.all([
                fetchMentor(),
                fetchMentoringReports(filters),
                fetchMentoringTasks()
            ]);
            setMentor(mentorRes.data);
            setReports(reportsRes.data);
            setTasks(tasksRes.data);
        } catch (err) {
            setError('Failed to load mentor dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // --- Task Status Toggle ---
    const toggleTaskStatus = async (task) => {
        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
        try {
            await updateTaskStatus(task._id, { status: newStatus });
            loadData();
        } catch (err) {
            alert('Failed to update task status');
        }
    };

    // --- Concern Submit ---
    const [concernData, setConcernData] = useState({ title: '', concernType: 'Academic', description: '' });
    const [concernSuccess, setConcernSuccess] = useState('');

    // Voice Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState('');
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (err) {
            alert('Could not access microphone.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    };

    const deleteRecording = () => {
        setAudioBlob(null);
        setAudioUrl('');
    };

    const handleConcernSubmit = async (e) => {
        e.preventDefault();
        try {
            setFormLoading(true);
            setConcernSuccess('');
            const formData = new FormData();
            formData.append('title', concernData.title);
            formData.append('concernType', concernData.concernType);
            formData.append('description', concernData.description);
            formData.append('recipientType', 'Faculty');
            formData.append('recipientId', mentor._id);
            
            if (audioBlob) {
                formData.append('voiceFile', audioBlob, 'voice-recording.webm');
            }

            await submitConcern(formData);
            setConcernSuccess('Concern submitted successfully to your mentor.');
            setConcernData({ title: '', concernType: 'Academic', description: '' });
            setAudioBlob(null);
            setAudioUrl('');
        } catch (err) {
            alert('Failed to submit concern');
        } finally {
            setFormLoading(false);
            setTimeout(() => setConcernSuccess(''), 5000);
        }
    };

    // --- Chart Data ---
    const performanceData = {
        labels: ['Attendance', 'Assignment Completion', 'Internal Assessment', 'Co-Curricular Participation', 'Pending Tasks'],
        datasets: [
            {
                data: [85, 75, 80, 60, 20],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const barOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => `Score: ${context.raw}%`
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#94a3b8' }
            },
            y: {
                grid: { display: false },
                ticks: { color: '#e2e8f0', font: { weight: '600' } }
            }
        }
    };

    // --- Schedule Meeting Submit ---
    const [scheduleData, setScheduleData] = useState({ meetingDate: '', time: '10:00 AM', meetingMode: 'Online', semester: '1', agenda: '' });
    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        try {
            setFormLoading(true);
            await scheduleMeeting({ ...scheduleData, mentorId: mentor._id });
            setShowScheduleModal(false);
            setScheduleData({ meetingDate: '', time: '10:00 AM', meetingMode: 'Online', semester: '1', agenda: '' });
            loadData();
        } catch (err) {
            alert('Failed to schedule meeting');
        } finally {
            setFormLoading(false);
        }
    };



    // --- Task Submit ---
    const [taskData, setTaskData] = useState({ description: '', dueDate: '' });
    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        try {
            setFormLoading(true);
            await addMentoringTask({ mentorId: mentor._id, ...taskData });
            setShowTaskModal(false);
            setTaskData({ description: '', dueDate: '' });
            loadData();
        } catch (err) {
            alert('Failed to add task');
        } finally {
            setFormLoading(false);
        }
    };

    // --- Report Submit ---
    const [reportFile, setReportFile] = useState(null);
    const [reportData, setReportData] = useState({
        meetingDate: '', meetingMode: 'Online', semester: '', year: '',
        issuesIdentified: '', discussionSummary: '', actionPlan: '', status: 'Completed', nextMeetingDate: ''
    });
    const handleReportSubmit = async (e) => {
        e.preventDefault();
        try {
            setFormLoading(true);
            const submitData = new FormData();
            submitData.append('mentorName', mentor.name);
            Object.keys(reportData).forEach(key => submitData.append(key, reportData[key]));
            if (reportFile) submitData.append('attachmentFile', reportFile);

            await createMentoringReport(submitData);
            setShowReportModal(false);
            setReportFile(null);
            loadData();
        } catch (err) {
            alert('Failed to submit report');
        } finally {
            setFormLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'var(--success)';
            case 'Action Required': return 'var(--danger)';
            case 'Pending Follow-up': return 'var(--warning)';
            case 'Pending': return 'var(--warning)';
            default: return 'var(--text-muted)';
        }
    };

    if (loading && !mentor) return <div className="loading">Loading dashboard...</div>;
    if (error && !mentor) return <div className="error">{error}</div>;

    const totalMeetings = reports.length;
    const activeTasks = tasks.filter(t => t.status !== 'Completed').length;
    const pendingFollowups = reports.filter(r => r.status === 'Pending Follow-up' || r.status === 'Action Required').length;
    const nextMeetingDate = reports.find(r => r.nextMeetingDate) ? new Date(reports.find(r => r.nextMeetingDate).nextMeetingDate).toLocaleDateString() : 'N/A';

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <h2 className="page-title" style={{ margin: 0 }}>My Mentor Dashboard</h2>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button className="primary" onClick={() => setShowScheduleModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} /> Schedule Meeting
                    </button>
                </div>
            </div>

            {/* Mentor Details Section */}
            {mentor && (
                <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="card-body">
                        <div className="flex-header mb-4">
                            <div className="avatar blue-bg">
                                <UserCheck size={32} color="#fff" />
                            </div>
                            <div>
                                <h3>{mentor.name}</h3>
                                <p className="subtitle">{mentor.designation}</p>
                            </div>
                        </div>

                        <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            <div className="info-item">
                                <span className="info-label"><BookOpen size={16} /> Department</span>
                                <span className="info-value">{mentor.department}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label"><Phone size={16} /> Contact</span>
                                <span className="info-value">{mentor.contactNumber}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label"><Mail size={16} /> Email</span>
                                <span className="info-value" style={{ wordBreak: 'break-all' }}>{mentor.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Dashboard Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
                <div className="card" style={{ marginBottom: 0, height: '100%' }}>
                    <div className="card-body" style={{ padding: '20px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '12px', borderRadius: '12px', marginRight: '16px' }}><MessageSquare size={24} /></div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '24px', color: 'var(--text-main)' }}>{totalMeetings}</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Total Meetings</p>
                        </div>
                    </div>
                </div>
                <div className="card" style={{ marginBottom: 0, height: '100%' }}>
                    <div className="card-body" style={{ padding: '20px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', padding: '12px', borderRadius: '12px', marginRight: '16px' }}><ClipboardList size={24} /></div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '24px', color: 'var(--text-main)' }}>{activeTasks}</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Active Tasks</p>
                        </div>
                    </div>
                </div>
                <div className="card" style={{ marginBottom: 0, height: '100%' }}>
                    <div className="card-body" style={{ padding: '20px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '12px', marginRight: '16px' }}><AlertCircle size={24} /></div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '24px', color: 'var(--text-main)' }}>{pendingFollowups}</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Follow-ups Needed</p>
                        </div>
                    </div>
                </div>
                <div className="card" style={{ marginBottom: 0, height: '100%' }}>
                    <div className="card-body" style={{ padding: '20px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', padding: '12px', borderRadius: '12px', marginRight: '16px' }}><Clock size={24} /></div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>{nextMeetingDate}</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Next Scheduled</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Grid: Tasks, Notes, Documents */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>

                {/* Action Items Column - Span 2 */}
                <div className="card" style={{ gridColumn: 'span 2', marginBottom: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckSquare size={18} color="var(--primary)" /> Action Items / Tasks
                        </h3>
                        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '380px', paddingRight: '10px' }}>
                            {tasks.length === 0 ? <p className="text-muted">No assigned tasks.</p> : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {tasks.map(task => (
                                        <div key={task._id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                            <button
                                                onClick={() => toggleTaskStatus(task)}
                                                style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', color: task.status === 'Completed' ? 'var(--success)' : 'var(--text-muted)' }}
                                            >
                                                {task.status === 'Completed' ? <CheckSquare size={20} /> : <Square size={20} />}
                                            </button>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: '0 0 4px 0', fontSize: '14px', textDecoration: task.status === 'Completed' ? 'line-through' : 'none', color: task.status === 'Completed' ? 'var(--text-muted)' : 'var(--text-main)' }}>
                                                    {task.description}
                                                </p>
                                                <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                                                    <span style={{ color: getStatusColor(task.status) }}>{task.status}</span>
                                                    {task.dueDate && <span style={{ color: 'var(--text-muted)' }}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Student Performance Chart - Span 2 */}
                <div className="card" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                    <div className="card-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }}>
                                <Layout size={18} color="var(--primary)" />
                            </div>
                            Student Performance Overview
                        </h3>
                        <div style={{ flex: 1, minHeight: '320px' }}>
                            <Bar data={performanceData} options={barOptions} />
                        </div>
                    </div>
                </div>

            </div>

            {/* Concern Submission Form */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-body" style={{ padding: '20px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Submit Student Concern to Mentor
                    </h3>
                    {concernSuccess && (
                        <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--success)' }}>
                            {concernSuccess}
                        </div>
                    )}
                    <form onSubmit={handleConcernSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label className="form-label mb-2">Title of Concern *</label>
                                <input type="text" required value={concernData.title} onChange={e => setConcernData({ ...concernData, title: e.target.value })} className="edit-input full-width" placeholder="Brief title" />
                            </div>
                            <div>
                                <label className="form-label mb-2">Concern Type *</label>
                                <select required value={concernData.concernType} onChange={e => setConcernData({ ...concernData, concernType: e.target.value })} className="edit-input full-width">
                                    <option value="Academic">Academic</option>
                                    <option value="Personal">Personal</option>
                                </select>
                            </div>
                        </div>

                        {/* Voice Recording Section */}
                        <div style={{ marginBottom: '16px', padding: '16px', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <label className="form-label mb-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Mic size={16} /> Voice Recording (Optional)
                            </label>
                            
                            {!audioUrl ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {!isRecording ? (
                                        <button 
                                            type="button" 
                                            onClick={startRecording}
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: '6px', cursor: 'pointer' }}
                                        >
                                            <Mic size={16} /> Start Recording
                                        </button>
                                    ) : (
                                        <button 
                                            type="button" 
                                            onClick={stopRecording}
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', animation: 'pulse 1.5s infinite' }}
                                        >
                                            <StopCircle size={16} /> Stop Recording
                                        </button>
                                    )}
                                    {isRecording && <span style={{ color: 'var(--danger)', fontSize: '13px', fontWeight: 600 }}>Recording...</span>}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <audio src={audioUrl} controls style={{ height: '36px' }} />
                                    <button 
                                        type="button" 
                                        onClick={deleteRecording}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: 'none', borderRadius: '50%', cursor: 'pointer' }}
                                        title="Delete recording"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label className="form-label mb-2">Description *</label>
                            <textarea required value={concernData.description} onChange={e => setConcernData({ ...concernData, description: e.target.value })} className="edit-input full-width" rows="4" placeholder="Detail your concern here..."></textarea>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="primary" disabled={formLoading}>{formLoading ? 'Submitting...' : 'Submit Concern'}</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Meetings History Section */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-body" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>Mentoring History</h3>
                        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-color)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <button className={viewMode === 'timeline' ? 'primary' : 'action-btn'} style={{ border: 'none', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }} onClick={() => setViewMode('timeline')}>
                                <Layout size={14} /> Timeline View
                            </button>
                            <button className={viewMode === 'table' ? 'primary' : 'action-btn'} style={{ border: 'none', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }} onClick={() => setViewMode('table')}>
                                <List size={14} /> Table View
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', padding: '12px', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, fontSize: '14px', marginRight: '8px' }}>
                            <Filter size={16} /> Filters:
                        </span>
                        <select name="semester" value={filters.semester} onChange={handleFilterChange} className="edit-input" style={{ padding: '6px 10px', fontSize: '13px' }}>
                            <option value="">All Semesters</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                        </select>
                        <select name="year" value={filters.year} onChange={handleFilterChange} className="edit-input" style={{ padding: '6px 10px', fontSize: '13px' }}>
                            <option value="">All Years</option>
                            {['2024', '2025', '2026'].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <select name="meetingMode" value={filters.meetingMode} onChange={handleFilterChange} className="edit-input" style={{ padding: '6px 10px', fontSize: '13px' }}>
                            <option value="">All Modes</option>
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                        </select>
                        <select name="status" value={filters.status} onChange={handleFilterChange} className="edit-input" style={{ padding: '6px 10px', fontSize: '13px' }}>
                            <option value="">All Statuses</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending Follow-up">Pending Follow-up</option>
                            <option value="Action Required">Action Required</option>
                        </select>
                    </div>

                    {reports.length === 0 ? (
                        <div className="alert-info">No mentoring reports available for the selected filters.</div>
                    ) : (
                        viewMode === 'timeline' ? (
                            <div className="reports-timeline" style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px solid var(--border-color)' }}>
                                {reports.map((report) => (
                                    <div className="timeline-card" key={report._id} style={{ position: 'relative', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', marginBottom: '24px', marginLeft: '24px' }}>
                                        {/* Dot */}
                                        <div style={{ position: 'absolute', left: '-36px', top: '24px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--primary)', border: '4px solid var(--bg-color)', zIndex: 1 }}></div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Calendar size={16} color="var(--primary)" />
                                                    {new Date(report.meetingDate).toLocaleDateString()}
                                                </h4>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>{report.meetingMode}</span>
                                                    <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', background: 'rgba(148, 163, 184, 0.1)', color: 'var(--text-muted)' }}>Sem {report.semester}</span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: getStatusColor(report.status), background: `${getStatusColor(report.status)}15`, padding: '6px 12px', borderRadius: '6px' }}>
                                                    {report.status === 'Completed' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                                    {report.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                            {report.issuesIdentified && (
                                                <div>
                                                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--warning)', marginBottom: '4px', fontWeight: 500 }}>Issues Identified</span>
                                                    <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5 }}>{report.issuesIdentified}</p>
                                                </div>
                                            )}
                                            <div>
                                                <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>Discussion Summary</span>
                                                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5 }}>{report.discussionSummary}</p>
                                            </div>
                                            <div>
                                                <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>Action Plan</span>
                                                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5 }}>{report.actionPlan}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                                            <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Date</th>
                                            <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Mode</th>
                                            <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Sem</th>
                                            <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Discussion</th>
                                            <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.map((report) => (
                                            <tr key={report._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="table-row-hover">
                                                <td style={{ padding: '16px 12px', whiteSpace: 'nowrap' }}>{new Date(report.meetingDate).toLocaleDateString()}</td>
                                                <td style={{ padding: '16px 12px' }}>{report.meetingMode}</td>
                                                <td style={{ padding: '16px 12px' }}>{report.semester}</td>
                                                <td style={{ padding: '16px 12px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{report.discussionSummary}</td>
                                                <td style={{ padding: '16px 12px' }}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: getStatusColor(report.status), background: `${getStatusColor(report.status)}15`, padding: '4px 10px', borderRadius: '12px' }}>
                                                        {report.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* Schedule Meeting Modal */}
            {showScheduleModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '20px' }}>
                        <div className="card-body">
                            <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>Schedule New Meeting</h3>
                            <form onSubmit={handleScheduleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <label className="form-label mb-2">Date *</label>
                                        <input type="date" required value={scheduleData.meetingDate} onChange={e => setScheduleData({ ...scheduleData, meetingDate: e.target.value })} className="edit-input full-width" />
                                    </div>
                                    <div>
                                        <label className="form-label mb-2">Time *</label>
                                        <input type="time" required value={scheduleData.time} onChange={e => setScheduleData({ ...scheduleData, time: e.target.value })} className="edit-input full-width" />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <label className="form-label mb-2">Mode *</label>
                                        <select required value={scheduleData.meetingMode} onChange={e => setScheduleData({ ...scheduleData, meetingMode: e.target.value })} className="edit-input full-width">
                                            <option value="Online">Online</option>
                                            <option value="Offline">Offline</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label mb-2">Semester *</label>
                                        <input type="number" required value={scheduleData.semester} onChange={e => setScheduleData({ ...scheduleData, semester: e.target.value })} className="edit-input full-width" />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '24px' }}>
                                    <label className="form-label mb-2">Agenda / Topic</label>
                                    <textarea value={scheduleData.agenda} onChange={e => setScheduleData({ ...scheduleData, agenda: e.target.value })} className="edit-input full-width" rows="3" placeholder="What will be discussed?"></textarea>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <button type="button" onClick={() => setShowScheduleModal(false)} className="action-btn">Cancel</button>
                                    <button type="submit" className="primary" disabled={formLoading}>{formLoading ? 'Scheduling...' : 'Schedule'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}



            {/* Add Task Modal */}
            {showTaskModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '400px', margin: '20px' }}>
                        <div className="card-body">
                            <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>Assign Action Item / Task</h3>
                            <form onSubmit={handleTaskSubmit}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label className="form-label mb-2">Task Description *</label>
                                    <input type="text" required value={taskData.description} onChange={e => setTaskData({ ...taskData, description: e.target.value })} className="edit-input full-width" placeholder="E.g. Submit medical certificate" />
                                </div>
                                <div style={{ marginBottom: '24px' }}>
                                    <label className="form-label mb-2">Due Date (Optional)</label>
                                    <input type="date" value={taskData.dueDate} onChange={e => setTaskData({ ...taskData, dueDate: e.target.value })} className="edit-input full-width" />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <button type="button" onClick={() => setShowTaskModal(false)} className="action-btn">Cancel</button>
                                    <button type="submit" className="primary" disabled={formLoading}>{formLoading ? 'Assigning...' : 'Assign Task'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Report Modal */}
            {showReportModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', margin: '20px' }}>
                        <div className="card-body">
                            <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>Create Mentoring Report (Faculty Verify)</h3>
                            <form onSubmit={handleReportSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <label className="form-label mb-2">Meeting Date *</label>
                                        <input type="date" name="meetingDate" required value={reportData.meetingDate} onChange={e => setReportData({ ...reportData, meetingDate: e.target.value })} className="edit-input full-width" />
                                    </div>
                                    <div>
                                        <label className="form-label mb-2">Next Meeting Date</label>
                                        <input type="date" name="nextMeetingDate" value={reportData.nextMeetingDate} onChange={e => setReportData({ ...reportData, nextMeetingDate: e.target.value })} className="edit-input full-width" />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <label className="form-label mb-2">Mode *</label>
                                        <select name="meetingMode" required value={reportData.meetingMode} onChange={e => setReportData({ ...reportData, meetingMode: e.target.value })} className="edit-input full-width">
                                            <option value="Online">Online</option>
                                            <option value="Offline">Offline</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label mb-2">Semester *</label>
                                        <input type="number" name="semester" required value={reportData.semester} onChange={e => setReportData({ ...reportData, semester: e.target.value })} className="edit-input full-width" />
                                    </div>
                                    <div>
                                        <label className="form-label mb-2">Year *</label>
                                        <input type="number" name="year" required value={reportData.year} onChange={e => setReportData({ ...reportData, year: e.target.value })} className="edit-input full-width" />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label className="form-label mb-2">Issues Identified</label>
                                    <textarea name="issuesIdentified" value={reportData.issuesIdentified} onChange={e => setReportData({ ...reportData, issuesIdentified: e.target.value })} className="edit-input full-width" rows="2"></textarea>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label className="form-label mb-2">Discussion Summary *</label>
                                    <textarea name="discussionSummary" required value={reportData.discussionSummary} onChange={e => setReportData({ ...reportData, discussionSummary: e.target.value })} className="edit-input full-width" rows="3"></textarea>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label className="form-label mb-2">Action Plan / Follow-up *</label>
                                    <textarea name="actionPlan" required value={reportData.actionPlan} onChange={e => setReportData({ ...reportData, actionPlan: e.target.value })} className="edit-input full-width" rows="2"></textarea>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                    <div>
                                        <label className="form-label mb-2">Status *</label>
                                        <select name="status" required value={reportData.status} onChange={e => setReportData({ ...reportData, status: e.target.value })} className="edit-input full-width">
                                            <option value="Completed">Completed</option>
                                            <option value="Pending Follow-up">Pending Follow-up</option>
                                            <option value="Action Required">Action Required</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label mb-2">Attachment (Optional)</label>
                                        <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e => setReportFile(e.target.files[0])} className="edit-input full-width" style={{ padding: '6px' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <button type="button" onClick={() => setShowReportModal(false)} className="action-btn">Cancel</button>
                                    <button type="submit" className="primary" disabled={formLoading}>{formLoading ? 'Saving...' : 'Save Report'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Mentor;
