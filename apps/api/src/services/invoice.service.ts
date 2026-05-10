import prisma from '../config/prisma';

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

export async function exportInvoice(tripId: string, userId: string) {
  const trip = await verifyTripOwner(tripId, userId);
  const invoice = await getInvoice(tripId, userId);
  // Return structured data for PDF generation (pdfkit integration point)
  return { trip, invoice, exported: true };
}
