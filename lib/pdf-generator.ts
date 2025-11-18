import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface ShipmentData {
  code: string;
  customerName: string;
  customerEmail: string;
  origin: string;
  destination: string;
  serviceType: string;
  status: string;
  paymentStatus: string;
  price: number;
  weight: number;
  packageType: string;
  containerContents: string;
  bookingDate: Date | string;
  estimatedDelivery?: Date | string | null;
}

export function generateInvoicePDF(shipment: ShipmentData) {
  const doc = new jsPDF();
  
  // Company header
  doc.setFontSize(20);
  doc.setTextColor(220, 38, 38);
  doc.text('ASIAN SHIPPING THAI', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('International Freight & Logistics', 105, 27, { align: 'center' });
  doc.text('www.asianshippingthai.com', 105, 32, { align: 'center' });
  
  // Invoice title
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text('INVOICE', 14, 50);
  
  // Invoice details
  doc.setFontSize(10);
  doc.text(`Invoice No: INV-${shipment.code}`, 14, 60);
  doc.text(`Date: ${format(new Date(), 'MMM dd, yyyy')}`, 14, 67);
  doc.text(`Tracking: ${shipment.code}`, 14, 74);
  
  // Bill to section
  doc.setFontSize(12);
  doc.text('Bill To:', 14, 90);
  doc.setFontSize(10);
  doc.text(shipment.customerName, 14, 97);
  doc.text(shipment.customerEmail, 14, 104);
  
  // Shipment details table
  autoTable(doc, {
    startY: 120,
    head: [['Description', 'Details']],
    body: [
      ['Service Type', shipment.serviceType.toUpperCase()],
      ['Origin', shipment.origin],
      ['Destination', shipment.destination],
      ['Weight', `${shipment.weight} kg`],
      ['Package Type', shipment.packageType],
      ['Contents', shipment.containerContents],
      ['Booking Date', format(new Date(shipment.bookingDate), 'MMM dd, yyyy')],
      ['Est. Delivery', shipment.estimatedDelivery 
        ? format(new Date(shipment.estimatedDelivery), 'MMM dd, yyyy') 
        : 'TBD'],
    ],
    theme: 'striped',
    headStyles: { fillColor: [220, 38, 38] },
  });

  // Price breakdown
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  autoTable(doc, {
    startY: finalY,
    head: [['Item', 'Amount']],
    body: [
      ['Freight Charges', `$${shipment.price.toFixed(2)}`],
      ['Tax (0%)', '$0.00'],
      ['Total', `$${shipment.price.toFixed(2)}`],
    ],
    theme: 'plain',
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    bodyStyles: { fontSize: 11 },
    foot: [[{ 
      content: `Total Amount: $${shipment.price.toFixed(2)}`, 
      colSpan: 2,
      styles: { fontStyle: 'bold', fontSize: 14, fillColor: [220, 38, 38], textColor: [255, 255, 255] }
    }]],
  });

  // Payment status
  const paymentY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.setTextColor(shipment.paymentStatus === 'Paid' ? 0 : 220);
  doc.text(`Payment Status: ${shipment.paymentStatus}`, 14, paymentY);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text('Thank you for your business!', 105, 280, { align: 'center' });
  doc.text('For inquiries, contact support@asianshippingthai.com', 105, 285, { align: 'center' });
  
  return doc;
}

export function generatePackingListPDF(shipment: ShipmentData) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(220, 38, 38);
  doc.text('PACKING LIST', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('ASIAN SHIPPING THAI', 105, 27, { align: 'center' });
  
  // Document details
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(`Document No: PL-${shipment.code}`, 14, 45);
  doc.text(`Date: ${format(new Date(), 'MMM dd, yyyy')}`, 14, 52);
  
  // Shipper and Consignee
  doc.setFontSize(11);
  doc.text('Shipper:', 14, 70);
  doc.setFontSize(10);
  doc.text(shipment.customerName, 14, 77);
  doc.text(shipment.origin, 14, 84);
  
  doc.setFontSize(11);
  doc.text('Consignee:', 120, 70);
  doc.setFontSize(10);
  doc.text(shipment.destination, 120, 77);
  
  // Shipment details
  autoTable(doc, {
    startY: 100,
    head: [['Field', 'Value']],
    body: [
      ['Tracking Number', shipment.code],
      ['Service', shipment.serviceType.toUpperCase()],
      ['Package Type', shipment.packageType],
      ['Total Weight', `${shipment.weight} kg`],
      ['Contents Description', shipment.containerContents],
    ],
    theme: 'striped',
    headStyles: { fillColor: [220, 38, 38] },
  });
  
  // Declaration
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('I hereby declare that the information provided is correct and complete.', 14, finalY);
  
  doc.setFontSize(10);
  doc.text('_________________________', 14, finalY + 30);
  doc.text('Signature', 14, finalY + 37);
  
  return doc;
}

export function downloadPDF(doc: jsPDF, filename: string) {
  doc.save(filename);
}
