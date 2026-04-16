import { generateSignedToken, generateQRCodeDataUrl } from './qr';
import { format } from 'date-fns';

export async function generateTicketPDF(ticketData: {
    ticketId: string;
    eventTitle: string;
    eventStartTime: Date;
    eventLocation: string;
    attendeeName: string;
    ticketTypeName: string;
}) {
    const { jsPDF } = await import('jspdf');
    const { ticketId, eventTitle, eventStartTime, eventLocation, attendeeName, ticketTypeName } = ticketData;

    // 1. Create a Master (static) token for the PDF
    const masterToken = generateSignedToken(ticketId, 'MASTER');
    
    // 2. Generate the QR Code Data URL
    const qrDataUrl = await generateQRCodeDataUrl(masterToken);

    // 3. Create PDF (Mobile Wallet Size: 80mm x 150mm)
    const doc = new jsPDF({
        unit: 'mm',
        format: [80, 150]
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Background (Slate-950)
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, width, height, 'F');

    // Header Accent (Red-500)
    doc.setFillColor(239, 68, 68);
    doc.rect(0, 0, width, 15, 'F');

    // Logo Text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('TICKETA', width / 2, 10, { align: 'center' });

    // Event Info Section
    doc.setFontSize(10);
    doc.setTextColor(156, 163, 175); // Gray-400
    doc.text('EVENT PASS', width / 2, 25, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(eventTitle.toUpperCase(), width / 2, 35, { align: 'center', maxWidth: 65 });

    // Divider
    doc.setDrawColor(31, 41, 55); // Slate-800
    doc.line(10, 50, 70, 50);

    // QR Code Section
    // Draw a white background for the QR code to ensure scanability
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, 55, 50, 50, 4, 4, 'F');
    doc.addImage(qrDataUrl, 'PNG', 17.5, 57.5, 45, 45);

    // Attendee Info
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text('GUEST', 15, 115);
    doc.text('TIER', width - 15, 115, { align: 'right' });

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(attendeeName, 15, 122);
    doc.text(ticketTypeName, width - 15, 122, { align: 'right' });

    // Event Metadata
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(format(eventStartTime, 'PPP'), 15, 130);
    doc.text(eventLocation, 15, 135, { maxWidth: 50 });

    // Fine Print: No Refunds
    doc.setFontSize(7);
    doc.setTextColor(75, 85, 99); // Gray-600
    doc.setFont('helvetica', 'italic');
    doc.text('Strictly No Refunds. Entry subject to terms.', width / 2, 145, { align: 'center' });

    // Return as Blob or Data URL
    return doc.output('bloburl');
}
