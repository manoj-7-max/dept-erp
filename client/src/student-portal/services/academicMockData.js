// ─────────────────────────────────────────────────────────────────────────────
// Shared Academic Mock Data
// Single source of truth for grade logic, subject data, and arrear count.
// Imported by both AcademicRecords.jsx and DashboardHeader.jsx.
// ─────────────────────────────────────────────────────────────────────────────

export const ANNA_GRADE_TABLE = [
    { min: 91, grade: 'O', point: 10 },
    { min: 81, grade: 'A+', point: 9 },
    { min: 71, grade: 'A', point: 8 },
    { min: 61, grade: 'B+', point: 7 },
    { min: 51, grade: 'B', point: 6 },
    { min: 50, grade: 'C', point: 5 },
    { min: 0, grade: 'RA', point: 0 },
];

export const DEFAULT_GRADE_TABLE = [
    { min: 91, grade: 'O', point: 10 },
    { min: 81, grade: 'A+', point: 9 },
    { min: 71, grade: 'A', point: 8 },
    { min: 61, grade: 'B+', point: 7 },
    { min: 51, grade: 'B', point: 6 },
    { min: 40, grade: 'C', point: 5 },
    { min: 0, grade: 'U', point: 0 },
];

export function getGradeInfo(marksScored, maximumMarks, assessmentType = 'Semester Marks') {
    const pct = (marksScored / maximumMarks) * 100;
    const table = assessmentType === 'Semester Marks' ? ANNA_GRADE_TABLE : DEFAULT_GRADE_TABLE;
    for (const row of table) {
        if (pct >= row.min) return row;
    }
    return table[table.length - 1];
}

const subjectPool = {
    1: [
        { subjectCode: 'MA3151', subjectName: 'Matrices and Calculus', credits: 4 },
        { subjectCode: 'PH3151', subjectName: 'Engineering Physics', credits: 4 },
        { subjectCode: 'CY3151', subjectName: 'Engineering Chemistry', credits: 3 },
        { subjectCode: 'GE3151', subjectName: 'Problem Solving & Python', credits: 4 },
        { subjectCode: 'GE3152', subjectName: 'Engineering Graphics', credits: 3 },
        { subjectCode: 'GE3171', subjectName: 'Physics & Chemistry Lab', credits: 2 },
    ],
    2: [
        { subjectCode: 'MA3251', subjectName: 'Statistics and Numerical Methods', credits: 4 },
        { subjectCode: 'PH3256', subjectName: 'Physics for IT', credits: 3 },
        { subjectCode: 'CS3251', subjectName: 'Programming in C', credits: 3 },
        { subjectCode: 'CS3271', subjectName: 'Programming Lab', credits: 2 },
        { subjectCode: 'GE3251', subjectName: 'Engineering Economics', credits: 3 },
        { subjectCode: 'GE3271', subjectName: 'Environmental Science', credits: 2 },
    ],
    3: [
        { subjectCode: 'CS3301', subjectName: 'Data Structures', credits: 4 },
        { subjectCode: 'CS3302', subjectName: 'Digital Principles & System Design', credits: 3 },
        { subjectCode: 'CS3391', subjectName: 'Object Oriented Programming', credits: 4 },
        { subjectCode: 'CS3361', subjectName: 'Data Structures Lab', credits: 2 },
        { subjectCode: 'CS3371', subjectName: 'OOP Lab', credits: 2 },
        { subjectCode: 'MA3354', subjectName: 'Discrete Mathematics', credits: 3 },
    ],
    4: [
        { subjectCode: 'CS3452', subjectName: 'Theory of Computation', credits: 3 },
        { subjectCode: 'CS3491', subjectName: 'Artificial Intelligence', credits: 3 },
        { subjectCode: 'CS3492', subjectName: 'Database Management Systems', credits: 4 },
        { subjectCode: 'CS3461', subjectName: 'Full Stack Dev Lab', credits: 2 },
        { subjectCode: 'CS3401', subjectName: 'Algorithms', credits: 4 },
        { subjectCode: 'CS3451', subjectName: 'Introduction to OS', credits: 3 },
    ],
    5: [
        { subjectCode: 'CS3501', subjectName: 'Software Engineering', credits: 3 },
        { subjectCode: 'CS3551', subjectName: 'Distributed Computing', credits: 3 },
        { subjectCode: 'CS3591', subjectName: 'Computer Networks', credits: 4 },
        { subjectCode: 'CS3561', subjectName: 'Networks Lab', credits: 2 },
        { subjectCode: 'CS3571', subjectName: 'AI & ML Lab', credits: 2 },
        { subjectCode: 'AD3491', subjectName: 'Machine Learning', credits: 4 },
    ],
    6: [
        { subjectCode: 'CS3601', subjectName: 'Cryptography & Network Security', credits: 3 },
        { subjectCode: 'CS3691', subjectName: 'Embedded Systems', credits: 3 },
        { subjectCode: 'CB3651', subjectName: 'Cloud Computing', credits: 4 },
        { subjectCode: 'CS3661', subjectName: 'Security Lab', credits: 2 },
        { subjectCode: 'CS3671', subjectName: 'Project Phase I', credits: 2 },
        { subjectCode: 'CS3651', subjectName: 'Compiler Design', credits: 4 },
    ],
    7: [
        { subjectCode: 'CS3701', subjectName: 'Blockchain Technology', credits: 3 },
        { subjectCode: 'CS3791', subjectName: 'Deep Learning', credits: 4 },
        { subjectCode: 'CS3711', subjectName: 'Internet of Things', credits: 3 },
        { subjectCode: 'CS3761', subjectName: 'Deep Learning Lab', credits: 2 },
        { subjectCode: 'CS3771', subjectName: 'Project Phase II', credits: 3 },
        { subjectCode: 'CS3781', subjectName: 'Professional Elective', credits: 3 },
    ],
    8: [
        { subjectCode: 'CS3891', subjectName: 'Final Year Project', credits: 12 },
        { subjectCode: 'CS3851', subjectName: 'Internship', credits: 6 },
        { subjectCode: 'CS3801', subjectName: 'Open Elective IV', credits: 3 },
    ],
};

const marksMap = {
    'Internal Assessment 1': { max: 100, scored: [84, 76, 68, 56, 88, 36, 92, 78, 60, 44, 96, 70, 80, 74, 50, 88, 64, 38, 90, 76, 56, 84, 62, 42] },
    'Internal Assessment 2': { max: 100, scored: [88, 72, 64, 60, 82, 32, 86, 76, 66, 48, 92, 66, 76, 70, 44, 84, 60, 34, 88, 80, 52, 86, 58, 40] },
    'Seminar Marks': { max: 100, scored: [90, 88, 78, 85, 92, 80, 87, 91, 76, 82, 89, 94, 83, 77, 88, 91, 85, 79, 93, 88, 84, 90, 82, 86] },
    'Quiz Marks': { max: 25, scored: [22, 19, 17, 14, 24, 11, 23, 20, 16, 13, 25, 18, 21, 19, 15, 23, 17, 10, 24, 21, 15, 22, 18, 12] },
    'Class Test': { max: 25, scored: [20, 23, 18, 15, 22, 12, 24, 19, 14, 11, 25, 17, 21, 20, 16, 23, 19, 13, 22, 21, 15, 24, 18, 14] },
    'Assignment 1': { max: 100, scored: [85, 92, 78, 88, 90, 75, 84, 89, 72, 81, 95, 86, 79, 83, 76, 91, 87, 74, 94, 82, 77, 93, 80, 88] },
    'Assignment 2': { max: 100, scored: [88, 95, 80, 91, 92, 77, 86, 90, 75, 84, 98, 89, 81, 85, 78, 94, 89, 76, 96, 85, 79, 95, 82, 90] },
};

// Per-semester Semester Marks scores — designed for ascending/fluctuating GPA from 7.0 to 9.5
const semExamScores = {
    1: [75, 68, 72, 65, 78, 82],           // SGPA: ~7.35 (Mostly A and B+)
    2: [82, 75, 78, 32, 85, 65],           // SGPA: ~6.50 (RA in Statistics)
    3: [68, 72, 65, 80, 75, 70],           // SGPA: ~7.15 (Downward Fluctuation)
    4: [85, 78, 82, 75, 88, 72],           // SGPA: ~7.95
    5: [35, 85, 82, 92, 80, 84],           // SGPA: ~7.80 (RA in Software Engineering)
    6: [78, 82, 75, 85, 88, 80],           // SGPA: ~8.15 (Downward Fluctuation)
    7: [92, 88, 95, 85, 91, 89],           // SGPA: ~8.95
    8: [85, 95, 92],                        // SGPA: ~9.43 (Target 9.4)
};

// Build MOCK_RECORDS
export const MOCK_RECORDS = [];
let scoreIdx = 0;
const assessmentKeys = ['Internal Assessment 1', 'Internal Assessment 2', 'Class Test', 'Assignment 1', 'Assignment 2', 'Semester Marks', 'Seminar Marks', 'Quiz Marks'];

[1, 2, 3, 4, 5, 6, 7, 8].forEach(sem => {
    assessmentKeys.forEach(assessment => {
        const subjectsForSem = subjectPool[sem] || [];

        if (assessment === 'Semester Marks') {
            // Use explicit per-semester scores for increasing CGPA
            const semScores = semExamScores[sem];
            const subjects = subjectsForSem.map((s, i) => {
                const ms = semScores[i];
                const info = getGradeInfo(ms, 100, assessment);
                return {
                    subjectCode: s.subjectCode,
                    subjectName: s.subjectName,
                    credits: s.credits,
                    marksScored: ms,
                    maximumMarks: 100,
                    grade: info.grade,
                    gradePoint: info.point,
                };
            });
            MOCK_RECORDS.push({ semester: sem, assessmentType: assessment, subjects });
        } else {
            // Other assessments use the cycling scored array
            const { max, scored } = marksMap[assessment];
            const subjects = subjectsForSem.map(s => {
                const ms = scored[scoreIdx++ % scored.length];
                const info = getGradeInfo(ms, max, assessment);
                return {
                    subjectCode: s.subjectCode,
                    subjectName: s.subjectName,
                    credits: s.credits,
                    marksScored: ms,
                    maximumMarks: max,
                    grade: info.grade,
                    gradePoint: info.point,
                };
            });
            MOCK_RECORDS.push({ semester: sem, assessmentType: assessment, subjects });
        }
    });
});

/**
 * Returns the total number of arrear (grade = 'RA') subjects across all
 * Semester Marks records — the same count shown in AcademicRecords "Arrears" view.
 */
export function computeArrearCount() {
    let count = 0;
    MOCK_RECORDS.forEach(rec => {
        if (rec.assessmentType === 'Semester Marks' && rec.subjects) {
            rec.subjects.forEach(sub => {
                if (sub.grade === 'RA') count++;
            });
        }
    });
    return count;
}
