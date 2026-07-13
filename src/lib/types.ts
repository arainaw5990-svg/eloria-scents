export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: string | null;
  images: string[];
  stock_quantity: number;
  is_featured: boolean;
  is_enabled: boolean;
  sort_order: number;
  fragrance_notes_top: string[];
  fragrance_notes_middle: string[];
  fragrance_notes_base: string[];
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_approved: boolean;
  admin_reply: string | null;
  created_at: string;
}

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  notes: string | null;
  items: any[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string | null;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  city: string | null;
  created_at: string;
  last_order_at: string | null;
}

export interface Settings {
  id: number;
  brand_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  hero_image_url: string | null;
  tagline: string;
  footer_text: string;
  currency_code: string;
  tax_percent: number;
  delivery_charge: number;
  free_delivery_threshold: number;
  whatsapp_number: string;
  instagram_url: string;
  facebook_url: string | null;
  email: string | null;
  maps_url: string | null;
  primary_color: string;
  accent_color: string;
  updated_at: string;
}
