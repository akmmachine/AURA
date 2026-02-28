
import React from 'react';
import { Truck, RefreshCcw, ShieldCheck, Mail, Phone, MessageCircle, ArrowRight, HelpCircle } from 'lucide-react';

const Support: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'shipping' | 'returns' | 'contact'>('shipping');

  return (
    <div className="pt-24 min-h-screen bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <header className="text-center mb-20 animate-fade-in">
           <h1 className="text-5xl font-bold tracking-tighter uppercase italic mb-6">Concierge & Care</h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Transparent Policies • Human Support</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-12 mb-20 border-b border-slate-200 pb-8">
           {[
              { id: 'shipping', label: 'Logistics', icon: Truck },
              { id: 'returns', label: 'Returns', icon: RefreshCcw },
              { id: 'contact', label: 'Connect', icon: MessageCircle }
           ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-3 text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative ${activeTab === tab.id ? 'text-black' : 'text-slate-300 hover:text-slate-400'}`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
                {activeTab === tab.id && <div className="absolute -bottom-8 left-0 right-0 h-0.5 bg-black animate-fade-in"></div>}
              </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="bg-white p-12 md:p-16 rounded-3xl shadow-xl shadow-black/5 border border-slate-100 animate-fade-in">
           {activeTab === 'shipping' && (
              <div className="space-y-12 animate-fade-in">
                 <section className="space-y-6">
                    <h3 className="text-xl font-bold tracking-tight uppercase italic flex items-center">
                       <Truck className="mr-4 text-slate-400" size={24} /> Delivery Estimates
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                       <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Metros & Tier 1</p>
                          <p className="text-sm font-bold uppercase">3–5 Business Days</p>
                       </div>
                       <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Rest of India</p>
                          <p className="text-sm font-bold uppercase">5–8 Business Days</p>
                       </div>
                    </div>
                 </section>

                 <section className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-black">Complimentary Logistics</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed uppercase tracking-wide">
                       AURA provides standard shipping at no additional cost for all domestic orders exceeding ₹2999. For orders below this threshold, a logistics fee of ₹150 applies to offset carbon-neutral handling.
                    </p>
                 </section>

                 <section className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-black">Global Transit</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed uppercase tracking-wide">
                       We currently service international destinations via DHL Express. Calculated duties and taxes are applied at checkout to ensure zero hidden costs upon arrival.
                    </p>
                 </section>
              </div>
           )}

           {activeTab === 'returns' && (
              <div className="space-y-12 animate-fade-in">
                 <section className="space-y-6">
                    <h3 className="text-xl font-bold tracking-tight uppercase italic flex items-center">
                       <RefreshCcw className="mr-4 text-slate-400" size={24} /> Exchange Policy
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed uppercase tracking-wide">
                       We understand that minimalist dressing requires the perfect fit. If your purchase doesn't align with your expectations, we offer a 14-day exchange window.
                    </p>
                 </section>

                 <div className="grid grid-cols-1 gap-6">
                    {[
                       { title: "Sizing Adjustments", desc: "Exchange for a different size of the same piece at no cost." },
                       { title: "Store Credit", desc: "Return for AURA credit which remains valid for 365 days." },
                       { title: "Original State", desc: "Garments must be unworn, unwashed, and include all architectural tags." }
                    ].map((item, i) => (
                       <div key={i} className="flex items-start space-x-6 p-6 border-b border-slate-50 last:border-0">
                          <span className="w-6 h-6 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">0{i+1}</span>
                          <div>
                             <p className="text-[10px] font-bold uppercase tracking-widest mb-1">{item.title}</p>
                             <p className="text-[10px] text-slate-400 uppercase tracking-widest">{item.desc}</p>
                          </div>
                       </div>
                    ))}
                 </div>

                 <button className="w-full bg-black text-white py-5 font-bold tracking-[0.3em] uppercase text-[10px] rounded-2xl shadow-xl shadow-black/10 flex items-center justify-center space-x-4">
                    <span>Initiate a Return</span>
                    <ArrowRight size={14} />
                 </button>
              </div>
           )}

           {activeTab === 'contact' && (
              <div className="space-y-12 animate-fade-in">
                 <header className="space-y-4">
                    <h3 className="text-xl font-bold tracking-tight uppercase italic flex items-center">
                       <MessageCircle className="mr-4 text-slate-400" size={24} /> Human Support
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed uppercase tracking-wide">
                       AURA is operated by a small team of passionate curators. We are available Monday to Friday, 10 AM – 6 PM IST.
                    </p>
                 </header>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a href="mailto:care@aura-minimal.com" className="p-8 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center group hover:bg-black transition-all">
                       <Mail size={24} className="mb-4 text-slate-300 group-hover:text-white" />
                       <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-white/60 mb-2">Email</span>
                       <span className="text-[9px] font-bold uppercase group-hover:text-white">care@aura-minimal.com</span>
                    </a>
                    <a href="tel:+919876543210" className="p-8 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center group hover:bg-black transition-all">
                       <Phone size={24} className="mb-4 text-slate-300 group-hover:text-white" />
                       <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-white/60 mb-2">Phone</span>
                       <span className="text-[9px] font-bold uppercase group-hover:text-white">+91 98765 43210</span>
                    </a>
                    <a href="https://wa.me/919876543210" className="p-8 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center group hover:bg-black transition-all">
                       <MessageCircle size={24} className="mb-4 text-slate-300 group-hover:text-white" />
                       <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-white/60 mb-2">WhatsApp</span>
                       <span className="text-[9px] font-bold uppercase group-hover:text-white">Instant Chat</span>
                    </a>
                 </div>

                 <form className="pt-10 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <input type="text" placeholder="Your Name" className="w-full bg-slate-50 border-none p-5 rounded-2xl text-[10px] uppercase font-bold tracking-widest" />
                       <input type="email" placeholder="Email ID" className="w-full bg-slate-50 border-none p-5 rounded-2xl text-[10px] uppercase font-bold tracking-widest" />
                    </div>
                    <textarea rows={4} placeholder="How can we assist your wardrobe today?" className="w-full bg-slate-50 border-none p-5 rounded-2xl text-[10px] uppercase font-bold tracking-widest"></textarea>
                    <button className="w-full bg-black text-white py-5 font-bold tracking-[0.3em] uppercase text-[10px] rounded-2xl shadow-xl shadow-black/10">Dispatch Inquiry</button>
                 </form>
              </div>
           )}
        </div>

        {/* FAQ Shortcut */}
        <div className="mt-20 flex flex-col items-center text-center space-y-6">
           <div className="p-4 bg-white rounded-full shadow-lg border border-slate-100">
              <HelpCircle size={32} className="text-black" />
           </div>
           <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">Frequent Queries</h4>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Discover answers to standard wardrobe questions</p>
           </div>
           <button className="text-[10px] font-bold text-black border-b border-black pb-1 uppercase tracking-widest">Browse Encyclopedia</button>
        </div>
      </div>
    </div>
  );
};

export default Support;
