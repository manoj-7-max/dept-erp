const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcryptjs');

const ATLAS_URI = 'mongodb+srv://admin:Manoj%40007@erp.tando3f.mongodb.net/university_erp?appName=erp';

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    registerNumber: { type: String, unique: true, sparse: true },
    regNo: { type: String, unique: true, sparse: true },
    department: { type: String },
    dept: { type: String },
    year: { type: Number },
    section: { type: String },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    role: { type: String, default: 'student' },
}, { strict: false });

const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

async function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const rows = [];
        let headers = null;

        fs.createReadStream(filePath)
            .pipe(csv({ skipLines: 11 }))
            .on('headers', (h) => {
                headers = h.map(x => x.trim().replace(/^\uFEFF/, ''));
            })
            .on('data', (row) => {
                const cleanRow = {};
                Object.keys(row).forEach(k => {
                    cleanRow[k.trim().replace(/^\uFEFF/, '')] = (row[k] || '').trim();
                });
                rows.push(cleanRow);
            })
            .on('end', () => resolve(rows))
            .on('error', reject);
    });
}

async function main() {
    const csvFile = process.argv[2];
    const section = process.argv[3] || 'A';

    if (!csvFile || !fs.existsSync(csvFile)) {
        console.error('Usage: node push_to_atlas.js <csv_file> <section>');
        process.exit(1);
    }

    console.log('\n🌐 Connecting to MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connected to Atlas!\n');

    const defaultPassword = await bcrypt.hash('student123', 10);
    const rows = await parseCSV(csvFile);
    console.log(`📋 Parsed ${rows.length} rows from CSV`);

    let regNoKey = null;
    let nameKey = null;

    if (rows.length > 0) {
        const keys = Object.keys(rows[0]);
        console.log('CSV Headers found:', keys.join(', '));

        // Section A: has "Reg No" for number, "NAME" for name
        // Section B: has "Reg No" for number, "RegNo" for name (confusingly named)
        const hasRegNo = keys.some(k => k.trim() === 'Reg No');
        const hasRegNoAlt = keys.some(k => k.trim() === 'RegNo');
        const hasName = keys.some(k => k.trim() === 'NAME');

        regNoKey = keys.find(k => k.trim() === 'Reg No');
        if (hasName) {
            nameKey = keys.find(k => k.trim() === 'NAME');
        } else if (hasRegNoAlt) {
            // Section B format: RegNo column actually contains the name
            nameKey = keys.find(k => k.trim() === 'RegNo');
        }
        console.log(`RegNo key: "${regNoKey}", Name key: "${nameKey}"`);
    }

    const ops = [];
    let skipped = 0;

    for (const row of rows) {
        const regNo = regNoKey ? row[regNoKey] : '';
        const name = nameKey ? row[nameKey] : '';

        if (!regNo || !name || regNo.length < 5) {
            skipped++;
            continue;
        }

        ops.push({
            updateOne: {
                filter: { regNo },
                update: {
                    $setOnInsert: {
                        name,
                        regNo,
                        registerNumber: regNo,
                        email: `${regNo}@student.college.edu`,
                        dept: 'CSE',
                        department: 'CSE',
                        year: 3,
                        section: `CSE_3_${section}`,
                        password: defaultPassword,
                        role: 'student',
                    }
                },
                upsert: true,
            }
        });
    }

    console.log(`\n⚡ Upserting ${ops.length} students to Atlas... (${skipped} rows skipped)`);

    if (ops.length > 0) {
        const result = await Student.bulkWrite(ops, { ordered: false });
        console.log(`✅ Done! Inserted: ${result.upsertedCount}, Already existed: ${result.matchedCount}`);
    } else {
        console.log('⚠️  No valid student records found to insert.');
    }

    await mongoose.disconnect();
    console.log('\n🎉 Atlas database updated successfully!');
}

main().catch(e => { console.error('❌ Error:', e.message); process.exit(1); });
