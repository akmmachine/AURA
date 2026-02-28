
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

interface HomeProps {
  onAddToCart: (p: Product) => void;
  onToggleSaved: (id: string) => void;
  savedItems: string[];
  products: Product[];
}

const Home: React.FC<HomeProps> = ({ onAddToCart, onToggleSaved, savedItems, products }) => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.7]" 
          alt="Hero"
        />
        <div className="relative text-center px-4">
          <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter mb-6 uppercase">ESSENTIAL FORM.</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light tracking-wide uppercase">
            A minimalist approach to modern dressing. Quality materials, architectural silhouettes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop" className="bg-white text-black px-10 py-4 font-bold tracking-widest hover:bg-slate-100 transition-all uppercase text-sm">
              Discover Shop
            </Link>
            <Link to="/about" className="border border-white text-white px-10 py-4 font-bold tracking-widest hover:bg-white/10 transition-all uppercase text-sm">
              Our Philosophy
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] text-slate-400 uppercase">Season 01</span>
            <h2 className="text-3xl font-bold mt-2 tracking-tighter">FEATURED PIECES</h2>
          </div>
          <Link to="/shop" className="flex items-center text-[10px] font-bold text-black tracking-[0.2em] uppercase hover:opacity-50 transition-all">
            VIEW ALL <ArrowRight className="ml-2" size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {featuredProducts.map((p) => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onAddToCart={onAddToCart}
              onToggleSaved={onToggleSaved}
              isSaved={savedItems.includes(p.id)}
            />
          ))}
        </div>
      </section>

      {/* Brand Ethos */}
      <section className="bg-[#FAF9F6] py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif italic mb-8">Less, but better.</h2>
          <p className="text-xl text-slate-500 font-light leading-relaxed">
            "AURA was founded on the belief that clothing should be a quiet companion to our lives. We focus on ethical production and lasting materials that don't just fill a closet, but build a foundation."
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
