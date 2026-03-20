import React, { useState, useEffect } from 'react';
import { Search, Plus, ExternalLink, Download, Clock, MapPin, User, Calendar, X, AlertCircle } from 'lucide-react';
import { fetchCirculars, postCircular } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './CircularPage.css';

const CircularPage = () => {
    const { user } = useAuth();
    const [circulars, setCirculars] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // UI States
    const isStaff = user?.role === 'hod' || user?.role === 'faculty' || user?.role === 'class_incharge';
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showPostModal, setShowPostModal] = useState(false);
    const [selectedCircular, setSelectedCircular] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        category: 'Official',
        description: '',
        content: '',
        audience: 'ALL',
        isPublic: true,
        event_date: '',
        deadline: '',
        location: '',
        organizer: '',
        attachment_url: '',
        registration_link: '',
    });

    useEffect(() => {
        loadCirculars();
    }, []);

    const loadCirculars = async () => {
        try {
            const res = await fetchCirculars();
            setCirculars(res.data);
        } catch (err) {
            console.error("Failed to fetch circulars:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await postCircular(formData);
            setCirculars([res.data, ...circulars]);
            setShowPostModal(false);
            setFormData({ 
                title: '', category: 'Official', description: '', content: '', 
                audience: 'ALL', isPublic: true, event_date: '', deadline: '', 
                location: '', organizer: '', attachment_url: '', registration_link: '' 
            });
        } catch (err) {
            console.error("Failed to post circular:", err);
            alert("Error posting circular. Please try again.");
        }
    };

    // Derived Data
    const tabs = ['All', 'Symposium', 'Internship', 'Hackathon', 'Official', 'Academics'];

    const filteredCirculars = circulars.filter(c => {
        // Tab Filter
        if (activeTab === 'Upcoming') {
            const isUpcoming = new Date(c.event_date) >= new Date();
            if (!isUpcoming) return false;
        } else if (activeTab !== 'All') {
            if (c.category !== activeTab) return false;
        }

        // Search Filter
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            return c.title.toLowerCase().includes(lowerQ) || 
                   c.category.toLowerCase().includes(lowerQ);
        }
        
        return true;
    });

    // Helpers
    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const getDaysLeft = (deadline) => {
        if (!deadline) return 0;
        const diff = new Date(deadline) - new Date();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    if (loading) return <div className="loading-spinner" style={{marginTop:'40px', textAlign:'center'}}>Loading events...</div>;

    return (
        <div className="circular-page">
            <div className="circular-header">
                <div>
                    <h1 className="circular-title">
                        <Calendar size={28} color="var(--primary)" />
                        Circulars & Announcements
                    </h1>
                    <p className="circular-subtitle">Discover opportunities, symposiums, and announcements.</p>
                </div>
                
                <div className="circular-controls">
                    {isStaff && (
                        <button className="post-btn" onClick={() => setShowPostModal(true)}>
                            <Plus size={18} /> Post Circular
                        </button>
                    )}
                </div>
            </div>

            <div className="circular-filters">
                <div className="c-tabs">
                    {tabs.map(tab => (
                        <button 
                            key={tab} 
                            className={`c-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                
                <div className="c-search">
                    <Search size={16} color="var(--text-muted)" />
                    <input 
                        type="text" 
                        placeholder="Search circulars..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Circulars Grid */}
            {filteredCirculars.length === 0 ? (
                <div style={{textAlign:'center', padding:'60px 20px', color:'var(--text-muted)', background:'#0b1220', borderRadius:'12px', border:'1px dashed var(--border-color)'}}>
                    <AlertCircle size={40} style={{margin:'0 auto 16px', opacity:0.5}} />
                    <h3>No Circulars Found</h3>
                    <p>Try adjusting your filters or search query.</p>
                </div>
            ) : (
                <div className="circular-grid">
                    {filteredCirculars.map((circ) => {
                        const daysLeft = getDaysLeft(circ.deadline);
                        const isClosingSoon = daysLeft >= 0 && daysLeft <= 3;
                        const isNew = getDaysLeft(circ.posted_date) >= -2; // Posted in last 2 days

                        return (
                            <div key={circ._id} className="c-card" data-cat={circ.category}>
                                {circ.attachment_url && (
                                    <img src={circ.attachment_url} className="c-card-img" alt={circ.title} />
                                )}
                                {isClosingSoon && <div className="c-urgent-tag">CLOSING SOON</div>}
                                {!isClosingSoon && isNew && <div className="c-urgent-tag" style={{background:'#10b981'}}>NEW</div>}
                                
                                <div className="c-badge-row">
                                    <span className={`c-badge bg-${circ.category.toLowerCase()}`}>{circ.category}</span>
                                    <span className="c-date">Posted: {formatDate(circ.posted_date)}</span>
                                </div>
                                
                                <h3>{circ.title}</h3>
                                <p className="c-desc">{circ.description}</p>
                                
                                <div className="c-meta">
                                    <div className="c-meta-item" title="Event Date">
                                        <Calendar size={14} /> {formatDate(circ.event_date)}
                                    </div>
                                    <div className="c-meta-item" title="Deadline">
                                        <Clock size={14} color={isClosingSoon ? '#ef4444' : 'inherit'} /> 
                                        {daysLeft < 0 ? 'Closed' : `${daysLeft} days left`}
                                    </div>
                                </div>
                                
                                <div className="c-footer">
                                    <div className="c-faculty">
                                        <User size={12} style={{verticalAlign:'middle', marginRight:'4px'}} /> 
                                        {circ.posted_by?.name || circ.organizer}
                                    </div>
                                    <button className="c-view-btn" onClick={() => setSelectedCircular(circ)}>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Post Modal (Staff Only) */}
            {showPostModal && isStaff && (
                <div className="c-modal-overlay">
                    <div className="c-modal">
                        <div className="c-modal-header">
                            <h2>Post New Circular</h2>
                            <button className="c-modal-close" onClick={() => setShowPostModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="c-modal-body">
                            <form id="postCircularForm" onSubmit={handlePostSubmit}>
                                <div className="c-form-group">
                                    <label>Circular Title</label>
                                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. AI Symposium 2026" />
                                </div>
                                
                                <div className="c-row">
                                    <div className="c-form-group">
                                        <label>Category</label>
                                        <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                            <option value="Official">Official</option>
                                            <option value="Academics">Academics</option>
                                            <option value="Symposium">Symposium</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Hackathon">Hackathon</option>
                                        </select>
                                    </div>
                                    <div className="c-form-group">
                                        <label>Target Audience</label>
                                        <select required value={formData.audience} onChange={e => setFormData({...formData, audience: e.target.value})}>
                                            <option value="ALL">All Roles</option>
                                            <option value="STUDENT">Students Only</option>
                                            <option value="FACULTY">Faculty Only</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="c-form-group">
                                    <label>Brief Description</label>
                                    <textarea rows="2" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Short summary for the card view..."></textarea>
                                </div>

                                <div className="c-form-group">
                                    <label>Full Content / Long Form Text</label>
                                    <textarea rows="4" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Full details, instructions, etc..."></textarea>
                                </div>

                                <div className="c-row">
                                    <div className="c-form-group">
                                        <label>Organizer</label>
                                        <input type="text" required value={formData.organizer} onChange={e => setFormData({...formData, organizer: e.target.value})} placeholder="e.g. CSE Department" />
                                    </div>
                                    <div className="c-form-group" style={{display:'flex', alignItems:'center', gap:'10px', marginTop:'24px'}}>
                                        <input type="checkbox" checked={formData.isPublic} onChange={e => setFormData({...formData, isPublic: e.target.checked})} id="isPublic" />
                                        <label htmlFor="isPublic" style={{margin:0}}>Make Publicly Visible</label>
                                    </div>
                                </div>

                                <div className="c-row">
                                    <div className="c-form-group">
                                        <label>Event Date (Optional)</label>
                                        <input type="date" value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} />
                                    </div>
                                    <div className="c-form-group">
                                        <label>Deadline (Optional)</label>
                                        <input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                                    </div>
                                </div>

                                <div className="c-form-group">
                                    <label>Location / Platform</label>
                                    <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Main Auditorium or Online" />
                                </div>

                                <div className="c-row">
                                    <div className="c-form-group">
                                        <label>Attachment URL (Optional)</label>
                                        <input type="url" value={formData.attachment_file} onChange={e => setFormData({...formData, attachment_file: e.target.value})} placeholder="Link to PDF/Poster" />
                                    </div>
                                    <div className="c-form-group">
                                        <label>External Registration Link (Optional)</label>
                                        <input type="url" value={formData.registration_link} onChange={e => setFormData({...formData, registration_link: e.target.value})} placeholder="https://..." />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="c-modal-footer">
                            <button type="button" className="cd-btn outline" onClick={() => setShowPostModal(false)}>Cancel</button>
                            <button type="submit" form="postCircularForm" className="cd-btn primary">Post Circular</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Detail Modal */}
            {selectedCircular && (
                <div className="c-modal-overlay" onClick={() => setSelectedCircular(null)}>
                    <div className="c-modal" onClick={e => e.stopPropagation()}>
                        <div className="c-modal-header" style={{borderBottomColor: `var(--border-color)`}}>
                            <div className="c-badge-row" style={{marginBottom:0, gap:'12px'}}>
                                <span className={`c-badge bg-${selectedCircular.category.toLowerCase()}`}>{selectedCircular.category}</span>
                            </div>
                            <button className="c-modal-close" onClick={() => setSelectedCircular(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="c-modal-body">
                            <h2 style={{fontSize:'22px', margin:'0 0 16px', color:'#fff'}}>{selectedCircular.title}</h2>
                            
                            <div className="c-meta" style={{marginBottom: '20px'}}>
                                <span className="c-meta-item"><User size={14} /> Posted by {selectedCircular.posted_by}</span>
                                <span className="c-meta-item"><Clock size={14} /> {formatDate(selectedCircular.posted_date)}</span>
                            </div>

                            <div className="c-detail-meta">
                                <div>
                                    <div style={{color:'var(--text-muted)', fontSize:'12px', marginBottom:'4px'}}>Event Date</div>
                                    <div style={{fontWeight:'600', color:'#fff', display:'flex', alignItems:'center', gap:'6px'}}><Calendar size={14}/> {formatDate(selectedCircular.event_date)}</div>
                                </div>
                                <div>
                                    <div style={{color:'var(--text-muted)', fontSize:'12px', marginBottom:'4px'}}>Deadline</div>
                                    <div style={{fontWeight:'600', color:'#fff', display:'flex', alignItems:'center', gap:'6px'}}><AlertCircle size={14}/> {formatDate(selectedCircular.deadline)}</div>
                                </div>
                                <div>
                                    <div style={{color:'var(--text-muted)', fontSize:'12px', marginBottom:'4px'}}>Location</div>
                                    <div style={{fontWeight:'600', color:'#fff', display:'flex', alignItems:'center', gap:'6px'}}><MapPin size={14}/> {selectedCircular.location}</div>
                                </div>
                                <div>
                                    <div style={{color:'var(--text-muted)', fontSize:'12px', marginBottom:'4px'}}>Organized By</div>
                                    <div style={{fontWeight:'600', color:'#fff', display:'flex', alignItems:'center', gap:'6px'}}><User size={14}/> {selectedCircular.organizer}</div>
                                </div>
                            </div>

                            <div className="cd-desc">
                                {selectedCircular.description}
                            </div>

                            {selectedCircular.attachment_file && (
                                <div style={{width:'100%', marginBottom:'24px', borderRadius:'12px', overflow:'hidden', border:'1px solid var(--border-color)'}}>
                                    <img src={selectedCircular.attachment_file} alt="Event Brochure / Poster" style={{width:'100%', display:'block'}} />
                                </div>
                            )}

                            <div className="cd-actions">
                                {selectedCircular.attachment_file && (
                                    <a href={selectedCircular.attachment_file} target="_blank" rel="noreferrer" className="cd-btn outline">
                                        <Download size={16} /> Download Brochure
                                    </a>
                                )}
                                {selectedCircular.registration_link && (
                                    <a href={selectedCircular.registration_link} target="_blank" rel="noreferrer" className="cd-btn primary">
                                        Register Now <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CircularPage;
