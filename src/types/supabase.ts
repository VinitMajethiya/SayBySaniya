export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProductDbStatus = 'available' | 'sold_out' | 'coming_soon' | 'limited_drop';
export type DealType = 'percent_off' | 'flat_off' | 'fixed_sale_price' | 'bundle';
export type EnquiryChannel = 'whatsapp' | 'instagram';
export type EnquiryStatus = 'new' | 'converted' | 'archived';
export type OrderStatus = 'new' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
export type OrderChannel = 'whatsapp' | 'instagram' | 'direct';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'superadmin';
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: 'admin' | 'superadmin';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'admin' | 'superadmin';
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          category: 'lip-balm' | 'lip-mask' | 'lip-tint' | 'lip-gloss';
          packaging: 'tin' | 'jar' | 'bottle';
          subtitle: string | null;
          description: string;
          flavor_notes: string[];
          price: number; // paise
          mrp: number | null; // paise
          size: string;
          badge: string | null;
          status: ProductDbStatus;
          is_featured: boolean;
          stock: number;
          images: string[];
          ingredients: string[];
          claims: string[];
          how_to_use: string | null;
          return_policy?: string | null;
          allergy_advice?: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          category?: 'lip-balm' | 'lip-mask' | 'lip-tint' | 'lip-gloss';
          packaging?: 'tin' | 'jar' | 'bottle';
          subtitle?: string | null;
          description: string;
          flavor_notes?: string[];
          price: number;
          mrp?: number | null;
          size?: string;
          badge?: string | null;
          status?: ProductDbStatus;
          is_featured?: boolean;
          stock?: number;
          images?: string[];
          ingredients?: string[];
          claims?: string[];
          how_to_use?: string | null;
          return_policy?: string | null;
          allergy_advice?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          category?: 'lip-balm' | 'lip-mask' | 'lip-tint' | 'lip-gloss';
          packaging?: 'tin' | 'jar' | 'bottle';
          subtitle?: string | null;
          description?: string;
          flavor_notes?: string[];
          price?: number;
          mrp?: number | null;
          size?: string;
          badge?: string | null;
          status?: ProductDbStatus;
          is_featured?: boolean;
          stock?: number;
          images?: string[];
          ingredients?: string[];
          claims?: string[];
          how_to_use?: string | null;
          return_policy?: string | null;
          allergy_advice?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      deals: {
        Row: {
          id: string;
          code: string | null;
          title: string;
          description: string | null;
          image_url: string | null;
          deal_type: DealType;
          discount_value: number;
          applicable_product_ids: string[];
          starts_at: string | null;
          ends_at: string | null;
          is_active: boolean;
          show_in_banner: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code?: string | null;
          title: string;
          description?: string | null;
          image_url?: string | null;
          deal_type: DealType;
          discount_value: number;
          applicable_product_ids?: string[];
          starts_at?: string | null;
          ends_at?: string | null;
          is_active?: boolean;
          show_in_banner?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string | null;
          title?: string;
          description?: string | null;
          image_url?: string | null;
          deal_type?: DealType;
          discount_value?: number;
          applicable_product_ids?: string[];
          starts_at?: string | null;
          ends_at?: string | null;
          is_active?: boolean;
          show_in_banner?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      enquiries: {
        Row: {
          id: string;
          channel: EnquiryChannel;
          customer_name: string | null;
          customer_phone: string | null;
          customer_handle: string | null;
          cart_snapshot: Json;
          total_paise: number;
          deal_code: string | null;
          status: EnquiryStatus;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          channel: EnquiryChannel;
          customer_name?: string | null;
          customer_phone?: string | null;
          customer_handle?: string | null;
          cart_snapshot: Json;
          total_paise: number;
          deal_code?: string | null;
          status?: EnquiryStatus;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          channel?: EnquiryChannel;
          customer_name?: string | null;
          customer_phone?: string | null;
          customer_handle?: string | null;
          cart_snapshot?: Json;
          total_paise?: number;
          deal_code?: string | null;
          status?: EnquiryStatus;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          enquiry_id: string | null;
          order_number: string;
          customer_name: string;
          customer_phone: string | null;
          customer_handle: string | null;
          channel: OrderChannel;
          items: Json;
          total_paise: number;
          status: OrderStatus;
          courier_name: string | null;
          tracking_number: string | null;
          tracking_url: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          enquiry_id?: string | null;
          order_number?: string;
          customer_name: string;
          customer_phone?: string | null;
          customer_handle?: string | null;
          channel: OrderChannel;
          items: Json;
          total_paise: number;
          status?: OrderStatus;
          courier_name?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          enquiry_id?: string | null;
          order_number?: string;
          customer_name?: string;
          customer_phone?: string | null;
          customer_handle?: string | null;
          channel?: OrderChannel;
          items?: Json;
          total_paise?: number;
          status?: OrderStatus;
          courier_name?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          product_id: string | null;
          product_slug: string | null;
          author_name: string;
          rating: number;
          review_text: string;
          photo_url: string | null;
          status: ReviewStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          product_slug?: string | null;
          author_name: string;
          rating: number;
          review_text: string;
          photo_url?: string | null;
          status?: ReviewStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          product_slug?: string | null;
          author_name?: string;
          rating?: number;
          review_text?: string;
          photo_url?: string | null;
          status?: ReviewStatus;
          created_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          instagram_handle: string | null;
          quote: string;
          photo_url: string | null;
          rating: number;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_name: string;
          instagram_handle?: string | null;
          quote: string;
          photo_url?: string | null;
          rating?: number;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          author_name?: string;
          instagram_handle?: string | null;
          quote?: string;
          photo_url?: string | null;
          rating?: number;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          is_public: boolean;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          is_public?: boolean;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          is_public?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
}
