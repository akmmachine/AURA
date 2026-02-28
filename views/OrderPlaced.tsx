import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const OrderPlaced: React.FC = () => {
  return (
    <div className="pt-40 pb-20 text-center max-w-lg mx-auto px-4 animate-fade-in">
      <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 size={40} />
      </div>
      <h2 className="text-4xl font-bold tracking-tighter mb-4 uppercase italic">Order Placed</h2>
      <p className="text-slate-500 mb-10 leading-relaxed font-light text-sm">
        Your payment was processed securely. Your minimalist essentials are being prepared for dispatch.
      </p>

      <Link 
        to="/" 
        className="inline-block bg-black text-white px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
      >
        Home
      </Link>
    </div>
  );
};

export default OrderPlaced;
