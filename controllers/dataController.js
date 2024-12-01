import { readData, writeData } from '../models/dataModel.js';

// Get all data
export const getAllData = (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
};
// Update all statuses based on input
export const updateStatuses = (req, res) => {
    const { statuses } = req.body;
  
    try {
      // Validate the input
      if (!Array.isArray(statuses) || statuses.length !== 8 || statuses.some(s => s !== 0 && s !== 1)) {
        return res.status(400).json({ message: 'Invalid statuses. Must be an array of 8 digits (0 or 1).' });
      }
  
      const data = readData();
  
      // Update statuses in the JSON file
      Object.keys(data).forEach((key, index) => {
        data[key].status = statuses[index];
      });
  
      writeData(data);
  
      res.json({ message: 'Statuses updated successfully', statuses });
    } catch (error) {
      res.status(500).json({ message: 'Error updating statuses', error });
    }
  };
  
// Update a specific status by key
export const updateStatusByKey = (req, res) => {
  const { key } = req.params;
  const { status } = req.body;

  try {
    const data = readData();

    if (!data[key]) {
      return res.status(404).json({ message: 'Key not found' });
    }

    if (typeof status !== 'number' || (status !== 0 && status !== 1)) {
      return res.status(400).json({ message: 'Invalid status. Must be 0 or 1.' });
    }

    // Update the status
    data[key].status = status;
    writeData(data);

    res.json({ message: 'Status updated successfully', key, status });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error });
  }
};
