
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ChevronRight, MessageSquare, Sparkles, X, Ruler, Info, RefreshCcw, PackageCheck, AlertCircle, Truck, ShieldCheck, Star, Instagram, ChevronDown, CheckCircle } from 'lucide-react';
import { getStylingAdvice } from '../services/geminiService';
import { Product, Review } from '../types';

interface ProductDetailProps {
  onAddToCart: (p: Product, size: string, color: string, fit?: string) => void;
  onToggleSaved: (id: string) => void;
  savedItems: string[];
  products: Product[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ onAddToCart, onToggleSaved, savedItems, products }) => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = React.useState('');
  const [selectedColor, setSelectedColor] = React.useState('');
  const [selectedFit, setSelectedFit] = React.useState('');
  const [activeAccordion, setActiveAccordion] = React.useState<string | null>('details');
  const [showSizeGuide, setShowSizeGuide] = React.useState(false);
  const [addedToCartJustNow, setAddedToCartJustNow] = React.useState(false);

  // Default to first option when product loads so the page is immediately interactive
  React.useEffect(() => {
    if (!product) return;
    setSelectedColor(prev => (product.colors.includes(prev) ? prev : product.colors[0] || ''));
    setSelectedSize(prev => (product.sizes.includes(prev) ? prev : product.sizes[0] || ''));
    setSelectedFit(prev => (product.fits?.includes(prev) ? prev : (product.fits?.[0] ?? '')));
  }, [product?.id]);

  const [aiQuery, setAiQuery] = React.useState('');
  const [aiAdvice, setAiAdvice] = React.useState('');
  const [isAskingAi, setIsAskingAi] = React.useState(false);

  if (!product) return <div className="pt-24 text-center font-bold tracking-widest">PRODUCT NOT FOUND</div>;

  const handleAskStylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setIsAskingAi(true);
    const advice = await getStylingAdvice(product.name, aiQuery);
    setAiAdvice(advice || '');
    setIsAskingAi(false);
  };

  const isSaved = savedItems.includes(product.id);
  const toggleAccordion = (id: string) => setActiveAccordion(activeAccordion === id ? null : id);

  const avgRating = product.reviews && product.reviews.length > 0 
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length 
    : 0;

  const isOutOfStock = product.stockCount <= 0;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-black"></div>
            <button onClick={() => setShowSizeGuide(false)} className="absolute right-6 top-6 text-slate-400 hover:text-black">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold tracking-tighter uppercase mb-8">Measurement Index — {product.name}</h2>
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-[10px] font-bold uppercase tracking-widest">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Metric</th>
                    <th className="px-6 py-4">XS</th>
                    <th className="px-6 py-4">S</th>
                    <th className="px-6 py-4">M</th>
                    <th className="px-6 py-4">L</th>
                    <th className="px-6 py-4">XL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-500">
                  <tr><td className="px-6 py-4 text-black">Chest (cm)</td><td className="px-6 py-4">50</td><td className="px-6 py-4">52</td><td className="px-6 py-4">54</td><td className="px-6 py-4">57</td><td className="px-6 py-4">60</td></tr>
                  <tr><td className="px-6 py-4 text-black">Shoulder (cm)</td><td className="px-6 py-4">44</td><td className="px-6 py-4">46</td><td className="px-6 py-4">48</td><td className="px-6 py-4">50</td><td className="px-6 py-4">52</td></tr>
                  <tr><td className="px-6 py-4 text-black">Length (cm)</td><td className="px-6 py-4">66</td><td className="px-6 py-4">68</td><td className="px-6 py-4">70</td><td className="px-6 py-4">73</td><td className="px-6 py-4">75</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-8 text-[9px] text-slate-400 leading-relaxed uppercase tracking-widest italic">
              * AURA garments are cut for a modern architectural drape. For a structured fit, consider sizing down.
            </p>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 sm:mb-12" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <ChevronRight size={10} />
        <Link to="/shop" className="hover:text-black transition-colors">Collections</Link>
        <ChevronRight size={10} />
        <span className="text-black">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20">
        {/* Gallery — full width on mobile, ~60% on desktop */}
        <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="aspect-[3/4] overflow-hidden bg-slate-50 rounded-2xl border border-slate-100 shadow-sm relative group">
            <img src={product.image} alt={product.name} className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-60' : ''}`} />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="bg-black text-white px-8 py-4 font-bold uppercase tracking-[0.4em] text-sm rounded-sm">Archive Item // Sold Out</span>
              </div>
            )}
            <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="bg-white/90 backdrop-blur px-3 py-1 rounded text-[8px] font-bold uppercase tracking-widest border border-slate-100">Studio Focus</span>
            </div>
          </div>
          
          {/* Community Lookbook */}
          {product.communityImages && product.communityImages.length > 0 && (
            <div className="pt-8">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center">
                    <Instagram size={14} className="mr-2" /> In The Wild
                 </h3>
                 <span className="text-[8px] text-slate-400 uppercase tracking-widest">Share yours: #MyAura</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {product.communityImages.map((img, i) => (
                  <div key={i} className="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-100 cursor-pointer hover:opacity-90 transition-opacity">
                    <img src={img} className="w-full h-full object-cover" alt="Community Styling" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{product.category}</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className={i < Math.floor(avgRating) ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                ))}
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-2">({product.reviews?.length || 0})</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tighter mb-4 uppercase italic leading-tight">{product.name}</h1>
            <div className="flex items-baseline space-x-6">
              <p className="text-3xl font-light text-slate-900">₹{product.price.toLocaleString('en-IN')}</p>
              {product.stockCount > 0 && product.stockCount < 10 && (
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                  <AlertCircle size={10} className="mr-2" /> Limited: {product.stockCount} Pieces Remaining
                </span>
              )}
              {isOutOfStock && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  <PackageCheck size={10} className="mr-2" /> Currently Out of Stock
                </span>
              )}
            </div>
          </div>
          
          <div className="text-slate-500 mb-10 leading-relaxed">
            <p className="uppercase tracking-wide text-[11px] font-light leading-loose">{product.description}</p>
          </div>

          <div className="space-y-10 mb-12">
            {/* Colors */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest mb-5 block">Palette Selection — {selectedColor || 'Neutral'}</span>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {product.colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setSelectedColor(color)}
                    className={`min-h-[44px] px-5 sm:px-6 py-3 border text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${selectedColor === color ? 'bg-black text-white border-black shadow-xl shadow-black/10 scale-[1.02]' : 'bg-white border-slate-100 hover:border-black disabled:opacity-20 disabled:cursor-not-allowed'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Fits (when product has fits e.g. Classic / Tailored) */}
            {product.fits && product.fits.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest mb-5 block">Fit</span>
                <div className="flex flex-wrap gap-3">
                  {product.fits.map(fit => (
                    <button
                      key={fit}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedFit(fit)}
                      className={`min-h-[44px] px-5 py-3 border rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${selectedFit === fit ? 'bg-black text-white border-black shadow-lg shadow-black/10' : 'bg-white border-slate-100 hover:border-black disabled:opacity-20 disabled:cursor-not-allowed'}`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
                <span className="text-[10px] font-bold uppercase tracking-widest block">Dimensional Fit</span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors underline-offset-4 underline decoration-slate-100 w-fit focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded"
                >
                  <Ruler size={14} className="mr-2 shrink-0" aria-hidden /> Measurement Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[56px] min-h-[56px] sm:w-14 sm:h-14 border rounded-xl flex items-center justify-center text-[10px] font-bold uppercase tracking-widest transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${selectedSize === size ? 'bg-black text-white border-black shadow-xl shadow-black/10 scale-[1.02]' : 'bg-white border-slate-100 hover:border-black disabled:opacity-20 disabled:cursor-not-allowed'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-6 pt-6">
              <div className="flex gap-3 sm:gap-4">
                <button
                  type="button"
                  disabled={isOutOfStock || !selectedSize || !selectedColor || (product.fits?.length ? !selectedFit : false)}
                  onClick={() => {
                    if (isOutOfStock || !selectedSize || !selectedColor) return;
                    if (product.fits?.length && !selectedFit) return;
                    onAddToCart(product, selectedSize, selectedColor, selectedFit || undefined);
                    setAddedToCartJustNow(true);
                    window.setTimeout(() => setAddedToCartJustNow(false), 2000);
                  }}
                  className="flex-1 min-h-[52px] sm:py-6 bg-black text-white py-4 sm:py-6 font-bold tracking-[0.4em] uppercase text-xs hover:opacity-90 disabled:opacity-50 transition-all shadow-2xl shadow-black/20 rounded-2xl active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                  {addedToCartJustNow ? 'Added to cart' : isOutOfStock ? 'Sold Out' : 'Reserve Item'}
                </button>
                <button
                  type="button"
                  onClick={() => onToggleSaved(product.id)}
                  aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`min-w-[52px] min-h-[52px] w-14 sm:w-16 rounded-2xl flex items-center justify-center border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${isSaved ? 'border-rose-100 bg-rose-50 text-rose-500 shadow-inner' : 'border-slate-100 hover:border-black bg-white shadow-sm'}`}
                >
                  <Heart size={22} fill={isSaved ? 'currentColor' : 'none'} aria-hidden />
                </button>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-4 sm:py-6 border-y border-slate-50 bg-slate-50/30 rounded-2xl px-4">
                 <div className="flex flex-col items-center space-y-1.5 sm:space-y-2 min-w-[70px] sm:min-w-0">
                    <Truck size={14} className="text-slate-400 shrink-0" aria-hidden />
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest text-center leading-tight">Prompt Shipping</span>
                 </div>
                 <div className="flex flex-col items-center space-y-1.5 sm:space-y-2 min-w-[70px] sm:min-w-0">
                    <RefreshCcw size={14} className="text-slate-400 shrink-0" aria-hidden />
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest text-center leading-tight">14-Day Exchange</span>
                 </div>
                 <div className="flex flex-col items-center space-y-1.5 sm:space-y-2 min-w-[70px] sm:min-w-0">
                    <ShieldCheck size={14} className="text-slate-400 shrink-0" aria-hidden />
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest text-center leading-tight">Verified Transaction</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Sticky CTA on mobile — visible when main CTA scrolls out of view */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-100 p-4 safe-area-pb flex gap-3 items-center shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            <button
              type="button"
              disabled={isOutOfStock || !selectedSize || !selectedColor || (product.fits?.length ? !selectedFit : false)}
              onClick={() => {
                if (isOutOfStock || !selectedSize || !selectedColor) return;
                if (product.fits?.length && !selectedFit) return;
                onAddToCart(product, selectedSize, selectedColor, selectedFit || undefined);
                setAddedToCartJustNow(true);
                window.setTimeout(() => setAddedToCartJustNow(false), 2000);
              }}
              className="flex-1 min-h-[48px] bg-black text-white font-bold tracking-[0.3em] uppercase text-[10px] rounded-xl active:scale-[0.98] disabled:opacity-50"
            >
              {addedToCartJustNow ? 'Added' : isOutOfStock ? 'Sold Out' : 'Reserve Item'}
            </button>
            <button
              type="button"
              onClick={() => onToggleSaved(product.id)}
              aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`min-w-[48px] min-h-[48px] rounded-xl flex items-center justify-center border ${isSaved ? 'border-rose-100 bg-rose-50 text-rose-500' : 'border-slate-200 bg-white'}`}
            >
              <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
          <div className="h-24 lg:hidden" aria-hidden />

          {/* Accordions */}
          <div className="border-t border-slate-100 divide-y divide-slate-100">
            <div className="py-5">
              <button onClick={() => toggleAccordion('details')} className="w-full flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] py-2 hover:text-slate-400 transition-colors">
                <span className="flex items-center italic">01 // Architectural Context</span>
                <ChevronDown size={14} className={`transition-transform duration-500 ${activeAccordion === 'details' ? 'rotate-180' : ''}`} />
              </button>
              {activeAccordion === 'details' && (
                <div className="pt-6 pb-4 text-[11px] text-slate-500 leading-relaxed uppercase tracking-widest animate-fade-in space-y-4">
                  <p>{product.description}</p>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 mt-4">
                     <div>
                        <p className="font-bold text-black mb-2">Materiality</p>
                        <p className="text-[10px]">{product.fabric}</p>
                     </div>
                     <div>
                        <p className="font-bold text-black mb-2">Provenance</p>
                        <p className="text-[10px]">Crafted with care in India</p>
                     </div>
                  </div>
                </div>
              )}
            </div>

            <div className="py-5">
              <button onClick={() => toggleAccordion('shipping')} className="w-full flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] py-2 hover:text-slate-400 transition-colors">
                <span className="flex items-center italic">02 // Delivery & Exchanges</span>
                <ChevronDown size={14} className={`transition-transform duration-500 ${activeAccordion === 'shipping' ? 'rotate-180' : ''}`} />
              </button>
              {activeAccordion === 'shipping' && (
                <div className="pt-6 pb-4 text-[10px] text-slate-500 leading-relaxed uppercase tracking-widest animate-fade-in space-y-4">
                  <div className="flex items-start space-x-4">
                     <PackageCheck size={16} className="text-emerald-500 shrink-0" />
                     <div>
                        <p className="font-bold text-black mb-1">Standard Delivery</p>
                        <p>Complimentary on orders over ₹2999. Expected arrival within 3–5 business days across major cities.</p>
                     </div>
                  </div>
                  <div className="flex items-start space-x-4">
                     <RefreshCcw size={16} className="text-blue-500 shrink-0" />
                     <div>
                        <p className="font-bold text-black mb-1">Uncomplicated Exchanges</p>
                        <p>We honor a 14-day exchange window for sizing adjustments or store credit. Original tags must remain intact.</p>
                     </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Stylist */}
          <div className="mt-16 p-10 bg-black text-white rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-700"></div>
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-2 bg-white/10 rounded-lg"><Sparkles size={18} /></div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em]">Styling Intelligence</h3>
            </div>
            
            {aiAdvice ? (
              <div className="animate-fade-in">
                <p className="text-sm font-light italic leading-relaxed text-white/80">"{aiAdvice}"</p>
                <button onClick={() => setAiAdvice('')} className="mt-8 text-[9px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-[0.3em] border-b border-white/20 pb-1">Request Alternative</button>
              </div>
            ) : (
              <form onSubmit={handleAskStylist} className="relative">
                <input 
                  type="text" 
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="How should I layer this for the monsoon?"
                  className="w-full bg-white/10 border border-white/10 p-5 pr-14 text-xs focus:outline-none focus:border-white/30 transition-colors rounded-2xl placeholder:text-white/20 font-light"
                />
                <button 
                  type="submit"
                  disabled={isAskingAi}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white disabled:opacity-20"
                >
                  {isAskingAi ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div> : <MessageSquare size={18} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-32 pt-20 border-t border-slate-100">
         <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-8">
            <div>
               <h2 className="text-3xl font-bold tracking-tighter uppercase italic mb-2">Verified Experience</h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Feedback from the AURA collective</p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex items-center space-x-12">
               <div className="text-center">
                  <p className="text-5xl font-bold tracking-tighter mb-1">{avgRating.toFixed(1)}</p>
                  <div className="flex justify-center mb-1">
                     {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={i < Math.floor(avgRating) ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                     ))}
                  </div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Average Rating</p>
               </div>
               <div className="h-16 w-px bg-slate-200"></div>
               <div className="space-y-1.5 min-w-[120px]">
                  {[5, 4, 3, 2, 1].map(num => (
                     <div key={num} className="flex items-center space-x-3">
                        <span className="text-[8px] font-bold text-slate-400 w-2">{num}</span>
                        <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                           <div className="h-full bg-black" style={{ width: `${(product.reviews?.filter(r => r.rating === num).length || 0) / (product.reviews?.length || 1) * 100}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {product.reviews && product.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {product.reviews.map((review) => (
                  <div key={review.id} className="space-y-4 animate-fade-in group">
                     <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                           <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                 <Star key={i} size={10} className={i < review.rating ? "text-black fill-black" : "text-slate-200"} />
                              ))}
                           </div>
                           <span className="text-[10px] font-bold uppercase tracking-widest">{review.author}</span>
                           {review.verified && (
                              <span className="flex items-center text-[8px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">
                                 <CheckCircle size={8} className="mr-1" /> Verified
                              </span>
                           )}
                        </div>
                        <span className="text-[9px] text-slate-400 font-medium uppercase tracking-widest">{review.date}</span>
                     </div>
                     <p className="text-[11px] text-slate-600 leading-relaxed font-light uppercase tracking-wide group-hover:text-black transition-colors">{review.comment}</p>
                  </div>
               ))}
            </div>
         ) : (
            <div className="py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Be the first to leave a review</p>
               <button className="mt-6 bg-black text-white px-8 py-3 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-black/10 transition-transform hover:scale-105">Write a Review</button>
            </div>
         )}
      </section>
    </div>
  );
};

export default ProductDetail;
