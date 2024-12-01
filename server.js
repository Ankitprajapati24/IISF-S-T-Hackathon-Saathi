import express from 'express';
import bodyParser from 'body-parser';
import { getAllData, updateStatusByKey, updateStatuses } from './controllers/dataController.js';
import { scheduleCronJobs } from './controllers/cronController.js';
import { saveCoordinates, getCoordinates } from './controllers/gpsController.js';
import { updateCountFromQuery, updateGPSFromQuery } from './controllers/queryController.js';

const app = express();

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[DEBUG] Received ${req.method} request for ${req.url}`);
  next();
});

// Middleware for parsing JSON
app.use(bodyParser.json());

// Query parameter routes (must come before static middleware)
app.get('/index.html', updateCountFromQuery);
app.get('/map.html', updateGPSFromQuery);

// Serve static files
app.use(express.static('./public'));

// API routes
app.get('/api/data', getAllData);
app.put('/api/update-statuses', updateStatuses);
app.put('/api/data/:key', updateStatusByKey);
app.post('/api/gps', saveCoordinates);
app.get('/api/gps', getCoordinates);

// Schedule cron jobs
scheduleCronJobs();

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
