import React, { useState, useEffect } from 'react';
import { fetchGoals, submitGoal } from '../services/api';
import './CardStyles.css';

const StudentGoals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    const [interest, setInterest] = useState('');
    const [skills, setSkills] = useState('');
    const [targets, setTargets] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        try {
            const response = await fetchGoals();
            setGoals(response.data);
        } catch (error) {
            console.error("Error fetching goals:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGoal = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await submitGoal({
                careerInterest: interest,
                skillsToDevelop: skills,
                targetCompaniesOrUniversities: targets
            });
            alert('Goal added successfully!');
            setInterest('');
            setSkills('');
            setTargets('');
            loadGoals();
        } catch (error) {
            console.error("Error adding goal:", error);
            alert("Failed to add goal.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading goals...</div>;

    return (
        <div className="page-container">
            <h1 className="page-title">Career Goals / Future Planning</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <h2>Add New Goal</h2>
                </div>
                <div className="card-body">
                    <form className="details-form" onSubmit={handleAddGoal}>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Career Interest</label>
                            <input
                                type="text"
                                value={interest}
                                onChange={(e) => setInterest(e.target.value)}
                                placeholder="e.g. Software Engineer, Higher Studies in AI, Government Job"
                                required
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Skills to Develop (comma separated)</label>
                            <input
                                type="text"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                placeholder="e.g. React, Node.js, Public Speaking"
                                required
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Target Companies / Universities (comma separated)</label>
                            <input
                                type="text"
                                value={targets}
                                onChange={(e) => setTargets(e.target.value)}
                                placeholder="e.g. Google, Stanford, ISRO"
                                required
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <button type="submit" className="btn-primary" disabled={submitting}>
                                {submitting ? 'Adding...' : 'Add Goal'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {goals.length === 0 ? (
                <p>No goals set yet.</p>
            ) : (
                goals.map((goal) => (
                    <div className="card mb-4" key={goal._id}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0 }}>{goal.careerInterest}</h2>
                            <span className="status-badge info">{goal.progressStatus}</span>
                        </div>
                        <div className="card-body">
                            <div className="details-grid">
                                <div className="detail-item">
                                    <label>Created On</label>
                                    <p>{new Date(goal.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Skills to Develop</label>
                                    <p>
                                        {goal.skillsToDevelop.map((skill, index) => (
                                            <span key={index} style={{ display: 'inline-block', background: '#1f2937', color: '#d1d5db', padding: '4px 8px', borderRadius: '4px', marginRight: '5px', fontSize: '13px' }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                                <div className="detail-item">
                                    <label>Targets</label>
                                    <p>{goal.targetCompaniesOrUniversities.join(', ')}</p>
                                </div>
                                <div className="detail-item" style={{ gridColumn: '1 / -1', background: '#0f172a', padding: '15px', borderRadius: '6px', borderLeft: '4px solid var(--primary)' }}>
                                    <label style={{ color: 'var(--primary)' }}>Mentor's Suggestions</label>
                                    <p style={{ margin: 0 }}>{goal.mentorSuggestions || 'Awaiting mentor review.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default StudentGoals;
