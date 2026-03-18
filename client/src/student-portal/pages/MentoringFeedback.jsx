import React, { useState, useEffect } from 'react';
import { fetchMeetings, submitFeedback } from '../services/api';
import { Star } from 'lucide-react';
import './CardStyles.css';

const MentoringFeedback = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedMeeting, setSelectedMeeting] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comments, setComments] = useState('');
    const [suggestions, setSuggestions] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadMeetings = async () => {
            try {
                const response = await fetchMeetings();
                setMeetings(response.data);
            } catch (error) {
                console.error("Error fetching meetings:", error);
            } finally {
                setLoading(false);
            }
        };
        loadMeetings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMeeting || rating === 0 || !comments) {
            alert('Please select a meeting, provide a rating, and add comments.');
            return;
        }

        setSubmitting(true);
        try {
            // Find the first meeting matching the selected type
            const matchedMeeting = meetings.find(m => m.meetingType === selectedMeeting);
            await submitFeedback({
                meetingId: matchedMeeting ? matchedMeeting._id : selectedMeeting,
                rating,
                feedbackComments: comments,
                suggestions
            });
            alert('Feedback submitted successfully!');
            setSelectedMeeting('');
            setRating(0);
            setComments('');
            setSuggestions('');
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Failed to submit feedback.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading meetings...</div>;

    return (
        <div className="page-container">
            <h1 className="page-title">Mentoring Feedback System</h1>

            <div className="card">
                <div className="card-header">
                    <h2>Submit Session Feedback</h2>
                </div>
                <div className="card-body">
                    <form className="details-form" onSubmit={handleSubmit}>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Select Meeting</label>
                            <select
                                value={selectedMeeting}
                                onChange={(e) => setSelectedMeeting(e.target.value)}
                                required
                            >
                                <option value="">-- Choose a Meeting to Review --</option>
                                <option value="Mentor Meeting">Mentor Meeting</option>
                                <option value="Class Committee Meeting">Class Committee Meeting</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>How would you rate the session?</label>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={32}
                                        fill={(hoverRating || rating) >= star ? '#f1c40f' : 'none'}
                                        color={(hoverRating || rating) >= star ? '#f1c40f' : '#ccc'}
                                        style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Feedback Comments</label>
                            <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                rows="4"
                                placeholder="What went well? Was the interaction helpful?"
                                required
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Suggestions for Improvement (Optional)</label>
                            <textarea
                                value={suggestions}
                                onChange={(e) => setSuggestions(e.target.value)}
                                rows="2"
                                placeholder="Any suggestions for your mentor for future sessions?"
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <button type="submit" className="btn-primary" disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            {/* Note about reading past feedback could go here */}
            <div style={{ marginTop: '20px', color: '#666', fontSize: '14px', textAlign: 'center' }}>
                Feedback is confidential and helps us improve the mentoring experience.
            </div>
        </div>
    );
};

export default MentoringFeedback;
