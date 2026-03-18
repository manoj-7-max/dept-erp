"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Mic, MicOff, Send, X, Bot, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

// ─── Suggestion chips per role ──────────────────────────────────────────────
const SUGGESTIONS: Record<string, { label: string; cmd: string }[]> = {
    hod: [
        { label: 'Dashboard', cmd: 'dashboard' },
        { label: 'Academics', cmd: 'academics' },
        { label: 'Faculty List', cmd: 'faculty list' },
        { label: 'Students', cmd: 'students' },
        { label: 'Faculty Requests', cmd: 'faculty requests' },
        { label: 'Student Requests', cmd: 'student requests' },
        { label: 'Student Complaints', cmd: 'student complaints' },
        { label: 'Staff Complaints', cmd: 'staff complaints' },
        { label: 'Publications', cmd: 'publications' },
        { label: 'Reports', cmd: 'reports' },
        { label: 'Circulars', cmd: 'circulars' },
        { label: 'R&D Performance', cmd: 'r&d performance' },
        { label: 'Staff Performance', cmd: 'staff performance' },
    ],
    faculty: [
        { label: 'Dashboard', cmd: 'dashboard' },
        { label: 'Academics', cmd: 'academics' },
        { label: 'Lesson Plan', cmd: 'lesson plan' },
        { label: 'Logbook', cmd: 'logbook' },
        { label: 'Notes Upload', cmd: 'notes upload' },
        { label: 'Attendance', cmd: 'attendance' },
        { label: 'Daily Test', cmd: 'daily test' },
        { label: 'Internal Assessment', cmd: 'internal assessment' },
        { label: 'Mentor', cmd: 'mentor' },
        { label: 'Research Papers', cmd: 'research papers' },
        { label: 'Resources', cmd: 'resources' },
        { label: 'Requests', cmd: 'requests' },
        { label: 'Complaints', cmd: 'complaints' },
        { label: 'Circulars', cmd: 'circulars' },
        { label: 'Profile', cmd: 'profile' },
        { label: 'Reports', cmd: 'reports' },
    ],
    incharge: [
        { label: 'Dashboard', cmd: 'dashboard' },
        { label: 'Attendance', cmd: 'attendance' },
        { label: 'Academic Records', cmd: 'academic records' },
        { label: 'Daily Test Marks', cmd: 'daily test marks' },
        { label: 'Internal Marks 1', cmd: 'internal marks 1' },
        { label: 'Internal Marks 2', cmd: 'internal marks 2' },
        { label: 'Co-Curricular', cmd: 'co-curricular' },
        { label: 'Feedback', cmd: 'feedback' },
        { label: 'Reports', cmd: 'reports' },
    ],
    student: [
        { label: 'Profile', cmd: 'profile' },
        { label: 'Academic Records', cmd: 'academic records' },
        { label: 'Attendance', cmd: 'attendance' },
        { label: 'Mentor', cmd: 'mentor' },
        { label: 'Documents', cmd: 'documents' },
        { label: 'Concerns', cmd: 'concerns' },
        { label: 'Goals', cmd: 'goals' },
    ],
};

export default function ERPAssistant() {
    const { user } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [recognition, setRecognition] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Only render on client to prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
        const role = user?.role?.toLowerCase() || 'faculty';
        const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
        setMessages([{
            id: '1',
            text: `Hello ${user?.name || 'there'}! I'm your ERP Assistant (${roleLabel} Portal). Say or type a command like "Go to Academics".`,
            sender: 'bot',
            timestamp: new Date()
        }]);

        // Initialize Speech Recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const rec = new SpeechRecognition();
            rec.continuous = false;
            rec.interimResults = false;
            rec.lang = 'en-US';
            rec.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                addMessage(transcript, 'user');
                processCommand(transcript.toLowerCase());
                setIsListening(false);
            };
            rec.onerror = () => setIsListening(false);
            rec.onend = () => setIsListening(false);
            setRecognition(rec);
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const addMessage = (text: string, sender: 'user' | 'bot') => {
        setMessages(prev => [...prev, {
            id: Date.now().toString() + Math.random(),
            text,
            sender,
            timestamp: new Date()
        }]);
    };

    const processCommand = (rawText: string) => {
        const role = user?.role?.toLowerCase() || 'faculty';

        // Determine portal flags
        const isHOD = role === 'hod';
        const isFaculty = role === 'faculty';
        const isIncharge = role === 'incharge';
        const isStudent = role === 'student';

        // Strip common navigation prefixes before keyword matching
        const prefixes = ['navigate to ', 'go to ', 'open ', 'show ', 'take me to ', 'load ', 'switch to ', 'bring up '];
        let text = rawText.toLowerCase().replace(/ page$/, '').trim();
        for (const prefix of prefixes) {
            if (text.startsWith(prefix)) {
                text = text.slice(prefix.length).trim();
                break;
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // Full command map.
        // portal: 'hod' | 'faculty' | 'incharge' | 'student' | 'shared'
        //   'shared' → resolves dynamically via `path` (already role-resolved).
        // ⚠️ ORDER MATTERS: more specific entries MUST come before broader ones.
        // ─────────────────────────────────────────────────────────────────────
        const commands: { keywords: string[]; path: string; label: string; portal: 'hod' | 'faculty' | 'incharge' | 'student' | 'shared' }[] = [

            // ══ ACADEMICS — Sub-components (Faculty portal) ═══════════════════
            {
                keywords: ['lesson plan', 'lesson plans', 'lesson', 'teaching plan'],
                path: '/dashboard/faculty/academics/lesson-plan',
                label: 'Lesson Plan',
                portal: 'faculty'
            },
            {
                keywords: ['notes upload', 'upload notes', 'notes', 'study material', 'materials'],
                path: '/dashboard/faculty/academics/notes',
                label: 'Notes Upload',
                portal: 'faculty'
            },
            {
                keywords: ['logbook', 'log book', 'log entries', 'class log'],
                path: '/dashboard/faculty/academics/logbook',
                label: 'Logbook',
                portal: 'faculty'
            },
            // Academics — parent (shared: HOD → /dashboard/academics, others → /dashboard/<role>/academics)
            {
                keywords: ['academics', 'academic'],
                path: isHOD ? '/dashboard/academics'
                    : isFaculty ? '/dashboard/faculty/academics'
                        : isIncharge ? '/dashboard/incharge'  // incharge has no separate academics
                            : '/student/dashboard/academic-records',
                label: 'Academics',
                portal: 'shared'
            },

            // ══ REQUESTS — Sub-components (HOD portal) ════════════════════════
            {
                keywords: ['student request', 'student requests', 'requests from student', 'student approvals'],
                path: '/dashboard/hod/student-requests',
                label: 'Student Requests',
                portal: 'hod'
            },
            {
                keywords: ['faculty request', 'faculty requests', 'requests from faculty', 'faculty approvals', 'staff request', 'staff requests'],
                path: '/dashboard/hod/faculty-requests',
                label: 'Faculty Requests',
                portal: 'hod'
            },
            // Requests — shared
            {
                keywords: ['requests', 'request', 'approval', 'approvals', 'pending approval', 'pending approvals'],
                path: isHOD ? '/dashboard/hod/requests' : '/dashboard/faculty/requests',
                label: 'Requests',
                portal: isHOD || isFaculty ? 'shared' : isFaculty ? 'faculty' : 'hod'
            },

            // ══ COMPLAINTS — Sub-components (HOD portal) ══════════════════════
            {
                keywords: ['student complaint', 'student complaints', 'student feedback', 'student review', 'student grievance'],
                path: '/dashboard/hod/student-complaints',
                label: 'Student Complaints',
                portal: 'hod'
            },
            {
                keywords: ['staff complaint', 'staff complaints', 'staff grievance', 'staff issues'],
                path: '/dashboard/hod/complaints/staff',
                label: 'Staff Complaints',
                portal: 'hod'
            },
            // Complaints — shared
            {
                keywords: ['complaints', 'complaint', 'grievance', 'grievances', 'feedback'],
                path: isHOD ? '/dashboard/hod/complaints'
                    : isFaculty ? '/dashboard/faculty/complaint'
                        : '/student/dashboard/concerns',
                label: 'Complaints',
                portal: 'shared'
            },

            // ══ REPORTS — shared ══════════════════════════════════════════════
            {
                keywords: ['attendance report', 'attendance reports', 'report attendance', 'absenteeism report'],
                path: isHOD ? '/dashboard/hod/reports'
                    : isFaculty ? '/dashboard/faculty/reports'
                        : isIncharge ? '/dashboard/incharge/reports'
                            : '/student/dashboard/attendance',
                label: 'Attendance Report',
                portal: 'shared'
            },
            {
                keywords: ['academic report', 'academic reports', 'marks report', 'performance report', 'result report'],
                path: isHOD ? '/dashboard/hod/reports'
                    : isFaculty ? '/dashboard/faculty/reports'
                        : isIncharge ? '/dashboard/incharge/reports'
                            : '/student/dashboard/academic-records',
                label: 'Academic Report',
                portal: 'shared'
            },
            {
                keywords: ['reports', 'report'],
                path: isHOD ? '/dashboard/hod/reports'
                    : isFaculty ? '/dashboard/faculty/reports'
                        : isIncharge ? '/dashboard/incharge/reports'
                            : '/student/dashboard/profile',
                label: 'Reports',
                portal: 'shared'
            },

            // ══ HOD-only pages ════════════════════════════════════════════════
            {
                keywords: ['faculty list', 'faculty page', 'teachers', 'teaching staff', 'all faculty'],
                path: '/dashboard/hod/faculty',
                label: 'Faculty List',
                portal: 'hod'
            },
            {
                keywords: ['students', 'student list', 'all students'],
                path: '/dashboard/hod/students',
                label: 'Students',
                portal: 'hod'
            },
            {
                keywords: ['publications', 'publication', 'papers published'],
                path: '/dashboard/hod/publications',
                label: 'Publications',
                portal: 'hod'
            },
            {
                keywords: ['r and d performance', 'r&d performance', 'r&d', 'research and development', 'research performance'],
                path: '/dashboard/hod/performance',
                label: 'R&D Performance',
                portal: 'hod'
            },
            {
                keywords: ['staff performance', 'staff report'],
                path: '/dashboard/hod/staff-performance',
                label: 'Staff Performance',
                portal: 'hod'
            },

            // ══ Faculty-only pages ════════════════════════════════════════════
            {
                keywords: ['daily test', 'test marks', 'quiz marks', 'quiz'],
                path: '/dashboard/faculty/daily-test',
                label: 'Daily Test',
                portal: 'faculty'
            },
            {
                keywords: ['internal assessment', 'internal marks', 'cia', 'cia marks', 'internal'],
                path: '/dashboard/faculty/internal-assessment',
                label: 'Internal Assessment',
                portal: 'faculty'
            },
            {
                keywords: ['research papers', 'my publications', 'my papers', 'research'],
                path: '/dashboard/faculty/research-papers',
                label: 'Research Papers',
                portal: 'faculty'
            },
            {
                keywords: ['mentor', 'mentoring', 'mentees', 'mentee students'],
                path: '/dashboard/faculty/mentor',
                label: 'Mentor Dashboard',
                portal: 'faculty'
            },
            {
                keywords: ['attendance', 'mark attendance', 'class attendance'],
                path: isFaculty ? '/dashboard/faculty/attendance'
                    : isIncharge ? '/dashboard/incharge/attendance'
                        : isStudent ? '/student/dashboard/attendance'
                            : '/dashboard/hod',
                label: 'Attendance',
                portal: 'shared'
            },
            {
                keywords: ['resources', 'resource', 'teaching resources', 'materials library'],
                path: '/dashboard/faculty/resources',
                label: 'Resources',
                portal: 'faculty'
            },

            // ══ Incharge-only pages ═══════════════════════════════════════════
            {
                keywords: ['academic records', 'academic record', 'student academic'],
                path: '/dashboard/incharge/academic-records',
                label: 'Academic Records',
                portal: 'incharge'
            },
            {
                keywords: ['daily test marks', 'test mark', 'test score'],
                path: '/dashboard/incharge/daily-test-marks',
                label: 'Daily Test Marks',
                portal: 'incharge'
            },
            {
                keywords: ['internal marks 1', 'internal mark 1', 'cia 1', 'first internal'],
                path: '/dashboard/incharge/internal-marks-1',
                label: 'Internal Marks 1',
                portal: 'incharge'
            },
            {
                keywords: ['internal marks 2', 'internal mark 2', 'cia 2', 'second internal'],
                path: '/dashboard/incharge/internal-marks-2',
                label: 'Internal Marks 2',
                portal: 'incharge'
            },
            {
                keywords: ['co-curricular', 'co curricular', 'extracurricular', 'extra curricular', 'activities'],
                path: '/dashboard/incharge/co-curricular',
                label: 'Co-Curricular',
                portal: 'incharge'
            },

            // ══ Student-only pages ════════════════════════════════════════════
            {
                keywords: ['academic records', 'marks', 'grades', 'results', 'internal marks', 'performance'],
                path: '/student/dashboard/academic-records',
                label: 'Academic Records',
                portal: 'student'
            },
            {
                keywords: ['my mentor', 'mentoring', 'mentor meetings', 'mentor discussion'],
                path: '/student/dashboard/mentor',
                label: 'Mentor Dashboard',
                portal: 'student'
            },
            {
                keywords: ['activities', 'co-curricular', 'extra curricular', 'achievements'],
                path: '/student/dashboard/activities',
                label: 'Activities',
                portal: 'student'
            },
            {
                keywords: ['behaviour', 'academic behaviour', 'discipline', 'remarks'],
                path: '/student/dashboard/behaviour',
                label: 'Behaviour',
                portal: 'student'
            },
            {
                keywords: ['concerns', 'personal concerns', 'submit concern', 'issues'],
                path: '/student/dashboard/concerns',
                label: 'Concerns',
                portal: 'student'
            },
            {
                keywords: ['documents', 'my documents', 'upload document', 'certificates', 'hub'],
                path: '/student/dashboard/documents',
                label: 'Documents',
                portal: 'student'
            },
            {
                keywords: ['goals', 'student goals', 'career goals', 'planning', 'future'],
                path: '/student/dashboard/goals',
                label: 'Student Goals',
                portal: 'student'
            },
            {
                keywords: ['mentoring feedback', 'session feedback'],
                path: '/student/dashboard/feedback',
                label: 'Feedback',
                portal: 'student'
            },
            {
                keywords: ['timeline', 'activity timeline', 'recent activities', 'history'],
                path: '/student/dashboard/timeline',
                label: 'Activity Timeline',
                portal: 'student'
            },
            {
                keywords: ['student profile', 'personal info', 'parent details'],
                path: '/student/dashboard/profile',
                label: 'Student Profile',
                portal: 'student'
            },

            // ══ Shared pages ══════════════════════════════════════════════════
            {
                keywords: ['circulars', 'circular', 'notices', 'notice', 'announcements', 'bulletin'],
                path: isHOD ? '/dashboard/hod/circulars'
                    : isFaculty ? '/dashboard/faculty/circulars'
                        : isStudent ? '/student/dashboard/circular'
                            : '/dashboard/incharge',
                label: 'Circulars & Notices',
                portal: 'shared'
            },
            {
                keywords: ['profile', 'my profile', 'account', 'my account', 'my info'],
                path: isStudent ? '/student/dashboard/profile' : '/dashboard/faculty/profile',
                label: 'Profile',
                portal: 'shared'
            },
            {
                keywords: ['faculty dashboard'],
                path: '/dashboard/faculty',
                label: 'Faculty Dashboard',
                portal: 'faculty'
            },
            {
                keywords: ['hod dashboard', 'hod home'],
                path: '/dashboard/hod',
                label: 'HOD Dashboard',
                portal: 'hod'
            },
            {
                keywords: ['incharge dashboard', 'incharge home', 'class incharge'],
                path: '/dashboard/incharge',
                label: 'Incharge Dashboard',
                portal: 'incharge'
            },
            {
                keywords: ['student dashboard', 'student home'],
                path: '/student/dashboard/profile',
                label: 'Student Dashboard',
                portal: 'student'
            },
            // Generic dashboard / home — resolves to current role's home
            {
                keywords: ['dashboard', 'home', 'overview', 'main', 'start'],
                path: isHOD ? '/dashboard/hod'
                    : isFaculty ? '/dashboard/faculty'
                        : isIncharge ? '/dashboard/incharge'
                            : '/student/dashboard/profile',
                label: 'Dashboard',
                portal: 'shared'
            },
        ];

        // ── Find matching command ────────────────────────────────────────────
        let matchedCmd: (typeof commands)[number] | null = null;
        for (const cmd of commands) {
            if (cmd.keywords.some(k => text.includes(k))) {
                matchedCmd = cmd;
                break;
            }
        }

        if (!matchedCmd) {
            const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
            setTimeout(() => {
                addMessage(
                    `❓ I didn't understand that. Try commands like:\n` +
                    (isHOD
                        ? "• 'Open Academics'\n• 'Show Student Complaints'\n• 'Go to Faculty Requests'\n• 'Open Publications'\n• 'Staff Performance'"
                        : isFaculty
                            ? "• 'Open Academics'\n• 'Lesson Plan'\n• 'Mark Attendance'\n• 'Go to Resources'\n• 'Show Mentor'"
                            : isIncharge
                                ? "• 'Open Attendance'\n• 'Daily Test Marks'\n• 'Internal Marks 1'\n• 'Co-Curricular'\n• 'Academic Records'"
                                : "• 'Open Attendance'\n• 'Show Academic Records'\n• 'Circulars'\n• 'My Mentor'\n• 'My Profile'"),
                    'bot'
                );
            }, 400);
            return;
        }

        // ── Role-based portal access check ──────────────────────────────────
        // 'shared' commands are always allowed (path already resolved per role).
        const portalMap: Record<string, string> = {
            hod: 'HOD', faculty: 'Faculty', incharge: 'Incharge', student: 'Student'
        };
        const portalName = portalMap[role] || 'Faculty';

        const isBlocked =
            (matchedCmd.portal === 'hod' && !isHOD) ||
            (matchedCmd.portal === 'faculty' && !isFaculty) ||
            (matchedCmd.portal === 'incharge' && !isIncharge) ||
            (matchedCmd.portal === 'student' && !isStudent);

        if (isBlocked) {
            const targetPortal = portalMap[matchedCmd.portal] || matchedCmd.portal;
            setTimeout(() => {
                addMessage(
                    `🚫 "${matchedCmd!.label}" belongs to the ${targetPortal} portal.\n` +
                    `You are currently in the ${portalName} dashboard and do not have access to this page.`,
                    'bot'
                );
            }, 400);
            return;
        }

        // ── All checks passed — navigate ─────────────────────────────────────
        setTimeout(() => {
            addMessage(`✅ Opening ${matchedCmd!.label}...`, 'bot');
            setTimeout(() => {
                router.push(matchedCmd!.path);
                setIsOpen(false);
            }, 900);
        }, 400);
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const text = inputValue.trim();
        setInputValue('');
        addMessage(text, 'user');
        processCommand(text.toLowerCase());
    };

    const handleMic = () => {
        if (!recognition) {
            addMessage("⚠️ Voice recognition is not supported in this browser. Please try Chrome.", 'bot');
            return;
        }
        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            setIsListening(true);
            recognition.start();
        }
    };

    // Don't render on server to prevent hydration issues
    if (!mounted) return null;

    const role = user?.role?.toLowerCase() || 'faculty';
    const suggestions = SUGGESTIONS[role] || SUGGESTIONS['faculty'];

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                fontFamily: 'inherit',
            }}
        >
            {/* Chat Panel */}
            {isOpen && (
                <div
                    style={{
                        marginBottom: '16px',
                        width: '380px',
                        height: '520px',
                        background: '#ffffff',
                        borderRadius: '20px',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.20)',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        animation: 'fadeSlideUp 0.25s ease-out',
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '16px 20px',
                        background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexShrink: 0,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: 'rgba(255,255,255,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Bot size={20} />
                            </div>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '14px', margin: 0 }}>ERP Assistant</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', animation: 'pulse 2s infinite' }} />
                                    <span style={{ fontSize: '10px', opacity: 0.8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)} Portal
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                border: 'none',
                                borderRadius: '8px',
                                width: '32px', height: '32px',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white',
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '16px',
                            background: '#f8fafc',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}
                    >
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <div style={{
                                    maxWidth: '80%',
                                    padding: '10px 14px',
                                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    background: msg.sender === 'user' ? 'linear-gradient(135deg, #2563eb, #4f46e5)' : '#ffffff',
                                    color: msg.sender === 'user' ? 'white' : '#1e293b',
                                    fontSize: '13px',
                                    lineHeight: '1.5',
                                    boxShadow: msg.sender === 'bot' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                    border: msg.sender === 'bot' ? '1px solid #e2e8f0' : 'none',
                                    fontWeight: 500,
                                    whiteSpace: 'pre-line',
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isListening && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div style={{
                                    padding: '10px 16px',
                                    background: '#fee2e2',
                                    borderRadius: '18px 18px 18px 4px',
                                    border: '1px solid #fecaca',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                }}>
                                    <Loader2 size={14} color="#ef4444" style={{ animation: 'spin 1s linear infinite' }} />
                                    <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600, letterSpacing: '0.05em' }}>LISTENING...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Suggestions — role-aware chips */}
                    <div style={{
                        padding: '8px 16px',
                        background: '#f1f5f9',
                        display: 'flex',
                        gap: '6px',
                        overflowX: 'auto',
                        flexShrink: 0,
                        borderTop: '1px solid #e2e8f0',
                    }}>
                        {suggestions.map((s) => (
                            <button
                                key={s.cmd}
                                onClick={() => { addMessage(s.label, 'user'); processCommand(s.cmd); }}
                                style={{
                                    padding: '4px 12px',
                                    background: 'white',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: '#475569',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                }}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div style={{
                        padding: '12px 16px',
                        background: 'white',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexShrink: 0,
                    }}>
                        <button
                            onClick={handleMic}
                            style={{
                                width: '40px', height: '40px',
                                borderRadius: '12px',
                                border: 'none',
                                background: isListening ? '#ef4444' : '#f1f5f9',
                                color: isListening ? 'white' : '#64748b',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                                transition: 'all 0.2s',
                            }}
                            title={isListening ? 'Stop Listening' : 'Start Voice Command'}
                        >
                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isListening ? 'Listening...' : 'Type a command...'}
                            style={{
                                flex: 1,
                                height: '40px',
                                padding: '0 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                background: '#f8fafc',
                                fontSize: '13px',
                                outline: 'none',
                                color: '#1e293b',
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            style={{
                                width: '40px', height: '40px',
                                borderRadius: '12px',
                                border: 'none',
                                background: inputValue.trim() ? 'linear-gradient(135deg, #2563eb, #4f46e5)' : '#f1f5f9',
                                color: inputValue.trim() ? 'white' : '#cbd5e1',
                                cursor: inputValue.trim() ? 'pointer' : 'default',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                                transition: 'all 0.2s',
                            }}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* ── Floating Toggle Button ─────────────────────────────── */}
            <div style={{ position: 'relative' }}>

                {/* Tooltip — shown when closed */}
                {!isOpen && (
                    <div style={{
                        position: 'absolute',
                        bottom: 'calc(100% + 12px)',
                        right: 0,
                        background: '#1e1b4b',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.03em',
                        padding: '5px 11px',
                        borderRadius: '8px',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
                        pointerEvents: 'none',
                        animation: 'tooltipFade 0.2s ease-out',
                        opacity: 0,
                    }}
                        className="erp-tooltip"
                    >
                        Ask ERP Assistant
                        {/* Arrow */}
                        <div style={{
                            position: 'absolute',
                            bottom: '-5px',
                            right: '20px',
                            width: '10px',
                            height: '10px',
                            background: '#1e1b4b',
                            transform: 'rotate(45deg)',
                            borderRadius: '2px',
                        }} />
                    </div>
                )}

                {/* Outer glow ring */}
                {!isOpen && (
                    <div style={{
                        position: 'absolute',
                        inset: '-6px',
                        borderRadius: '50%',
                        background: 'conic-gradient(from 0deg, #4f46e5, #8b5cf6, #6366f1, #4f46e5)',
                        opacity: 0.35,
                        animation: 'glowSpin 3s linear infinite',
                        filter: 'blur(4px)',
                        zIndex: -1,
                    }} />
                )}

                {/* Main Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="erp-fab"
                    style={{
                        width: '62px',
                        height: '62px',
                        borderRadius: '50%',
                        border: 'none',
                        background: isOpen
                            ? 'linear-gradient(135deg, #1e1b4b, #312e81)'
                            : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isOpen
                            ? '0 8px 24px rgba(30,27,75,0.5)'
                            : '0 8px 30px rgba(99,102,241,0.55), 0 0 0 0 rgba(99,102,241,0.4)',
                        position: 'relative',
                        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                        animation: isOpen ? 'none' : 'floatBob 3s ease-in-out infinite',
                    }}
                    aria-label="Toggle ERP Assistant"
                >
                    {/* AI Spark/Robot Icon */}
                    {isOpen ? (
                        <X size={26} strokeWidth={2.5} />
                    ) : (
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Robot head */}
                            <rect x="7" y="9" width="14" height="11" rx="3" fill="white" fillOpacity="0.95" />
                            {/* Eyes */}
                            <circle cx="11" cy="14" r="1.5" fill="#6366f1" />
                            <circle cx="17" cy="14" r="1.5" fill="#6366f1" />
                            {/* Mouth */}
                            <rect x="10.5" y="17" width="7" height="1.5" rx="0.75" fill="#6366f1" fillOpacity="0.7" />
                            {/* Antenna */}
                            <line x1="14" y1="9" x2="14" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="14" cy="5" r="1.5" fill="white" />
                            {/* Ears */}
                            <rect x="4.5" y="12" width="2.5" height="5" rx="1.25" fill="white" fillOpacity="0.8" />
                            <rect x="21" y="12" width="2.5" height="5" rx="1.25" fill="white" fillOpacity="0.8" />
                            {/* Spark top-right */}
                            <path d="M22 4L22.8 6.2L25 7L22.8 7.8L22 10L21.2 7.8L19 7L21.2 6.2Z" fill="white" fillOpacity="0.9" />
                        </svg>
                    )}

                    {/* Notification Badge */}
                    {!isOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '-3px',
                            right: '-3px',
                            width: '19px',
                            height: '19px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ef4444, #f97316)',
                            border: '2.5px solid white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '9px',
                            fontWeight: 800,
                            color: 'white',
                            boxShadow: '0 2px 6px rgba(239,68,68,0.5)',
                        }}>
                            1
                        </div>
                    )}
                </button>
            </div>

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(12px) scale(0.95); }
                    to   { opacity: 1; transform: translateY(0)   scale(1);    }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50%      { opacity: 0.4; }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                /* Gentle up-down float */
                @keyframes floatBob {
                    0%, 100% { transform: translateY(0);   }
                    50%      { transform: translateY(-6px); }
                }
                /* Spinning glow ring */
                @keyframes glowSpin {
                    to { transform: rotate(360deg); }
                }
                /* Tooltip fade-in */
                @keyframes tooltipFade {
                    from { opacity: 0; transform: translateY(4px); }
                    to   { opacity: 1; transform: translateY(0);   }
                }
                /* Scale up on hover */
                .erp-fab:hover {
                    transform: scale(1.12) !important;
                    box-shadow: 0 12px 40px rgba(99,102,241,0.65), 0 0 0 6px rgba(99,102,241,0.15) !important;
                    animation: none !important;
                }
                /* Show tooltip on hover */
                .erp-fab:hover ~ * .erp-tooltip,
                div:hover > .erp-tooltip {
                    opacity: 1 !important;
                    animation: tooltipFade 0.2s ease-out forwards !important;
                }
                /* Hover sibling tooltip reveal */
                .erp-fab:hover + .erp-tooltip {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
}
