export const getWhatsAppNumber = (): string => {
  return import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';
};

export const createWhatsAppOrderLink = (params: {
  items: Array<{ name: string; quantity: number; price: number }>;
  totalPaise?: number;
  giftNote?: string;
}): string => {
  const number = getWhatsAppNumber();
  const lines = params.items.map(
    (item) =>
      `• ${item.name} x${item.quantity} — ${
        item.price > 0
          ? `₹${((item.price * item.quantity) / 100).toFixed(0)}`
          : '₹[TBD]'
      }`
  );

  const totalStr =
    params.totalPaise && params.totalPaise > 0
      ? `₹${(params.totalPaise / 100).toFixed(0)}`
      : '₹[TBD]';

  const message = `Hi Saniya! I'd like to order from Say By Saniya:\n${lines.join(
    '\n'
  )}\n\nSubtotal: ${totalStr}${
    params.giftNote ? `\nGift Note: ${params.giftNote}` : ''
  }\n\nName:\nPhone:\nDelivery Address:`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

export const createSingleProductWhatsAppLink = (productName: string, quantity = 1): string => {
  const number = getWhatsAppNumber();
  const message = `Hi Saniya! I would like to order: ${productName} (Qty: ${quantity}). Could you please share the current availability and order details? ♥`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
