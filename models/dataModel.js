import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'database.json');

// Read data from the JSON file
export const readData = () => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Write data to the JSON file
export const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};
