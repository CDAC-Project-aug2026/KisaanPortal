import jsPDF from "jspdf";

/**
 * Generates a downloadable PDF invoice for a booking.
 * Works entirely on the frontend — no backend call involved.
 *
 * @param {Object} data
 * @param {string} data.invoiceNumber
 * @param {string} data.dateTime
 * @param {string} data.customerName
 * @param {string} data.customerEmail
 * @param {string} data.userId
 * @param {string} data.equipmentName
 * @param {string} data.location
 * @param {string} data.startDate
 * @param {string} data.endDate
 * @param {number} data.rentalDays
 * @param {Object|null} data.breakdown  // { basePrice, discount, gst, membershipType, membershipDiscount, couponCode, couponDiscount }
 * @param {number} data.finalAmount
 * @param {string} data.paymentMethod
 * @param {string} data.transactionId
 * @param {string} data.status
 */
export function downloadInvoicePDF(data) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;
  let y = 50;

  // Header band
  doc.setFillColor(21, 128, 61); // green-700
  doc.rect(0, 0, pageWidth, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("🚜 KisaanPortal", marginX, 45);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Equipment Rental Invoice / Payment Receipt", marginX, 65);

  doc.setFontSize(10);
  doc.text(`Invoice No: ${data.invoiceNumber}`, pageWidth - marginX, 40, { align: "right" });
  doc.text(`Date: ${data.dateTime}`, pageWidth - marginX, 55, { align: "right" });

  y = 130;
  doc.setTextColor(30, 30, 30);

  // Customer + Equipment block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Billed To", marginX, y);
  doc.text("Equipment Booked", pageWidth / 2 + 10, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  y += 18;
  doc.text(`Name: ${data.customerName}`, marginX, y);
  doc.text(`${data.equipmentName}`, pageWidth / 2 + 10, y);
  y += 16;
  doc.text(`Email: ${data.customerEmail}`, marginX, y);
  doc.text(`Location: ${data.location}`, pageWidth / 2 + 10, y);
  y += 16;
  doc.text(`User ID: #${data.userId}`, marginX, y);
  doc.text(`Rental: ${data.startDate} to ${data.endDate}`, pageWidth / 2 + 10, y);
  y += 16;
  doc.text(`Duration: ${data.rentalDays} day(s)`, pageWidth / 2 + 10, y);

  y += 35;
  doc.setDrawColor(200, 200, 200);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 30;

  // Pricing table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Price Breakdown", marginX, y);
  y += 20;

  const rowHeight = 22;
  const tableRows = [];

  if (data.breakdown) {
    const b = data.breakdown;
    tableRows.push(["Base Price", `₹${b.basePrice}`]);
    if (b.discount > 0) {
      tableRows.push(["Rental Discount", `- ₹${Number(b.discount).toFixed(2)}`]);
    }
    tableRows.push(["GST", `₹${b.gst}`]);
    if (b.membershipType) {
      tableRows.push([`Membership (${b.membershipType})`, `- ₹${b.membershipDiscount || 0}`]);
    }
    if (b.couponCode) {
      tableRows.push([`Coupon (${b.couponCode})`, `- ₹${b.couponDiscount || 0}`]);
    }
  } else {
    tableRows.push(["Amount Paid", `₹${data.finalAmount}`]);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);

  // header row
  doc.setFillColor(240, 248, 240);
  doc.rect(marginX, y - 14, pageWidth - marginX * 2, rowHeight, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Description", marginX + 8, y);
  doc.text("Amount", pageWidth - marginX - 8, y, { align: "right" });
  y += rowHeight;

  doc.setFont("helvetica", "normal");
  tableRows.forEach(([label, value], idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(marginX, y - 14, pageWidth - marginX * 2, rowHeight, "F");
    }
    doc.text(label, marginX + 8, y);
    doc.text(value, pageWidth - marginX - 8, y, { align: "right" });
    y += rowHeight;
  });

  y += 8;
  doc.setDrawColor(21, 128, 61);
  doc.setLineWidth(1.2);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 26;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(21, 128, 61);
  doc.text("Total Paid", marginX, y);
  doc.text(`₹${data.finalAmount}`, pageWidth - marginX, y, { align: "right" });

  y += 40;
  doc.setTextColor(30, 30, 30);
  doc.setDrawColor(200, 200, 200);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 25;

  // Payment info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Payment Details", marginX, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.text(`Payment Method: ${data.paymentMethod}`, marginX, y);
  y += 16;
  doc.text(`Transaction ID: ${data.transactionId}`, marginX, y);
  y += 16;
  doc.setTextColor(21, 128, 61);
  doc.setFont("helvetica", "bold");
  doc.text(`Status: ${data.status}`, marginX, y);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 60;
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    "Thank you for renting with KisaanPortal. Cancellations are allowed up to 24 hours before the rental start date.",
    marginX,
    footerY,
    { maxWidth: pageWidth - marginX * 2 }
  );
  doc.text(
    "This is a system-generated invoice and does not require a signature.",
    marginX,
    footerY + 16
  );

  doc.save(`${data.invoiceNumber}.pdf`);
}
