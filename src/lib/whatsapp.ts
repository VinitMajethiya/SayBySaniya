export const DEFAULT_WHATSAPP_LINK = 'https://wa.me/message/2VRSIVFSGRF7M1';

/**
 * Builds a direct chat/order link to WhatsApp.
 * Supports WhatsApp Business message link (https://wa.me/message/2VRSIVFSGRF7M1),
 * custom overrides, or phone numbers with optional prefilled message text.
 */
export const buildWhatsAppLink = (message?: string, customDestination?: string): string => {
  const raw =
    customDestination?.trim() ||
    import.meta.env?.VITE_WHATSAPP_URL ||
    import.meta.env?.VITE_WHATSAPP_NUMBER ||
    DEFAULT_WHATSAPP_LINK;

  let base = DEFAULT_WHATSAPP_LINK;

  // Filter out dummy/stale fallback numbers or anything containing 999999
  if (!raw || raw.includes('999999') || raw.includes('6362044074')) {
    base = DEFAULT_WHATSAPP_LINK;
  } else if (raw.startsWith('http://') || raw.startsWith('https://')) {
    // Strip query parameters and trailing slashes from base URL
    base = raw.split('?')[0].replace(/\/+$/, '');
  } else if (raw.includes('wa.me/')) {
    const cleanUrl = raw.split('?')[0].replace(/\/+$/, '');
    base = `https://${cleanUrl.replace(/^https?:\/\//, '')}`;
  } else {
    // Pure phone number
    const cleanDigits = raw.replace(/\D/g, '');
    base = cleanDigits ? `https://wa.me/${cleanDigits}` : DEFAULT_WHATSAPP_LINK;
  }

  if (message && message.trim()) {
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}text=${encodeURIComponent(message)}`;
  }

  return base;
};

export const getWhatsAppNumber = (): string => {
  return DEFAULT_WHATSAPP_LINK;
};

export const createWhatsAppOrderLink = (params: {
  items: Array<{ name: string; quantity: number; price: number }>;
  totalPaise?: number;
  giftNote?: string;
}): string => {
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

  return buildWhatsAppLink(message);
};

export const createSingleProductWhatsAppLink = (productName: string, quantity = 1): string => {
  const message = `Hi Saniya! I would like to order: ${productName} (Qty: ${quantity}). Could you please share the current availability and order details? ♥`;
  return buildWhatsAppLink(message);
};
