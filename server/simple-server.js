const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Basic API endpoints
app.get('/', (req, res) => {
  res.json({ 
    message: 'Mobile Device Comparison Website API',
    status: 'Running on Raspberry Pi!',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Sample devices data
const devices = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    price: 999,
    ram: 8,
    storage: 128
  },
  {
    id: 2,
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 1199,
    ram: 12,
    storage: 256
  }
];

app.get('/api/devices', (req, res) => {
  res.json(devices);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Mobile Device Comparison API running on http://0.0.0.0:${PORT}`);
  console.log(`📱 Access your API at: http://[your-pi-ip]:${PORT}`);
});
EOF
