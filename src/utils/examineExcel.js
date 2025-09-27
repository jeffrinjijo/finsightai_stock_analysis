const XLSX = require('xlsx');
const path = require('path');

function examineExcel() {
  try {
    const filePath = path.join(__dirname, '../../../dummy_datas.xlsx');
    const workbook = XLSX.readFile(filePath);
    
    console.log('Sheets in the workbook:');
    workbook.SheetNames.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
      
      // Get the worksheet
      const worksheet = workbook.Sheets[name];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Log first 5 rows
      console.log(`First 5 rows of ${name}:`);
      console.log(jsonData.slice(0, 5));
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error examining Excel file:', error);
  }
}

examineExcel();
