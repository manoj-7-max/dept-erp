import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, ExternalLink, ChevronLeft, ChevronRight, FileText, MapPin, Clock, User } from 'lucide-react';
import './OpportunitiesCarousel.css';

/* ── Dummy Data — Faculty-Posted Opportunities ─────────────────── */
const OPPORTUNITIES = [
    {
        id: 1,
        title: 'Software Engineering Intern',
        company: 'Google',
        location: 'Bangalore, India',
        deadline: '2026-04-15',
        postedBy: 'Dr. Jane Smith',
        type: 'Internship',
        description: 'Work on large-scale distributed systems and contribute to products used by millions.',
        brochureUrl: '#',
        logo: '🔵',
        color: '#4285F4',
    },
    {
        id: 2,
        title: 'Data Science Summer Intern',
        company: 'Microsoft',
        location: 'Hyderabad, India',
        deadline: '2026-04-20',
        postedBy: 'Dr. Jane Smith',
        type: 'Internship',
        description: 'Apply machine learning models to real-world datasets powering Azure AI.',
        brochureUrl: '#',
        logo: '🟢',
        color: '#00A4EF',
    },
    {
        id: 3,
        title: 'Cloud Engineering Trainee',
        company: 'Amazon Web Services',
        location: 'Chennai, India',
        deadline: '2026-05-01',
        postedBy: 'Prof. Kumar R.',
        type: 'Training',
        description: 'Hands-on training on AWS infrastructure, serverless computing, and DevOps practices.',
        brochureUrl: '#',
        logo: '🟠',
        color: '#FF9900',
    },
    {
        id: 4,
        title: 'Full Stack Developer Intern',
        company: 'Zoho Corporation',
        location: 'Chennai, India',
        deadline: '2026-04-30',
        postedBy: 'Dr. Jane Smith',
        type: 'Internship',
        description: 'Build scalable web applications using modern JavaScript frameworks and Java backend.',
        brochureUrl: '#',
        logo: '🔴',
        color: '#E42527',
    },
    {
        id: 5,
        title: 'AI Research Internship',
        company: 'IIT Madras Research Park',
        location: 'Chennai, India',
        deadline: '2026-05-10',
        postedBy: 'Prof. Kumar R.',
        type: 'Research',
        description: 'Contribute to cutting-edge NLP and computer vision research projects.',
        brochureUrl: '#',
        logo: '🟣',
        color: '#7C3AED',
    },
    {
        id: 6,
        title: 'Cybersecurity Analyst Intern',
        company: 'TCS iON',
        location: 'Mumbai, India',
        deadline: '2026-05-15',
        postedBy: 'Dr. Meena S.',
        type: 'Internship',
        description: 'Learn penetration testing, threat analysis, and security compliance frameworks.',
        brochureUrl: '#',
        logo: '🛡️',
        color: '#0F9D58',
    },
];

const OpportunitiesCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const timerRef = useRef(null);
    const total = OPPORTUNITIES.length;

    // Auto-rotate
    useEffect(() => {
        if (isAutoPlay) {
            timerRef.current = setInterval(() => {
                setActiveIndex(prev => (prev + 1) % total);
            }, 4000);
        }
        return () => clearInterval(timerRef.current);
    }, [isAutoPlay, total]);

    const goTo = (idx) => {
        setActiveIndex(idx);
        setIsAutoPlay(false);
        // Resume auto-play after 10s of inactivity
        clearTimeout(timerRef.current);
        setTimeout(() => setIsAutoPlay(true), 10000);
    };

    const prev = () => goTo((activeIndex - 1 + total) % total);
    const next = () => goTo((activeIndex + 1) % total);

    const opp = OPPORTUNITIES[activeIndex];
    const daysLeft = Math.max(0, Math.ceil((new Date(opp.deadline) - new Date()) / (1000 * 60 * 60 * 24)));

    return (
        <div className="opp-carousel-section">
            {/* Title */}
            <div className="opp-carousel-header">
                <div className="opp-header-left">
                    <Briefcase size={20} />
                    <h3>Opportunities &amp; Brochures</h3>
                </div>
                <span className="opp-badge">{total} Posted</span>
            </div>

            {/* Carousel body */}
            <div className="opp-carousel-body">
                {/* Circular thumbnail strip */}
                <div className="opp-circle-strip">
                    {OPPORTUNITIES.map((item, idx) => (
                        <div
                            key={item.id}
                            className={`opp-circle-thumb ${idx === activeIndex ? 'active' : ''}`}
                            style={{ '--ring-color': item.color }}
                            onClick={() => goTo(idx)}
                            title={item.company}
                        >
                            <span className="opp-circle-logo">{item.logo}</span>
                        </div>
                    ))}
                </div>

                {/* Active card */}
                <div className="opp-active-card" style={{ '--card-accent': opp.color }}>
                    <div className="opp-card-top">
                        <div className="opp-card-logo-big" style={{ background: `${opp.color}18`, borderColor: `${opp.color}44` }}>
                            <span>{opp.logo}</span>
                        </div>
                        <div className="opp-card-title-area">
                            <span className="opp-type-chip" style={{ background: `${opp.color}20`, color: opp.color, borderColor: `${opp.color}55` }}>
                                {opp.type}
                            </span>
                            <h4 className="opp-card-title">{opp.title}</h4>
                            <p className="opp-card-company">{opp.company}</p>
                        </div>
                    </div>

                    <p className="opp-card-desc">{opp.description}</p>

                    <div className="opp-card-meta">
                        <div className="opp-meta-item">
                            <MapPin size={14} />
                            <span>{opp.location}</span>
                        </div>
                        <div className="opp-meta-item">
                            <Clock size={14} />
                            <span>{daysLeft} days left</span>
                        </div>
                        <div className="opp-meta-item">
                            <User size={14} />
                            <span>{opp.postedBy}</span>
                        </div>
                    </div>

                    <div className="opp-card-actions">
                        <a href={opp.brochureUrl} className="opp-brochure-btn" target="_blank" rel="noreferrer">
                            <FileText size={15} /> View Brochure
                        </a>
                        <a href={opp.brochureUrl} className="opp-apply-btn" style={{ background: opp.color }} target="_blank" rel="noreferrer">
                            <ExternalLink size={15} /> Apply Now
                        </a>
                    </div>
                </div>

                {/* Nav arrows */}
                <div className="opp-nav-arrows">
                    <button className="opp-arrow" onClick={prev}><ChevronLeft size={20} /></button>
                    <span className="opp-counter">{activeIndex + 1} / {total}</span>
                    <button className="opp-arrow" onClick={next}><ChevronRight size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export default OpportunitiesCarousel;
