import React, { useState, useEffect } from 'react';
import { fetchConcerns, submitConcern, fetchFacultyList } from '../services/api';
import { BACKEND_URL } from '@/config/apiConfig';
import { MessageSquare, Send, CheckCircle, Clock, AlertCircle, FileText, Mic, StopCircle, Trash2 } from 'lucide-react';
import './CardStyles.css';

const Concerns = () => {
    const [concerns, setConcerns] = useState([]);
    const [facultyList, setFacultyList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [concernType, setConcernType] = useState('Academic');
    const [priority, setPriority] = useState('Medium');
    const [recipientType, setRecipientType] = useState('Faculty');
    const [recipientId, setRecipientId] = useState('');
    const [attachmentFile, setAttachmentFile] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ text: '', type: '' });

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

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [concernsRes, facultyRes] = await Promise.all([
                fetchConcerns(),
                fetchFacultyList()
            ]);
            setConcerns(concernsRes.data);
            setFacultyList(facultyRes.data);
            if (facultyRes.data.length > 0) {
                setRecipientId(facultyRes.data[0]._id);
            }
        } catch (err) {
            setError('Failed to load concerns data.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setAttachmentFile(e.target.files[0]);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setConcernType('Academic');
        setPriority('Medium');
        setRecipientType('Faculty');
        if (facultyList.length > 0) setRecipientId(facultyList[0]._id);
        setAttachmentFile(null);
        setAudioBlob(null);
        setAudioUrl('');
        // Reset file input manually if needed (using uncontrolled input here)
        const fileInput = document.getElementById('attachmentInput');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            setSubmitMessage({ text: 'Please fill out all required fields.', type: 'error' });
            return;
        }

        if (recipientType === 'Faculty' && !recipientId) {
            setSubmitMessage({ text: 'Please select a faculty member.', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage({ text: '', type: '' });

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('concernType', concernType);
            formData.append('priority', priority);
            formData.append('recipientType', recipientType);
            if (recipientType === 'Faculty') {
                formData.append('recipientId', recipientId);
            }
            if (attachmentFile) {
                formData.append('attachmentFile', attachmentFile);
            }
            if (audioBlob) {
                formData.append('voiceFile', audioBlob, 'voice-recording.webm');
            }

            const res = await submitConcern(formData);

            // To properly show the populated faculty name in UI without a reload, we manually construct it
            const newConcern = res.data;
            if (recipientType === 'Faculty' && newConcern.recipientId) {
                const facultyObj = facultyList.find(f => f._id === recipientId);
                if (facultyObj) {
                    newConcern.recipientId = { _id: facultyObj._id, name: facultyObj.name, designation: facultyObj.designation };
                }
            }

            setConcerns([newConcern, ...concerns]);
            resetForm();
            setSubmitMessage({ text: 'Concern submitted successfully.', type: 'success' });
            setTimeout(() => setSubmitMessage({ text: '', type: '' }), 5000);
        } catch (err) {
            setSubmitMessage({ text: err.response?.data?.message || 'Failed to submit concern.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved': return <CheckCircle size={14} />;
            case 'Reviewed': return <AlertCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'var(--success)';
            case 'Reviewed': return 'var(--warning)';
            default: return 'var(--text-muted)';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'var(--danger)';
            case 'Medium': return 'var(--warning)';
            case 'Low': return 'var(--success)';
            default: return 'var(--text-main)';
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '1100px' }}>
            <div className="page-header">
                <h2 className="page-title">Personal & Academic Concerns</h2>
            </div>

            {loading && <div className="loading">Loading concerns...</div>}
            {error && <div className="error">{error}</div>}

            {!loading && !error && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>

                    {/* Submit Form Section */}
                    <div className="card">
                        <div className="card-body">
                            <h3 style={{ color: 'var(--primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                                <MessageSquare size={20} /> Submit New Concern
                            </h3>

                            {submitMessage.text && (
                                <div className={`alert-info ${submitMessage.type === 'error' ? 'error' : ''}`} style={{ marginBottom: '20px' }}>
                                    {submitMessage.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>

                                    <div className="form-group">
                                        <label className="form-label mb-2">Concern Title <span style={{ color: 'var(--danger)' }}>*</span></label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="edit-input full-width"
                                            placeholder="Brief summary of issue"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label mb-2">Concern Type</label>
                                        <select
                                            value={concernType}
                                            onChange={(e) => setConcernType(e.target.value)}
                                            className="edit-input full-width"
                                        >
                                            <option value="Academic">Academic</option>
                                            <option value="Personal">Personal</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label mb-2">Priority Level</label>
                                        <select
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value)}
                                            className="edit-input full-width"
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>

                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px', padding: '16px', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                    <div className="form-group">
                                        <label className="form-label mb-2">Send To</label>
                                        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', cursor: 'pointer' }}>
                                                <input
                                                    type="radio"
                                                    name="recipientType"
                                                    value="Faculty"
                                                    checked={recipientType === 'Faculty'}
                                                    onChange={() => setRecipientType('Faculty')}
                                                />
                                                Faculty
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', cursor: 'pointer' }}>
                                                <input
                                                    type="radio"
                                                    name="recipientType"
                                                    value="HOD"
                                                    checked={recipientType === 'HOD'}
                                                    onChange={() => setRecipientType('HOD')}
                                                />
                                                HOD
                                            </label>
                                        </div>
                                    </div>

                                    {recipientType === 'Faculty' ? (
                                        <div className="form-group" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                                            <label className="form-label mb-2">Select Faculty Member <span style={{ color: 'var(--danger)' }}>*</span></label>
                                            <select
                                                value={recipientId}
                                                onChange={(e) => setRecipientId(e.target.value)}
                                                className="edit-input full-width"
                                                style={{ border: '1px solid rgba(59, 130, 246, 0.3)', padding: '10px 14px', borderRadius: '8px' }}
                                                required
                                            >
                                                <optgroup label="Academic Mentors 🎓">
                                                    {facultyList.filter(f => f.department === 'Computer Science' || f.department === 'CSE').map(faculty => (
                                                        <option key={faculty._id} value={faculty._id}>
                                                            {faculty.name} - {faculty.designation}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                                <optgroup label="Personal Counselors 🤝">
                                                    {facultyList.filter(f => f.department === 'Student Affairs').map(faculty => (
                                                        <option key={faculty._id} value={faculty._id}>
                                                            {faculty.name} - {faculty.designation}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="form-group" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                                            <label className="form-label mb-2">Recipient</label>
                                            <input
                                                type="text"
                                                value="To the HOD"
                                                className="edit-input full-width"
                                                disabled
                                                style={{ opacity: 0.7 }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label className="form-label mb-2">Concern Description <span style={{ color: 'var(--danger)' }}>*</span></label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="edit-input full-width"
                                        rows="4"
                                        style={{ resize: 'vertical' }}
                                        placeholder="Provide detailed information about your concern..."
                                        required
                                    ></textarea>
                                </div>

                                <div className="form-group" style={{ marginBottom: '24px' }}>
                                    <label className="form-label mb-2">Attach Supporting Document (Optional)</label>
                                    <input
                                        id="attachmentInput"
                                        type="file"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="edit-input full-width"
                                        style={{ padding: '8px' }}
                                    />
                                    <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>Supported formats: PDF, DOCX, JPG, PNG.</small>
                                </div>

                                {/* Voice Recording Section */}
                                <div className="form-group" style={{ marginBottom: '24px', padding: '16px', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
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
                                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
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

                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button type="submit" className="action-btn save" disabled={isSubmitting} style={{ padding: '10px 24px' }}>
                                        <Send size={16} /> {isSubmitting ? 'Routing Concern...' : 'Submit Concern'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* History Table Section */}
                    <div>
                        <h3 style={{ color: 'var(--text-main)', margin: '0 0 16px 0', fontSize: '18px' }}>Concern History</h3>

                        {concerns.length === 0 ? (
                            <div className="alert-info">No previous concerns found.</div>
                        ) : (
                            <div className="card" style={{ overflow: 'hidden' }}>
                                <div className="table-responsive">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Date submitted</th>
                                                <th>Concern Details</th>
                                                <th>Sent To</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {concerns.map(concern => (
                                                <tr key={concern._id}>
                                                    <td style={{ verticalAlign: 'top', paddingTop: '16px' }}>
                                                        <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                                                            {new Date(concern.submittedAt).toLocaleDateString()}
                                                        </span>
                                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                                            {new Date(concern.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </td>
                                                    <td style={{ verticalAlign: 'top', paddingTop: '16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                            <strong style={{ color: 'var(--text-main)', fontSize: '15px' }}>{concern.title}</strong>
                                                            <span style={{
                                                                backgroundColor: concern.concernType === 'Academic' ? 'rgba(0,123,255,0.1)' : 'rgba(111,66,193,0.1)',
                                                                color: concern.concernType === 'Academic' ? 'var(--primary)' : '#6f42c1',
                                                                padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600
                                                            }}>
                                                                {concern.concernType}
                                                            </span>
                                                            <span style={{
                                                                border: `1px solid ${getPriorityColor(concern.priority)}`,
                                                                color: getPriorityColor(concern.priority),
                                                                padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600
                                                            }}>
                                                                {concern.priority}
                                                            </span>
                                                        </div>
                                                        <p style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5 }}>
                                                            {concern.description}
                                                        </p>
                                                        {concern.response && (
                                                            <div style={{ padding: '10px', backgroundColor: '#0f172a', borderLeft: '3px solid var(--primary)', borderRadius: '4px', marginBottom: '8px' }}>
                                                                <span style={{ display: 'block', fontSize: '12px', color: 'var(--primary)', fontWeight: 600, marginBottom: '4px' }}>Resolution / Response:</span>
                                                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)' }}>{concern.response}</p>
                                                            </div>
                                                        )}
                                                        {concern.attachmentFile && (
                                                            <a href={`${BACKEND_URL}${concern.attachmentFile}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--primary)', padding: '4px 8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '4px', marginRight: '8px' }}>
                                                                <FileText size={14} /> View Document
                                                            </a>
                                                        )}
                                                        {concern.voiceFile && (
                                                            <div style={{ marginTop: '8px' }}>
                                                                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Voice Recording:</span>
                                                                <audio src={`${BACKEND_URL}${concern.voiceFile}`} controls style={{ height: '30px', maxWidth: '200px' }} />
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={{ verticalAlign: 'top', paddingTop: '16px' }}>
                                                        {concern.recipientType === 'Faculty' ? (
                                                            <div style={{ color: 'var(--text-main)', fontSize: '14px', fontWeight: 500 }}>
                                                                {concern.recipientId ? concern.recipientId.name : 'Unknown Faculty'}
                                                                <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 400 }}>
                                                                    {concern.recipientId ? concern.recipientId.designation : ''}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span style={{ color: 'var(--text-main)', fontSize: '14px', fontWeight: 500 }}>The HOD</span>
                                                        )}
                                                    </td>
                                                    <td style={{ verticalAlign: 'top', paddingTop: '16px' }}>
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: getStatusColor(concern.status), fontWeight: 600, background: `${getStatusColor(concern.status)}15`, padding: '6px 12px', borderRadius: '6px' }}>
                                                            {getStatusIcon(concern.status)} {concern.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
};

export default Concerns;
