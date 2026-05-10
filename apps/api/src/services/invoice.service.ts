import prisma from '../config/prisma';
import PDFDocument from 'pdfkit';

async function verifyTripOwner(tripId: string, userId: string) {
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId } });
  if (!trip) throw { status: 404, message: 'Trip not found' };
  return trip;
}

export async function getInvoice(tripId: string, userId: string) {
  await verifyTripOwner(tripId, userId);
  let invoice = await prisma.invoice.findUnique({
    where: { tripId },
    include: { items: { orderBy: { orderIndex: 'asc' } } },
  });

  if (!invoice) {
    // Auto-create empty invoice
    invoice = await prisma.invoice.create({
      data: { tripId, subtotal: 0, grandTotal: 0 },
      include: { items: { orderBy: { orderIndex: 'asc' } } },
    });
  }

  return invoice;
}

export async function updateInvoice(tripId: string, userId: string, data: {
  paymentStatus?: any;
  subtotal?: number;
  tax?: number;
  grandTotal?: number;
  items?: Array<{
    id?: string;
    category: string;
    description: string;
    quantity?: number;
    unitCost: number;
    amount: number;
    orderIndex?: number;
  }>;
}) {
  await verifyTripOwner(tripId, userId);

  let invoice = await prisma.invoice.findUnique({ where: { tripId } });
  if (!invoice) {
    invoice = await prisma.invoice.create({ data: { tripId, subtotal: 0, grandTotal: 0 } });
  }

  const { items, ...invoiceData } = data;

  await prisma.invoice.update({ where: { id: invoice.id }, data: invoiceData });

  if (items !== undefined) {
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: invoice.id } });
    if (items.length > 0) {
      await prisma.invoiceItem.createMany({
        data: items.map((item, i) => ({
          invoiceId: invoice!.id,
          category: item.category,
          description: item.description,
          quantity: item.quantity ?? 1,
          unitCost: item.unitCost,
          amount: item.amount,
          orderIndex: item.orderIndex ?? i,
        })),
      });
    }
  }

  return prisma.invoice.findUnique({
    where: { id: invoice.id },
    include: { items: { orderBy: { orderIndex: 'asc' } } },
  });
}

export async function exportInvoice(tripId: string, userId: string): Promise<Buffer> {
  const trip = await verifyTripOwner(tripId, userId);
  const invoice = await getInvoice(tripId, userId);

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24).text('INVOICE', { align: 'right' });
      doc.moveDown();
      doc.fontSize(16).text('Traveloop', { align: 'left' });
      doc.fontSize(10).fillColor('gray').text('Your personal travel companion', { align: 'left' });
      doc.moveDown(2);

      // Trip Info
      doc.fillColor('black').fontSize(14).text('Trip Details:');
      doc.fontSize(10).text(`Name: ${trip.name}`);
      if (trip.place) doc.text(`Destination: ${trip.place}`);
      doc.text(`Dates: ${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`);
      doc.text(`Payment Status: ${invoice.paymentStatus}`);
      doc.moveDown(2);

      // Table Header
      const tableTop = doc.y;
      doc.font('Helvetica-Bold');
      doc.text('Item', 50, tableTop);
      doc.text('Qty', 300, tableTop);
      doc.text('Unit Cost', 380, tableTop);
      doc.text('Amount', 480, tableTop);
      
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
      doc.font('Helvetica');

      // Table Rows
      let yPosition = tableTop + 25;
      invoice.items.forEach((item) => {
        doc.text(item.description || item.category, 50, yPosition);
        doc.text(item.quantity.toString(), 300, yPosition);
        doc.text(`$${Number(item.unitCost).toFixed(2)}`, 380, yPosition);
        doc.text(`$${Number(item.amount).toFixed(2)}`, 480, yPosition);
        yPosition += 20;
      });

      doc.moveTo(50, yPosition + 10).lineTo(550, yPosition + 10).stroke();
      yPosition += 20;

      // Totals
      doc.font('Helvetica-Bold');
      doc.text('Subtotal:', 380, yPosition);
      doc.text(`$${Number(invoice.subtotal).toFixed(2)}`, 480, yPosition);
      yPosition += 20;

      if (invoice.tax) {
        doc.text('Tax (10%):', 380, yPosition);
        doc.text(`$${Number(invoice.tax).toFixed(2)}`, 480, yPosition);
        yPosition += 20;
      }

      doc.fontSize(12).text('Grand Total:', 380, yPosition);
      doc.text(`$${Number(invoice.grandTotal).toFixed(2)}`, 480, yPosition);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
