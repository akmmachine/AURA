
import React from 'react';
import { Product } from '../types';
import { Heart, Plus, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onToggleSaved: (id: string) => void;
  isSaved: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onToggleSaved, isSaved }) => {
  const isSoldOut = product.stockCount <= 0;

  return (
    <div className="group relative">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 rounded-sm">
        <Link to={`/product/${product.id}`} className={isSoldOut ? 'opacity-60 grayscale' : ''}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        
        {isSoldOut && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <span className="bg-black/80 backdrop-blur text-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm whitespace-nowrap border border-white/20">
              Sold Out
            </span>
          </div>
        )}

        <button 
          onClick={() => onToggleSaved(product.id)}
          className={`absolute top-4 right-4 p-2 rounded-full bg-white/90 shadow-sm transition-colors z-20 ${isSaved ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
        >
          <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>

        {!isSoldOut && (
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
            <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-black text-white py-3 flex items-center justify-center space-x-2 text-sm font-medium tracking-wide uppercase shadow-xl"
            >
              <Plus size={16} />
              <span>QUICK ADD</span>
            </button>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-slate-900">
            <Link to={`/product/${product.id}`}>
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-400">
            {product.category} {isSoldOut && <span className="text-rose-400 ml-1">• Out of Stock</span>}
          </p>
        </div>
        <p className="text-sm font-bold text-slate-900">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
};

export default ProductCard;
