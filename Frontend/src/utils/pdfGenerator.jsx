import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/logo.png';

const generateTransactionPDF = ({ startDate, endDate, selectedCurrency,selectedVoucherType, voucherType, transactions, remitInTotal,remitInCommission,remitInNetTotal,remitOutTotal }) => {
  const doc = new jsPDF();

  // Format the date to only show the date (e.g., 'YYYY-MM-DD')
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD' format
};


  console.log('remit in total:', remitInTotal);
  console.log('remit in net : ', remitInNetTotal);
  console.log ('remit out total :', remitOutTotal);
  console.log('comission total',remitInCommission)
  
  // Add logo (adjust x, y, width, and height as needed)
  const imgWidth = 20; // Adjust as needed
  const imgHeight = 20; // Adjust as needed

  // Add logo to the left side
  doc.addImage(logo, 'PNG', 10, 10, imgWidth, imgHeight);

  // Add title with appropriate font size
  doc.setFontSize(16);
  doc.text('Nepal Rastra Bank', 35, 15);

  doc.setFontSize(12)
  doc.text('Banking Department', 35, 20);
  doc.text('Remittance Section', 35, 25);

  const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
  const textWidth = doc.getTextWidth('Transaction Report'); // Get text width
  const centerX = (pageWidth - textWidth) / 2; // Calculate centered X position

  doc.setFontSize(14);
  doc.text('Transaction Report', centerX, 40);

  // Add filters info with compact spacing
  doc.setFontSize(10);
  doc.text(`Date Range: ${startDate} - ${endDate}`, 14, 50);
  doc.text(`Currency: ${selectedCurrency}`, 14, 55);
  // doc.text(`Voucher Type: ${selectedVoucherType}`, 14, 35);

  // Add transaction table with compact styling
  autoTable(doc, {
    startY: 60,
    head: [
      [
        'SN',
        'Voucher Date	',
        'Currency Name',
        'Voucher Type	',
        'Exchange Rate	',
        'FC Amount',
        'NPR Amount	',
        'Commission',
      ],
    ],
    body: transactions.map((t, index) => [
      index + 1, // Serial Number
      formatDate(t.voucher_date),
      t.currency_name,
      t.transaction_type,
      t.exchange_rate,
      t.fc_amount,
      t.NPR_amount,
      t.commission      
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 7,
      fontStyle: 'bold',
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 10 }, // SN
      1: { cellWidth: 25 }, // Date
      2: { cellWidth: 25 }, // Currency
      3: { cellWidth: 25 }, // Type
      4: { cellWidth: 28 }, // Rate
      5: { cellWidth: 20 }, // FC Amount
      6: { cellWidth: 25 }, // NPR Amount
      7: { cellWidth: 25 }, // Commission
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // Calculate Y position for totals section
  const finalY = doc.lastAutoTable.finalY || 150;

  // Add summary headers
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');

  const summaryStartY = finalY + 10;
  const columnX = {
    label: 14,
    amount: 140, // Adjusted for better alignment
    commission: 180, // Adjusted for better alignment
  };

  // Draw summary headers
  doc.text('Summary', columnX.label, summaryStartY);
  doc.text('NPR Amount', columnX.amount + 25, summaryStartY, { align: 'right' });
  doc.text('Commission', columnX.commission + 10, summaryStartY, { align: 'right' });

  // Draw horizontal line under headers
  doc.setLineWidth(0.2);
  doc.line(columnX.label, summaryStartY + 2, 190, summaryStartY + 2);

  // Function to add summary row
  const addSummaryRow = (label, amount, commission, y) => {
    doc.setFont(undefined, 'normal');
    doc.text(label, columnX.label, y);

    // Ensure amount is a valid number before calling toFixed
    const validAmount = (typeof amount === 'number' && !isNaN(amount)) ? amount : 0.00;
    doc.text(validAmount.toFixed(2), columnX.amount + 25, y, { align: 'right' });

    // Ensure commission is a valid number and format to 2 decimal places
    if (commission !== undefined && commission !== '') {
        const validCommission = (typeof commission === 'number' && !isNaN(commission)) ? commission : 0.00;
        doc.text(validCommission.toFixed(2), columnX.commission + 10, y, { align: 'right' });
    }
};


  // Add summary rows with section separator
  const rowSpacing = 7;
  let currentY = summaryStartY + 8;

  // Remit In section
  addSummaryRow('Remit In Total:', remitInTotal,remitInCommission , currentY);
  currentY += rowSpacing;
  addSummaryRow('Remittance In Net Total:', remitInNetTotal, '', currentY);

  // Add separator between Remit In and Remit Out
  currentY += rowSpacing;
  doc.setLineWidth(0.1);
  doc.setLineDash([2, 2]); // Dotted line
  doc.line(columnX.label, currentY, 190, currentY);
  doc.setLineDash([]); // Reset to solid line

  // Remit Out section
  currentY += rowSpacing;
  addSummaryRow('Remittance Out Total:', remitOutTotal, '', currentY);

  // Draw final horizontal line
  doc.setLineWidth(0.2);
  doc.line(columnX.label, currentY + 2, 190, currentY + 2);

  // Save the PDF
  doc.save('transaction-report.pdf');
};

export default generateTransactionPDF;
