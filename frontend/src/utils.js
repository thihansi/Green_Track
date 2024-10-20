import { nanoid } from 'nanoid';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateCollectionId = () => {
  return `COL-${nanoid(8)}`; // Generate an 8-character unique ID
};

// Function to generate an 8-digit numeric Payment ID
export const generatePayId = () => {
  return `PID-${Math.floor(10000000 + Math.random() * 90000000).toString()}`; // Generates an 8-digit number
};

// Function to generate an 8-digit numeric Bill ID
export const generateBillId = () => {
  return `BILL-${Math.floor(10000000 + Math.random() * 90000000).toString()}`; // Generates an 8-digit number
};


export const generateCSVReport = (headers, rows, fileName) => {
    const csvRows = [];
  
    // Add headers
    csvRows.push(headers.join(','));
  
    // Loop over rows and format values for CSV
    rows.forEach(row => {
      csvRows.push(row.join(',')); // Ensure rows are properly formatted
    });
  
    // Create a Blob for the CSV file and trigger the download
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
  
    // Append the download date to the filename
    const date = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    link.setAttribute('download', `${fileName}-${date}.csv`);
  
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

export const generateExcelReport = (headers, rows, fileName) => {
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Style the header row
  const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
  for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: C }); // Header row is 0
    if (!worksheet[cellRef]) continue;
    worksheet[cellRef].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: '228B22' } }, // Greenish header color
      alignment: { horizontal: 'center', vertical: 'center' },
    };
  }

  // Apply styling to alternate rows (shading)
  for (let R = 1; R <= rows.length; ++R) {
    const isEvenRow = R % 2 === 0;
    for (let C = 0; C <= headers.length; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cellRef]) continue;
      worksheet[cellRef].s = {
        fill: { fgColor: { rgb: isEvenRow ? 'F0FFF0' : 'FFFFFF' } }, // Light green for alternate rows
        alignment: { horizontal: 'center', vertical: 'center' },
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Waste Collection Report');

  // Save the workbook with a date in the filename
  const date = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
  XLSX.writeFile(workbook, `${fileName}-${date}.xlsx`);
};

  
  

export const generatePDFReport = (headers, rows, fileName, headingText) => {
    const doc = new jsPDF('landscape'); // Set landscape orientation
    
    // Adding the dynamic heading
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); // Black text
    doc.text(headingText, 14, 22); // Use the headingText parameter here
    
    // Adding date of report generation
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text(`Generated on: ${currentDate}`, 14, 32);
    
    // Define table headers and style to match the example
    doc.autoTable({
      startY: 40,
      head: [headers],
      body: rows,
      theme: 'grid',
      styles: {
        fillColor: [255, 255, 255], // Default white background
        textColor: [0, 0, 0], // Black text
        lineColor: [0, 0, 0], // Black grid lines
      },
      headStyles: {
        fillColor: [34, 139, 34], // Green header color matching the table
        textColor: [255, 255, 255], // White text for the header
        halign: 'center', // Horizontal alignment of text
        fontSize: 12, // Font size for header
      },
      alternateRowStyles: {
        fillColor: [224, 255, 224], // Light green alternate row color
      },
    });
    
    // Save the PDF with a date in the filename
    const date = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    doc.save(`${fileName}-${date}.pdf`);
  };
  