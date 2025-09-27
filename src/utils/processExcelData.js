const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Function to read and process the Excel file
function processExcelData() {
  try {
    // Path to the Excel file
    const filePath = path.join(__dirname, '../../../dummy_datas.xlsx');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('Excel file not found at:', filePath);
      return null;
    }
    
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Process the data (modify this based on your Excel structure)
    const headers = jsonData[0];
    const rows = jsonData.slice(1);
    
    // Convert to array of objects with headers as keys
    const processedData = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
    
    return processedData;
  } catch (error) {
    console.error('Error processing Excel file:', error);
    return null;
  }
}

// Function to convert processed data to dashboard format
function convertToDashboardFormat(data) {
  // This is a placeholder - modify according to your Excel structure
  // and the format expected by your dashboard
  const dashboardData = {
    // Add your data mapping here
    // Example:
    // keyMetrics: { ... },
    // watchlist: [...],
    // etc.
  };
  
  return dashboardData;
}

// Export the functions
module.exports = {
  processExcelData,
  convertToDashboardFormat
};
