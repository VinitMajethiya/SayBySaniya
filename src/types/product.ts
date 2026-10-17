export type ProductStatus = 'available' | 'sold-out' | 'coming-soon' | 'limited-drop';
export type ProductCategory = 'lip-balm' | 'lip-mask' | 'lip-tint' | 'lip-gloss';
export type ProductPackaging = 'tin' | 'jar' | 'bottle';
export type ProductType = ProductCategory | 'bundle';
export type FlavorAccent = 'strawberry' | 'honey' | 'vanilla' | 'blood' | 'future' | 'jar-mask';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  packaging: ProductPackaging;
  type?: ProductType;
  flavor: string;
  accent: FlavorAccent;
  price: number;
  currency: string;
  size: string;
  shortDescription: string;
  description: string;
  flavorNotes: string[];
  ingredients: string[];
  howToUse: string;
  images: string[];
  badges: string[];
  status: ProductStatus;
  stock: number;
  featured: boolean;
  sortOrder: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
