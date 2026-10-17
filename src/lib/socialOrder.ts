import { supabase, isSupabaseConfigured } from './supabase';
import { buildWhatsAppLink, DEFAULT_WHATSAPP_LINK } from './whatsapp';
import type { CartSnapshot, CartSnapshotItem } from '../types/commerce';
import type { Json } from '../types/supabase';

/**
 * Returns a valid WhatsApp destination (URL or phone digits)
 */
export const getCleanWhatsAppNumber = (customNumber?: string): string => {
  const raw = customNumber || import.meta.env?.VITE_WHATSAPP_URL || import.meta.env?.VITE_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_LINK;
  if (raw.includes('wa.me') || raw.startsWith('http')) {
    return raw;
  }
  return raw.replace(/[^0-9]/g, '');
};

/**
 * Extracts a clean Instagram username (e.g. "saylipss.co")
 */
export const getCleanInstagramHandle = (customHandle?: string): string => {
  const raw = customHandle || import.meta.env?.VITE_INSTAGRAM_HANDLE || 'saylipss.co';
  return raw
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .replace(/\/.*$/, '')
    .trim();
};

/**
 * Generates human-friendly prefilled order text for WhatsApp or Instagram chat
 */
export const formatOrderMessage = (params: {
  channel: 'whatsapp' | 'instagram';
  items: CartSnapshotItem[];
  totalPaise: number;
  dealCode?: string | null;
  giftNote?: string;
  customerName?: string;
}): string => {
  const totalDisplay =
    params.totalPaise > 0
      ? `₹${(params.totalPaise / 100).toLocaleString('en-IN')}`
      : '₹[TBD]';

  const itemLines = params.items.map((item) => {
    const itemPrice =
      item.price > 0
        ? `₹${((item.price * item.quantity) / 100).toLocaleString('en-IN')}`
        : '₹[TBD]';
    return `• ${item.name} (${item.size || '15g'}) x${item.quantity} — ${itemPrice}`;
  });

  const parts = [
    `Hi Saniya! 🌸 I would like to place an order from Say By Saniya:`,
    '',
    ...itemLines,
    '',
    `Total: ${totalDisplay}`,
  ];

  if (params.dealCode) {
    parts.push(`Promo / Deal Code: ${params.dealCode.toUpperCase()}`);
  }

  if (params.giftNote?.trim()) {
    parts.push(`Gift Note / Note: "${params.giftNote.trim()}"`);
  }

  parts.push(
    '',
    `Customer Details:`,
    `Name: ${params.customerName || ''}`,
    `Delivery Address: `,
    `Payment Preference: UPI / Cash on Delivery`
  );

  return parts.join('\n');
};

/**
 * Saves the enquiry snapshot to the Supabase database.
 * CRITICAL: This is non-blocking with a strict timeout so a network glitch
 * or database issue NEVER prevents the customer from opening WhatsApp or Instagram.
 */
export const saveEnquiryToDatabase = async (params: {
  channel: 'whatsapp' | 'instagram';
  items: CartSnapshotItem[];
  totalPaise: number;
  dealCode?: string | null;
  customerName?: string;
  customerPhone?: string;
  customerHandle?: string;
  notes?: string;
}): Promise<boolean> => {
  if (!isSupabaseConfigured) {
    console.warn('[SocialOrder] Supabase not configured, skipping enquiry db save');
    return false;
  }

  const snapshot: CartSnapshot = {
    items: params.items,
    subtotalPaise: params.totalPaise,
    discountPaise: 0,
    totalPaise: params.totalPaise,
    appliedDealCode: params.dealCode || null,
  };

  try {
    // 2.5-second timeout safeguard to ensure instant chat handoff
    const savePromise = supabase.from('enquiries').insert({
      channel: params.channel,
      customer_name: params.customerName || null,
      customer_phone: params.customerPhone || null,
      customer_handle: params.customerHandle || null,
      cart_snapshot: snapshot as unknown as Json,
      total_paise: params.totalPaise,
      deal_code: params.dealCode || null,
      notes: params.notes || null,
      status: 'new',
    });

    const timeoutPromise = new Promise<{ error: Error }>((_, reject) =>
      setTimeout(() => reject(new Error('Enquiry save timed out')), 2500)
    );

    const result = (await Promise.race([savePromise, timeoutPromise])) as {
      error: Error | null;
    };

    if (result.error) {
      console.warn('[SocialOrder] Failed to save enquiry to Supabase:', result.error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[SocialOrder] Non-blocking error saving enquiry:', err);
    return false;
  }
};

/**
 * Handles full checkout handoff:
 * 1. Saves enquiry snapshot to Supabase (in background / with safe timeout)
 * 2. Opens WhatsApp or Instagram DM with prefilled message
 */
export const executeSocialOrder = async (params: {
  channel: 'whatsapp' | 'instagram';
  items: CartSnapshotItem[];
  totalPaise: number;
  dealCode?: string | null;
  giftNote?: string;
  customerName?: string;
  customerPhone?: string;
  customerHandle?: string;
  whatsappNumberOverride?: string;
  instagramHandleOverride?: string;
}) => {
  const message = formatOrderMessage({
    channel: params.channel,
    items: params.items,
    totalPaise: params.totalPaise,
    dealCode: params.dealCode,
    giftNote: params.giftNote,
    customerName: params.customerName,
  });

  // Non-blocking save to database
  saveEnquiryToDatabase({
    channel: params.channel,
    items: params.items,
    totalPaise: params.totalPaise,
    dealCode: params.dealCode,
    customerName: params.customerName,
    customerPhone: params.customerPhone,
    customerHandle: params.customerHandle,
    notes: params.giftNote,
  }).catch(() => {
    // Already logged inside saveEnquiryToDatabase
  });

  // Generate chat link
  let url: string;
  if (params.channel === 'whatsapp') {
    url = buildWhatsAppLink(message, params.whatsappNumberOverride);
  } else {
    const handle = getCleanInstagramHandle(params.instagramHandleOverride);
    // ig.me deep link directly opens conversation with prefilled text support on mobile apps
    url = `https://ig.me/m/${handle}?text=${encodeURIComponent(message)}`;
  }

  // Open in new tab or native app
  window.open(url, '_blank', 'noopener,noreferrer');
};
