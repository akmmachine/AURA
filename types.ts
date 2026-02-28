
export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
  style: 'Minimalist' | 'Streetwear' | 'Formal' | 'Loungewear' | 'Workwear';
  description: string;
  image: string;
  gallery?: string[]; // Multiple images
  sustainabilityTags?: string[]; // E.g., ["Organic", "Recycled", "Vegan"]
  communityImages?: string[];
  reviews?: Review[];
  sizes: string[];
  colors: string[];
  fits?: string[];
  fabric: string;
  fabricType: 'Cotton' | 'Wool' | 'Linen' | 'Cashmere' | 'Denim' | 'Silk' | 'Leather';
  care: string;
  fitDescription: string;
  inStock: boolean;
  stockCount: number;
  salesCount: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  selectedFit?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  joinedDate?: string;
}

export interface SavedPaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'paypal' | 'applepay' | 'googlepay';
  last4?: string;
  brand?: string;
  vpa?: string;
  expiry?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  amount: number;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
  items: number;
  paymentMethod: string;
  shippingCost: number;
  customerEmail: string;
}

export interface AdminNotification {
  id: string;
  type: 'order' | 'inventory' | 'system';
  message: string;
  timestamp: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  category: 'Design' | 'Sustainability' | 'Culture' | 'Behind the Scenes' | 'Style Guide';
  author: string;
  date: string;
  published: boolean;
}
