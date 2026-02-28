
import { Product, Order } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Essential Oversized Tee',
    price: 1499,
    category: 'Tops',
    gender: 'Unisex',
    style: 'Minimalist',
    description: 'A heavy-weight cotton tee with a contemporary drop shoulder fit.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=800'
    ],
    sustainabilityTags: ['Organic Cotton', 'Carbon Neutral'],
    communityImages: [
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=400'
    ],
    reviews: [
      { id: 'r1', author: 'Siddharth M.', rating: 5, date: '2024-05-10', comment: 'The weight of the fabric is incredible. Definitely luxury quality at a fair price.', verified: true },
      { id: 'r2', author: 'Anjali R.', rating: 4, date: '2024-04-22', comment: 'Great fit, just slightly larger than expected. Size down if you want a cleaner look.', verified: true }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Bone', 'Sage'],
    fabric: '100% GOTS Certified Organic Cotton, 280 GSM.',
    fabricType: 'Cotton',
    care: 'Machine wash cold with like colors. Tumble dry low. Do not bleach.',
    fitDescription: 'Oversized silhouette. We recommend taking your usual size.',
    inStock: true,
    stockCount: 12,
    salesCount: 145,
    seoTitle: 'Essential Oversized Cotton Tee | AURA Minimalist Clothing',
    seoDescription: 'Premium 280 GSM organic cotton oversized tee. Sustainable, architectural fit. Shop AURA Season 01 essentials.'
  },
  {
    id: '2',
    name: 'Architectural Blazer',
    price: 7999,
    category: 'Outerwear',
    gender: 'Women',
    style: 'Formal',
    description: 'Structured wool-blend blazer with clean lines and hidden closures.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800'
    ],
    sustainabilityTags: ['Recycled Wool', 'Ethical Labor'],
    communityImages: [
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=400'
    ],
    reviews: [
      { id: 'r3', author: 'Elena G.', rating: 5, date: '2024-06-01', comment: 'The tailoring is impeccable. Wore it to a gallery opening and received so many compliments.', verified: true }
    ],
    sizes: ['38', '40', '42'],
    colors: ['Charcoal', 'Navy'],
    fits: ['Classic', 'Tailored'],
    fabric: '80% Virgin Wool, 20% Recycled Polyamide.',
    fabricType: 'Wool',
    care: 'Professional dry clean only.',
    fitDescription: 'Semi-structured shoulders with a straight cut through the waist.',
    inStock: true,
    stockCount: 5,
    salesCount: 32,
    seoTitle: 'Women’s Architectural Wool Blazer | Structured Formalwear | AURA',
    seoDescription: 'Master the power of minimalist tailoring with the AURA Architectural Blazer. Virgin wool blend. Ethical production.'
  },
  {
    id: '3',
    name: 'Pleated Trouser',
    price: 3499,
    category: 'Bottoms',
    gender: 'Men',
    style: 'Workwear',
    description: 'High-waisted trousers with deep front pleats and a relaxed taper.',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
    sustainabilityTags: ['Biodegradable', 'Zero Waste'],
    reviews: [
      { id: 'r4', author: 'Rahul K.', rating: 5, date: '2024-05-15', comment: 'The drape is perfect. Hard to find pleated pants that don’t feel dated, but these are very modern.', verified: true }
    ],
    sizes: ['28', '30', '32', '34'],
    colors: ['Khaki', 'Black'],
    fits: ['Standard', 'Long'],
    fabric: '65% Tencel™ Lyocell, 35% Organic Linen.',
    fabricType: 'Linen',
    care: 'Cold hand wash. Hang to dry.',
    fitDescription: 'High-rise with a spacious thigh and tapered ankle.',
    inStock: true,
    stockCount: 8,
    salesCount: 89,
    seoTitle: 'Men’s Pleated High-Waisted Trouser | Linen Blend | AURA',
    seoDescription: 'Redefining workwear. High-waisted men’s trousers with modern pleats. Tencel and linen blend for ultimate drape.'
  },
  {
    id: '4',
    name: 'Cashmere Minimal Knit',
    price: 9999,
    category: 'Knitwear',
    gender: 'Women',
    style: 'Minimalist',
    description: 'Ultra-soft ethically sourced cashmere sweater for effortless layering.',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
    sustainabilityTags: ['Cruelty Free'],
    reviews: [],
    sizes: ['S', 'M', 'L'],
    colors: ['Cream', 'Grey'],
    fabric: '100% Grade A Mongolian Cashmere.',
    fabricType: 'Cashmere',
    care: 'Hand wash cold using wool detergent.',
    fitDescription: 'Regular fit. Designed for mid-layering.',
    inStock: true,
    stockCount: 3,
    salesCount: 12
  },
  {
    id: '5',
    name: 'Structured Leather Tote',
    price: 12499,
    category: 'Accessories',
    gender: 'Unisex',
    style: 'Minimalist',
    description: 'A spacious tote made from vegetable-tanned leather with a matte finish.',
    image: 'https://images.unsplash.com/photo-1584917033904-493bb3c3a15d?auto=format&fit=crop&q=80&w=800',
    sustainabilityTags: ['Vegetable Tanned'],
    reviews: [
      { id: 'r5', author: 'Mark T.', rating: 4, date: '2024-03-12', comment: 'Beautiful leather. It’s developing a great patina already. I wish it had one more inner pocket though.', verified: true }
    ],
    sizes: ['One Size'],
    colors: ['Cognac', 'Black'],
    fabric: '100% Vegetable Tanned Italian Leather.',
    fabricType: 'Leather',
    care: 'Treat with leather conditioner twice a year.',
    fitDescription: 'Large capacity, suitable for 15" laptops.',
    inStock: true,
    stockCount: 4,
    salesCount: 45
  },
  {
    id: '6',
    name: 'Kids Mini Essential Tee',
    price: 999,
    category: 'Tops',
    gender: 'Kids',
    style: 'Loungewear',
    description: 'The same high-quality cotton as our main line, downsized for comfort.',
    image: 'https://images.unsplash.com/photo-1519233940173-67756f15774a?auto=format&fit=crop&q=80&w=800',
    sustainabilityTags: ['Hypoallergenic'],
    reviews: [
      { id: 'r6', author: 'Priya S.', rating: 5, date: '2024-04-01', comment: 'Finally some decent clothes for kids that aren’t covered in cartoon characters. Soft and durable.', verified: true }
    ],
    sizes: ['2Y', '4Y', '6Y'],
    colors: ['Bone', 'Sky'],
    fabric: '100% Organic Cotton.',
    fabricType: 'Cotton',
    care: 'Machine wash warm.',
    fitDescription: 'Relaxed fit for active play.',
    inStock: true,
    stockCount: 20,
    salesCount: 56
  }
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-7721', date: '2024-03-15', amount: 4500, status: 'Delivered', items: 3, paymentMethod: 'Credit Card', shippingCost: 0, customerEmail: 'sid@example.com' },
  { id: 'ORD-8109', date: '2024-02-28', amount: 1499, status: 'Delivered', items: 1, paymentMethod: 'UPI', shippingCost: 150, customerEmail: 'rahul@example.com' },
  { id: 'ORD-9022', date: '2024-04-10', amount: 8999, status: 'Processing', items: 4, paymentMethod: 'Net Banking', shippingCost: 0, customerEmail: 'elena@testmail.com' },
];

export const MOCK_CHART_DATA = [
  { name: 'Jan', spend: 4000 },
  { name: 'Feb', spend: 3000 },
  { name: 'Mar', spend: 6000 },
  { name: 'Apr', spend: 8000 },
  { name: 'May', spend: 5000 },
];

export const ADMIN_CREDENTIALS = {
  email: 'admin@aura.com',
  password: 'admin123'
};
