// quick-test.js
const http = require('http');

console.log('🔍 Testing backend connection...');

const options = {
  hostname: 'localhost',
  port: 10000,
  path: '/api/v1',
  method: 'GET',
  timeout: 3000
};

const req = http.request(options, (res) => {
  console.log(`✅ Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Response:', data.toString());
  });
});

req.on('error', (error) => {
  console.log('❌ Error:', error.message);
  console.log('   Backend is not running or crashed.');
});

req.on('timeout', () => {
  console.log('❌ Timeout: Backend not responding');
  req.destroy();
});

req.end();