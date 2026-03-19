import React, { useState, useEffect } from 'react';
import { fetchParentDetails } from '../services/api';
import { Users, Phone, Mail, MapPin, Briefcase, DollarSign, Smartphone } from 'lucide-react';
import './CardStyles.css';

const ParentDetails = () => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDetails();
    }, []);

    const loadDetails = async () => {
        try {
            const res = await fetchParentDetails();
            setDetails(res.data);
        } catch (err) {
            setError('Failed to load parent details.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading details...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!details) return <div className="alert-info">Parent details not configured.</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Parent / Guardian Details</h2>
                    <p className="subtitle mt-2">View-only access for students. Contact admin for updates.</p>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="flex-header mb-6 border-b pb-6">
                        <div className="avatar blue-bg">
                            <Users size={32} color="#fff" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '20px', margin: '0 0 4px 0' }}>{details.parentName}</h3>
                            <p className="subtitle">Primary Contact</p>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-column">
                            <h4 className="column-title">Contact Methods</h4>

                            <div className="form-row">
                                <span className="form-label"><Phone size={16} /> Phone Number</span>
                                <span className="form-value">{details.phoneNumber}</span>
                            </div>

                            <div className="form-row">
                                <span className="form-label"><Smartphone size={16} /> Mobile Number</span>
                                <span className="form-value">{details.mobileNumber || 'N/A'}</span>
                            </div>

                            <div className="form-row">
                                <span className="form-label"><Mail size={16} /> Email Address</span>
                                <span className="form-value">{details.email || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="form-column">
                            <h4 className="column-title">Background Information</h4>

                            <div className="form-row">
                                <span className="form-label"><Briefcase size={16} /> Occupation</span>
                                <span className="form-value">{details.occupation || 'N/A'}</span>
                            </div>

                            <div className="form-row">
                                <span className="form-label"><DollarSign size={16} /> Annual Income</span>
                                <span className="form-value">{details.annualIncome || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="form-column" style={{ width: '100%', gridColumn: '1 / -1', marginTop: '16px' }}>
                            <div className="form-row address-row">
                                <span className="form-label"><MapPin size={16} /> Home Address</span>
                                <span className="form-value multi-line px-4 py-3 bg-gray-50 rounded-lg">{details.homeAddress}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDetails;
