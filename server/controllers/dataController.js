const fs = require('fs');
const csv = require('csv-parser');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');

exports.importCsv = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileName = req.file.originalname;
        let sectionMapping = 'Unknown';
        if (fileName.includes('CSE_3_A') || fileName.includes('Section A') || req.body.section === 'A') {
            sectionMapping = 'CSE_3_A';
        } else if (fileName.includes('CSE_3_B') || fileName.includes('Section B') || req.body.section === 'B') {
            sectionMapping = 'CSE_3_B';
        }

        const results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    let studentBulkOps = [];
                    let attendanceBulkOps = [];

                    for (const row of results) {
                        const regNo = (row['Register Number'] || row['regNo'] || row['RegisterNumber'] || '').trim();
                        const name = (row['Student Name'] || row['name'] || row['StudentName'] || '').trim();
                        const dateRaw = row['Date'] || row['date'] || new Date();
                        const subject = (row['Subject'] || row['subject'] || '').trim();
                        const status = (row['Status'] || row['status'] || 'Present').trim();
                        
                        const year = 3; 
                        const dept = 'CSE';

                        if (!regNo) continue;

                        studentBulkOps.push({
                            updateOne: {
                                filter: { regNo },
                                update: {
                                    $set: { name, section: sectionMapping, dept, year },
                                    $setOnInsert: { registerNumber: regNo }
                                },
                                upsert: true
                            }
                        });
                        
                        let normalizedStatus = status.toLowerCase();
                        if (normalizedStatus.includes('absent') || normalizedStatus === 'a') {
                            normalizedStatus = 'Absent';
                        } else {
                            normalizedStatus = 'Present';
                        }

                        if (subject || row['Date'] || row['date']) {
                            attendanceBulkOps.push({
                                insertOne: {
                                    document: {
                                        studentId: null, // Will update via aggregate manually later if needed
                                        regNo,
                                        date: new Date(dateRaw),
                                        subject: subject || 'General',
                                        subjectCode: subject || 'GEN',
                                        subjectName: subject || 'General',
                                        status: normalizedStatus,
                                        faculty: 'Unknown Faculty',
                                        section: sectionMapping,
                                        totalClasses: 1,
                                        classesAttended: normalizedStatus === 'Present' ? 1 : 0
                                    }
                                }
                            });
                        }
                    }

                    if (studentBulkOps.length > 0) {
                        await Student.bulkWrite(studentBulkOps, { ordered: false });
                    }
                    if (attendanceBulkOps.length > 0) {
                        await Attendance.bulkWrite(attendanceBulkOps, { ordered: false });
                    }

                    fs.unlinkSync(req.file.path);
                    res.status(200).json({ 
                        message: 'CSV imported successfully', 
                        studentsProcessed: studentBulkOps.length,
                        attendanceRecords: attendanceBulkOps.length,
                        section: sectionMapping
                    });
                } catch (dbErr) {
                    console.error('Import Error:', dbErr);
                    res.status(500).json({ error: 'Database error during import', details: dbErr.message });
                }
            });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStudents = async (req, res) => {
    try {
        const { section } = req.query;
        let query = {};
        if (section) {
            query.section = section === 'A' ? 'CSE_3_A' : section === 'B' ? 'CSE_3_B' : section;
        }

        const students = await Student.find(query);
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAttendance = async (req, res) => {
    try {
        const { section } = req.query;
        let query = {};
        if (section) {
            query.section = section === 'A' ? 'CSE_3_A' : section === 'B' ? 'CSE_3_B' : section;
        }

        const attendanceRecords = await Attendance.find(query).sort({ date: -1 });
        res.status(200).json(attendanceRecords);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getHodAnalytics = async (req, res) => {
    try {
        // 1. Attendance %
        const allAttendance = await Attendance.find({});
        let totalRecords = allAttendance.length;
        let presentCount = allAttendance.filter(a => a.status === 'Present').length;
        const overallAttendancePercent = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(2) : 0;

        // 2. Section comparison (A vs B)
        const sectionA_records = allAttendance.filter(a => a.section === 'CSE_3_A');
        const sectionB_records = allAttendance.filter(a => a.section === 'CSE_3_B');
        
        let secA_present = sectionA_records.filter(a => a.status === 'Present').length;
        let secB_present = sectionB_records.filter(a => a.status === 'Present').length;
        
        const secA_percent = sectionA_records.length > 0 ? ((secA_present / sectionA_records.length) * 100).toFixed(2) : 0;
        const secB_percent = sectionB_records.length > 0 ? ((secB_present / sectionB_records.length) * 100).toFixed(2) : 0;

        // 3. Low attendance students (< 75%)
        const attendanceByStudent = {};
        allAttendance.forEach(a => {
            if (a.regNo) {
                if (!attendanceByStudent[a.regNo]) {
                    attendanceByStudent[a.regNo] = { total: 0, present: 0 };
                }
                attendanceByStudent[a.regNo].total += 1;
                if (a.status === 'Present') attendanceByStudent[a.regNo].present += 1;
            }
        });

        const lowAttendanceStudents = [];
        for (const [regNo, stats] of Object.entries(attendanceByStudent)) {
            const percent = (stats.present / stats.total) * 100;
            if (percent < 75) {
                const studentDoc = await Student.findOne({ regNo });
                lowAttendanceStudents.push({
                    regNo,
                    name: studentDoc ? studentDoc.name : 'Unknown',
                    section: studentDoc ? studentDoc.section : 'Unknown',
                    attendancePercent: percent.toFixed(2)
                });
            }
        }

        // 4. Faculty performance (Mock or derived from existing system data)
        const facultyPerformance = [
            { facultyName: 'K. Vanishree', rating: 4.8, classesTaken: 45 },
            { facultyName: 'Chitralekha', rating: 4.6, classesTaken: 42 },
            { facultyName: 'G. Vinitha', rating: 4.7, classesTaken: 48 },
            { facultyName: 'Alagu Manohar', rating: 4.9, classesTaken: 50 },
        ];

        res.status(200).json({
            overallAttendancePercent,
            sectionComparison: {
                CSE_3_A: secA_percent,
                CSE_3_B: secB_percent
            },
            lowAttendanceStudents,
            facultyPerformance
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
