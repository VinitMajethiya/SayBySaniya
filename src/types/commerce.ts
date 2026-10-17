import type { DealType, EnquiryChannel, EnquiryStatus, OrderStatus, OrderChannel, ReviewStatus } from './supabase';

export interface Deal {
  id: string;
  code: string | null;
  title: string;
  description: string | null;
  imageUrl: string | null;
  dealType: DealType;
  discountValue: number; // % off or paise off
  applicableProductIds: string[];
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  showInBanner: boolean;
}

export interface CartSnapshotItem {
  id: string;
  slug: string;
  name: string;
  size: string;
  price: number; // in paise (or 0 for TBD)
  quantity: number;
}

export interface CartSnapshot {
  items: CartSnapshotItem[];
  subtotalPaise: number;
  discountPaise: number;
  totalPaise: number;
  appliedDealCode: string | null;
}

export interface Enquiry {
  id: string;
  channel: EnquiryChannel;
  customerName: string | null;
  customerPhone: string | null;
  customerHandle: string | null;
  cartSnapshot: CartSnapshot;
  totalPaise: number;
  dealCode: string | null;
  status: EnquiryStatus;
  notes: string | null;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  slug: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  enquiryId: string | null;
  orderNumber: string;
  customerName: string;
  customerPhone: string | null;
  customerHandle: string | null;
  channel: OrderChannel;
  items: OrderItem[];
  totalPaise: number;
  status: OrderStatus;
  courierName: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string | null;
  productSlug: string | null;
  authorName: string;
  rating: number;
  reviewText: string;
  photoUrl: string | null;
  status: ReviewStatus;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  instagramHandle: string | null;
  quote: string;
  photoUrl: string | null;
  rating: number;
  isActive: boolean;
  sortOrder: number;
}

export interface SiteSettings {
  whatsappNumber: string;
  instagramHandle: string;
  announcementBanner: string;
  shippingNote: string;
  showFutureFavorites?: boolean;
}
