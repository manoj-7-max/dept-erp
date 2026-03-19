const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

// Configuration
const API_BASE_URL = process.env.API_URL || 'http://localhost:5000';
const IMPORT_ENDPOINT = `${API_BASE_URL}/api/data/import-csv`;

async function main() {
    console.log('\n=============================================');
    console.log('🚀 ERP DATA IMPORTER (CSV -> DB)');
    console.log('=============================================\n');

    // 1. Analyze CLI Arguments
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('❌ Error: No file provided.');
        console.log('\n📖 Correct Usage:');
        console.log('   node import-cli.js <path/to/your/file.csv> [section_override]');
        console.log('\nExample:');
        console.log('   node import-cli.js ./CLASS_LOG_CSE_3_A.csv');
        console.log('   node import-cli.js ./attendance.csv A    <-- Forces Section A mapping\n');
        process.exit(1);
    }

    const filePath = path.resolve(args[0]);
    const sectionOverride = args[1];

    // 2. Pre-Flight File Analytics
    console.log(`🔍 Analyzing file: ${filePath}`);
    if (!fs.existsSync(filePath)) {
        console.error('❌ Critical Error: The specified file does not exist on your computer.');
        process.exit(1);
    }

    const fileExt = path.extname(filePath).toLowerCase();
    if (fileExt !== '.csv') {
        console.error(`❌ Critical Error: Only .csv files are supported. You provided a '${fileExt}' file.`);
        process.exit(1);
    }
    
    const fileStats = fs.statSync(filePath);
    console.log(`✅ File located successfully! Size: ${(fileStats.size / 1024).toFixed(2)} KB.`);

    // 3. Prepare Payload (Form/Multipart Mapping)
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    
    if (sectionOverride) {
        console.log(`⚠️ Overriding explicit section assigned from the CLI -> Section ${sectionOverride.toUpperCase()}`);
        form.append('section', sectionOverride.toUpperCase());
    }

    console.log(`\n⏳ Transmitting payload to the Main Server [${IMPORT_ENDPOINT}]... Please wait.`);

    // 4. Execute Injection
    try {
        const response = await axios.post(IMPORT_ENDPOINT, form, {
            headers: {
                ...form.getHeaders()
            },
            maxBodyLength: Infinity // Allow enterprise-scale huge CSV files
        });

        console.log('\n✅ ================= SUCCESS =================');
        console.log(`🏢 Assigned Section: ${response.data.section}`);
        console.log(`🎓 Valid Students Synchronized: ${response.data.studentsProcessed}`);
        console.log(`📊 Valid Attendance Records Linked: ${response.data.attendanceRecords}`);
        console.log(`-----------------------------------------------`);
        console.log('The ERP Analytics engines have automatically re-synchronized this data.\n');

    } catch (error) {
        console.log('\n❌ ================= FAILURE =================');
        if (error.response) {
            console.error(`HTTP Status [${error.response.status}]: Server rejected the payload.`);
            console.error('Database API Response:', error.response.data);
        } else if (error.request) {
            console.error('Network Error: Could not connect to the Backend server.');
            console.error(`Is the Node.js ERP server genuinely running on port 5000?`);
        } else {
            console.error('Node.js Error:', error.message);
        }
        console.log('=============================================\n');
        process.exit(1);
    }
}

main();
