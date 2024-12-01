import { readData, writeData } from '../models/dataModel.js';
import fs from 'fs';
import path from 'path';

const gpsFilePath = path.join(process.cwd(), 'data', 'gpsData.json');

// Handle index.html?count="..."
export const updateCountFromQuery = (req, res) => {
    const { count } = req.query;
  
    // Debug: Log received query parameter
    console.log(`[DEBUG] Received count parameter: ${count}`);
  
    // Validate count parameter
    if (!count || !/^[01]{8}$/.test(count)) {
      console.error('[ERROR] Invalid count parameter.');
      return res.status(400).send('Invalid count parameter. Must be exactly 8 digits (0 or 1).');
    }
  
    try {
      const data = readData();
      console.log('[DEBUG] Current database content:', data);
  
      // Update statuses
      Object.keys(data).forEach((key, index) => {
        data[key].status = parseInt(count[index], 10);
      });
  
      writeData(data);
      console.log('[DEBUG] Updated database content:', data);
  
      // Serve the file
      res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
    } catch (error) {
      console.error('[ERROR] Failed to update count:', error);
      res.status(500).send('Failed to update count.');
    }
  };
  
export const updateGPSFromQuery = (req, res) => {
    const { long, latt } = req.query;
  
    // Debug: Log received query parameters
    console.log(`[DEBUG] Received GPS parameters: longitude=${long}, latitude=${latt}`);
  
    if (!long || !latt || isNaN(long) || isNaN(latt)) {
      console.error('[ERROR] Invalid longitude or latitude parameters.');
      return res.status(400).send('Invalid longitude or latitude parameters.');
    }
  
    try {
      const gpsFilePath = path.join(process.cwd(), 'data', 'gpsData.json');
      const newEntry = {
        latitude: parseFloat(latt),
        longitude: parseFloat(long),
        timestamp: new Date().toISOString()
      };
  
      fs.writeFileSync(gpsFilePath, JSON.stringify([newEntry], null, 2), 'utf-8');
      console.log('[DEBUG] Successfully updated GPS data:', newEntry);
  
      res.sendFile(path.join(process.cwd(), 'public', 'map.html'));
    } catch (error) {
      console.error('[ERROR] Failed to update GPS coordinates:', error);
      res.status(500).send('Failed to update GPS coordinates.');
    }
  };
  