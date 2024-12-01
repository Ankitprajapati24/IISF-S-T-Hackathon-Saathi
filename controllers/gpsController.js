import fs from 'fs';
import path from 'path';

const gpsFilePath = path.join(process.cwd(), 'data', 'gpsData.json');

// Save GPS coordinates (overwrite existing data)
export const saveCoordinates = (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Invalid GPS coordinates' });
  }

  try {
    const newEntry = { latitude, longitude, timestamp: new Date().toISOString() };
    fs.writeFileSync(gpsFilePath, JSON.stringify([newEntry], null, 2), 'utf-8'); // Overwrite data
    res.json({ message: 'Coordinates saved successfully', coordinates: newEntry });
  } catch (error) {
    res.status(500).json({ message: 'Error saving coordinates', error });
  }
};

// Fetch GPS coordinates
export const getCoordinates = (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(gpsFilePath, 'utf-8')) || [];
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coordinates', error });
  }
};
