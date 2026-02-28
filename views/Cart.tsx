
import React from 'react';
import { CartItem, Product, User } from '../types';
import { Trash2, Plus, Minus, ArrowRight, Truck, Info, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface CartProps {
  items: CartItem[];
  products: Product[];
  user: User | null;
  onUpdateQuantity: (id: string, size: string, color: string, delta: number) => void;
  onUpdateItem: (id: string, oldSize: string, oldColor: string, updates: Partial<{selectedSize: string, selectedColor: string}>) => void;
  onRemove: (id: string, size: string, color: string) => void;
}

const Cart: React.FC<CartProps> = ({ items, products, user, onUpdateQuantity, onUpdateItem, onRemove }) => {
  const navigate = useNavigate();
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isFreeShipping = subtotal > 2999;
  const shipping = isFreeShipping ? 0 : 150;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center animate-fade-in px-4">
        <h2 className="text-3xl font-bold mb-6 tracking-tighter uppercase italic">Your bag is empty</h2>
        <p className="text-slate-400 font-light mb-10 tracking-widest uppercase text-xs">A minimalist wardrobe starts with a single piece.</p>
        <Link to="/shop" className="inline-block bg-black text-white px-10 py-5 font-bold tracking-widest uppercase text-[10px] shadow-2xl shadow-black/10">Explore Collection</Link>
      </div>
    );
  }

  const getProductStock = (id: string) => {
    return products.find(p => p.id === id)?.stockCount || 0;
  };

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase italic">Shopping Bag</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {isFreeShipping ? 'You qualify for COMPLIMENTARY shipping' : `Add ₹${(3000 - subtotal).toLocaleString('en-IN')} more for free shipping`}
          </p>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{items.length} Unique Items</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => {
            const stockAvailable = getProductStock(item.id);
            const isAtMaxStock = item.quantity >= stockAvailable;

            return (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-8 py-8 border-b border-slate-100 animate-fade-in group">
                <div className="w-full sm:w-32 aspect-[3/4] flex-shrink-0 bg-slate-50 overflow-hidden rounded-xl border border-slate-100 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                  {stockAvailable <= 0 && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center p-2 text-center">
                       <span className="text-[8px] font-bold uppercase tracking-widest text-rose-500">Sold Out In Inventory</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-black">{item.name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{item.category}</p>
                      </div>
                      <p className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Size</span>
                        <select 
                          value={item.selectedSize}
                          onChange={(e) => onUpdateItem(item.id, item.selectedSize, item.selectedColor, { selectedSize: e.target.value })}
                          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-black outline-none cursor-pointer hover:border-black transition-colors"
                        >
                          {item.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Color</span>
                        <select 
                          value={item.selectedColor}
                          onChange={(e) => onUpdateItem(item.id, item.selectedSize, item.selectedColor, { selectedColor: e.target.value })}
                          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-black outline-none cursor-pointer hover:border-black transition-colors"
                        >
                          {item.colors.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-4 pt-6 mt-6 border-t border-slate-50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-slate-200 rounded-full bg-white px-2 py-1">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.selectedColor, -1)}
                            className="p-1 hover:text-black text-slate-400 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-[11px] font-bold text-black">{item.quantity}</span>
                          <button 
                            disabled={isAtMaxStock}
                            onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.selectedColor, 1)}
                            className={`p-1 transition-colors ${isAtMaxStock ? 'text-slate-100' : 'hover:text-black text-slate-400'}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        {isAtMaxStock && stockAvailable > 0 && (
                          <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest flex items-center">
                            <AlertTriangle size={10} className="mr-1" /> Max Available Allocation Reached
                          </span>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => onRemove(item.id, item.selectedSize, item.selectedColor)}
                        className="flex items-center space-x-2 text-[9px] font-bold text-slate-300 hover:text-rose-500 uppercase tracking-[0.2em] transition-colors"
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 sticky top-24 shadow-sm">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-slate-400 flex items-center">
              <Info size={12} className="mr-2" /> Order Summary
            </h2>
            <div className="space-y-5 mb-10">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-black">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-slate-400 flex items-center">Shipping <Truck size={12} className="ml-2 opacity-50" /></span>
                <span className={shipping === 0 ? 'text-emerald-600' : 'text-black'}>{shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}</span>
              </div>
              <div className="pt-6 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-lg font-bold tracking-tighter uppercase italic">Total</span>
                <span className="text-2xl font-bold tracking-tighter">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            {user ? (
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-black text-white py-6 font-bold tracking-[0.3em] uppercase text-[10px] hover:opacity-90 transition-all flex items-center justify-center space-x-4 shadow-xl shadow-black/10 rounded-2xl"
              >
                <span>Continue to Checkout</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <div className="w-full p-6 bg-amber-50 border border-amber-100 rounded-2xl mb-4">
                <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest text-center mb-4">Sign in to place an order</p>
                <Link
                  to="/auth"
                  className="w-full bg-black text-white py-6 font-bold tracking-[0.3em] uppercase text-[10px] hover:opacity-90 transition-all flex items-center justify-center space-x-4 shadow-xl shadow-black/10 rounded-2xl"
                >
                  <span>Sign in to Checkout</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}

            <div className="mt-8 flex flex-col items-center space-y-4 pt-6 border-t border-slate-200/50">
              <div className="flex items-center space-x-3 text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span>Secure 256-bit SSL Checkout</span>
              </div>
              <div className="flex gap-4 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-3" />
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white border border-slate-100 rounded-2xl flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Sizing Support</p>
              <button className="text-[9px] font-bold uppercase tracking-widest text-black underline underline-offset-4">Talk to Expert</button>
            </div>
            <p className="text-[8px] text-slate-400 uppercase tracking-widest leading-relaxed">Free size exchanges on all orders within 14 days of delivery.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
