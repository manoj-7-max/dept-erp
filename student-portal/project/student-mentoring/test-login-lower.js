const axios = require('axios');

async function testLogin() {
    try {
        console.log('Testing with lowercase register number...');
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            registerNumber: 'cs2023001',
            password: 'password123'
        });
        console.log('Login successful:', response.data);
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
    }
}

testLogin();
