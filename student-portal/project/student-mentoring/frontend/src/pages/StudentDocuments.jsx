import React, { useState, useEffect, useRef } from 'react';
import { fetchDocuments, uploadDocument, deleteDocument } from '../services/api';
import { UploadCloud, File, FileText, Image as ImageIcon, Search, Filter, Eye, Download, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import './CardStyles.css';

const StudentDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [docName, setDocName] = useState('');
    const [category, setCategory] = useState('Assignment');
    const [description, setDescription] = useState('');
    const [fileObj, setFileObj] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Filter/Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    // Preview state
    const [previewDoc, setPreviewDoc] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const response = await fetchDocuments();
            setDocuments(response.data);
        } catch (error) {
            console.error("Error fetching docs:", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Summary Stats
    const totalDocs = documents.length;
    const approvedDocs = documents.filter(d => d.status === 'Approved').length;
    const pendingDocs = documents.filter(d => d.status === 'Pending Review').length;
    const rejectedDocs = documents.filter(d => d.status === 'Rejected').length;

    // Filter logic
    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = filterCategory === 'All' || doc.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Drag and Drop Handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const handleFileSelection = (file) => {
        // Validate size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('File exceeds maximum size of 5MB');
            return;
        }
        setFileObj(file);
    };

    const onButtonClick = () => {
        fileInputRef.current.click();
    };

    // Upload Submission
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!docName || !category || !fileObj) {
            alert('Please fill all required fields and select a file.');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('documentName', docName);
            formData.append('category', category);
            formData.append('description', description);
            formData.append('documentFile', fileObj);

            await uploadDocument(formData);
            alert('Document uploaded successfully!');

            // Reset form
            setDocName('');
            setCategory('Assignment');
            setDescription('');
            setFileObj(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

            loadDocuments();
        } catch (error) {
            console.error("Upload error:", error);
            alert('Failed to upload document. Please ensure valid file type constraints.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this document?")) {
            try {
                await deleteDocument(id);
                setDocuments(documents.filter(d => d._id !== id));
            } catch (error) {
                console.error("Delete error", error);
                alert("Failed to delete document.");
            }
        }
    };

    const renderFileIcon = (fileType) => {
        if (!fileType) return <File size={16} />;
        if (fileType.includes('pdf')) return <FileText size={16} color="#ef4444" />;
        if (fileType.includes('image')) return <ImageIcon size={16} color="#3b82f6" />;
        if (fileType.includes('word') || fileType.includes('document')) return <File size={16} color="#2563eb" />;
        return <File size={16} />;
    };

    const renderStatusBadge = (status) => {
        switch (status) {
            case 'Approved':
                return <span className="status-badge success"><CheckCircle size={14} /> Approved</span>;
            case 'Rejected':
                return <span className="status-badge error"><XCircle size={14} /> Rejected</span>;
            case 'Pending Review':
            default:
                return <span className="status-badge pending"><Clock size={14} /> Pending</span>;
        }
    };

    if (loading) return <div>Loading documents...</div>;

    return (
        <div className="page-container" style={{ paddingBottom: '3rem' }}>
            <h1 className="page-title">Document Hub</h1>

            {/* Summary Cards */}
            <div className="summary-cards-container">
                <div className="summary-card">
                    <div className="summary-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                        <File size={24} />
                    </div>
                    <div className="summary-info">
                        <h3>Total Documents</h3>
                        <p>{totalDocs}</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div className="summary-info">
                        <h3>Approved</h3>
                        <p>{approvedDocs}</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon" style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>
                        <Clock size={24} />
                    </div>
                    <div className="summary-info">
                        <h3>Pending</h3>
                        <p>{pendingDocs}</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                        <XCircle size={24} />
                    </div>
                    <div className="summary-info">
                        <h3>Rejected</h3>
                        <p>{rejectedDocs}</p>
                    </div>
                </div>
            </div>

            {/* Upload Section */}
            <div className="card mb-4 mt-4">
                <div className="card-header">
                    <h2>Upload New Document</h2>
                </div>
                <div className="card-body">
                    <form className="details-form" onSubmit={handleUpload}>
                        <div className="form-group">
                            <label>Document Name *</label>
                            <input
                                type="text"
                                value={docName}
                                onChange={(e) => setDocName(e.target.value)}
                                placeholder="e.g. Code Assignment 1"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Category *</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                                <option value="Assignment">Assignment</option>
                                <option value="Project Document">Project Document</option>
                                <option value="On Duty (OD) Letter">On Duty (OD) Letter</option>
                                <option value="Permission Letter">Permission Letter</option>
                                <option value="Medical Certificate">Medical Certificate</option>
                                <option value="Achievement Certificate">Achievement Certificate</option>
                                <option value="Competition Certificate">Competition Certificate</option>
                                <option value="Internship Letter">Internship Letter</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Description / Notes</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description of the document contents..."
                                rows="2"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        {/* Drag and Drop Zone */}
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Upload File *</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="input-file-upload"
                                multiple={false}
                                onChange={handleChange}
                                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                style={{ display: 'none' }}
                            />

                            <div
                                className={`drag-drop-zone ${dragActive ? "drag-active" : ""}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={onButtonClick}
                                style={{
                                    height: '150px',
                                    border: `2px dashed ${dragActive ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                    borderRadius: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: dragActive ? 'rgba(37, 99, 235, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    textAlign: 'center',
                                    padding: '1rem'
                                }}
                            >
                                {fileObj ? (
                                    <div style={{ color: 'var(--success-color)' }}>
                                        <File size={32} style={{ margin: '0 auto 8px auto' }} />
                                        <p style={{ fontWeight: '500' }}>{fileObj.name}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {(fileObj.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud size={32} color="var(--text-secondary)" style={{ marginBottom: '10px' }} />
                                        <p>Drag and drop your file here, or click to browse</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                            Allowed: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <button type="submit" className="btn-primary" disabled={uploading}>
                                {uploading ? 'Uploading Document...' : 'Upload Document'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Document Table Section */}
            <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2>Uploaded Documents</h2>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    padding: '8px 10px 8px 35px',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    color: 'var(--text-primary)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Filter size={18} color="var(--text-secondary)" />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                style={{
                                    padding: '8px',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    color: 'var(--text-primary)',
                                    outline: 'none'
                                }}
                            >
                                <option value="All">All Categories</option>
                                <option value="Assignment">Assignment</option>
                                <option value="Project Document">Project Document</option>
                                <option value="On Duty (OD) Letter">On Duty (OD) Letter</option>
                                <option value="Permission Letter">Permission Letter</option>
                                <option value="Achievement Certificate">Achievement Certificate</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Document Details</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Upload Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocuments.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                            No matching documents found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDocuments.map((doc) => (
                                        <tr key={doc._id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    {renderFileIcon(doc.fileType)}
                                                    <div>
                                                        <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{doc.documentName}</div>
                                                        {doc.description && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{doc.description.substring(0, 40)}{doc.description.length > 40 ? '...' : ''}</div>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{doc.category}</td>
                                            <td>
                                                {renderStatusBadge(doc.status)}
                                                {doc.status === 'Rejected' && doc.facultyRemarks && (
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--error-color)', marginTop: '4px' }}>
                                                        Reason: {doc.facultyRemarks}
                                                    </div>
                                                )}
                                            </td>
                                            <td>{new Date(doc.uploadDate).toLocaleDateString()}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button
                                                        className="btn-icon"
                                                        title="Preview"
                                                        onClick={() => setPreviewDoc(doc)}
                                                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <a
                                                        href={`http://localhost:5000${doc.fileUrl}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Download"
                                                        style={{ color: 'var(--text-secondary)' }}
                                                    >
                                                        <Download size={18} />
                                                    </a>
                                                    {doc.status !== 'Approved' && (
                                                        <button
                                                            className="btn-icon"
                                                            title="Delete"
                                                            onClick={() => handleDelete(doc._id)}
                                                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--error-color)' }}
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Document Preview Modal */}
            {previewDoc && (
                <div className="modal-overlay" onClick={() => setPreviewDoc(null)} style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem'
                }}>
                    <div className="modal-content card" onClick={(e) => e.stopPropagation()} style={{
                        width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column'
                    }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2>{previewDoc.documentName} Preview</h2>
                            <button onClick={() => setPreviewDoc(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div className="card-body" style={{ flexGrow: 1, padding: 0, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f', minHeight: '400px' }}>
                            {previewDoc.fileType && previewDoc.fileType.includes('image') ? (
                                <img src={`http://localhost:5000${previewDoc.fileUrl}`} alt={previewDoc.documentName} style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }} />
                            ) : previewDoc.fileType && previewDoc.fileType.includes('pdf') ? (
                                <iframe src={`http://localhost:5000${previewDoc.fileUrl}`} title={previewDoc.documentName} style={{ width: '100%', height: '60vh', border: 'none' }} />
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <File size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
                                    <p>Preview not available for this file type.</p>
                                    <a href={`http://localhost:5000${previewDoc.fileUrl}`} download className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
                                        Download to View
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default StudentDocuments;
