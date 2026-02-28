
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
// Fix: Added Search to imported icons from lucide-react
import { X, SlidersHorizontal, ChevronDown, Check, Search } from 'lucide-react';

interface ShopProps {
  onAddToCart: (p: Product) => void;
  onToggleSaved: (id: string) => void;
  savedItems: string[];
  products: Product[];
}

const Shop: React.FC<ShopProps> = ({ onAddToCart, onToggleSaved, savedItems, products }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = React.useState(false);
  const [showSort, setShowSort] = React.useState(false);

  const query = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedGender = searchParams.get('gender') || 'All';
  const selectedStyle = searchParams.get('style') || 'All';
  const selectedFabric = searchParams.get('fabric') || 'All';
  const selectedPriceRange = searchParams.get('price') || 'All';
  const selectedSize = searchParams.get('size') || 'All';
  const selectedColor = searchParams.get('color') || 'All';
  const selectedSort = searchParams.get('sort') || 'newest';

  const categories = ['All', ...Array.from(new Set<string>(products.map(p => p.category)))];
  const genders = ['All', 'Men', 'Women', 'Unisex', 'Kids'];
  const styles = ['All', 'Minimalist', 'Streetwear', 'Formal', 'Loungewear', 'Workwear'];
  const fabrics = ['All', 'Cotton', 'Wool', 'Linen', 'Cashmere', 'Denim', 'Silk', 'Leather'];
  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', '28', '30', '32', '34', '36', 'One Size'];
  const colors = ['All', ...Array.from(new Set<string>(products.flatMap(p => p.colors)))];
  const priceRanges = ['All', 'Under ₹2000', '₹2000 - ₹5000', '₹5000 - ₹10000', 'Above ₹10000'];

  const sortOptions = [
    { id: 'newest', label: 'Newest Arrivals' },
    { id: 'price-asc', label: 'Price: Low to High' },
    { id: 'price-desc', label: 'Price: High to Low' },
    { id: 'name-asc', label: 'Name: A-Z' },
  ];

  const filteredProducts = products.filter(p => {
    const matchesSearch = !query || 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesGender = selectedGender === 'All' || p.gender === selectedGender;
    const matchesStyle = selectedStyle === 'All' || p.style === selectedStyle;
    const matchesFabric = selectedFabric === 'All' || p.fabricType === selectedFabric;
    const matchesSize = selectedSize === 'All' || p.sizes.includes(selectedSize);
    const matchesColor = selectedColor === 'All' || p.colors.includes(selectedColor);
    
    let matchesPrice = true;
    if (selectedPriceRange === 'Under ₹2000') matchesPrice = p.price < 2000;
    else if (selectedPriceRange === '₹2000 - ₹5000') matchesPrice = p.price >= 2000 && p.price <= 5000;
    else if (selectedPriceRange === '₹5000 - ₹10000') matchesPrice = p.price >= 5000 && p.price <= 10000;
    else if (selectedPriceRange === 'Above ₹10000') matchesPrice = p.price > 10000;

    return matchesSearch && matchesCategory && matchesGender && matchesStyle && matchesFabric && matchesPrice && matchesSize && matchesColor;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'name-asc': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All') newParams.delete(key);
    else newParams.set(key, value);
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const q = searchParams.get('q');
    const newParams = new URLSearchParams();
    if (q) newParams.set('q', q);
    setSearchParams(newParams);
  };

  const activeFiltersCount = [selectedCategory, selectedGender, selectedStyle, selectedFabric, selectedPriceRange, selectedSize, selectedColor].filter(f => f !== 'All').length;

  return (
    <div className="pt-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2 italic">
              {query ? `Results for "${query}"` : 'Collections'}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
              {sortedProducts.length} pieces discovered
            </p>
            {/* Category quick tabs */}
            <div className="flex flex-wrap gap-2 mt-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateParam('category', cat)}
                  className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest rounded-full border transition-all ${selectedCategory === cat ? 'bg-black text-white border-black' : 'bg-white border-slate-200 text-slate-500 hover:border-black hover:text-black'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => { setShowSort(!showSort); setShowFilters(false); }}
                className="flex items-center space-x-2 text-[9px] font-bold uppercase tracking-[0.2em] border border-slate-100 px-6 py-3 rounded-full hover:border-black transition-all bg-white shadow-sm"
              >
                <span>Sort: {sortOptions.find(o => o.id === selectedSort)?.label}</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${showSort ? 'rotate-180' : ''}`} />
              </button>
              {showSort && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-2xl z-20 py-2 animate-fade-in overflow-hidden">
                  {sortOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => { updateParam('sort', option.id); setShowSort(false); }}
                      className={`w-full text-left px-6 py-3 text-[9px] font-bold uppercase tracking-widest transition-colors ${selectedSort === option.id ? 'bg-slate-50 text-black' : 'text-slate-400 hover:text-black hover:bg-slate-50'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => { setShowFilters(!showFilters); setShowSort(false); }}
              className={`flex items-center space-x-3 text-[9px] font-bold uppercase tracking-[0.2em] border px-6 py-3 rounded-full transition-all shadow-sm ${showFilters ? 'bg-black text-white border-black shadow-black/20' : 'border-slate-100 hover:border-black bg-white'}`}
            >
              <SlidersHorizontal size={14} />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-16 p-10 bg-slate-50 rounded-3xl animate-fade-in border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => updateParam('category', cat)} className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest rounded-full border transition-all ${selectedCategory === cat ? 'bg-black text-white border-black' : 'bg-white border-slate-200 text-slate-500 hover:border-black'}`}>{cat}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">Gender</label>
                <div className="flex flex-wrap gap-2">
                  {genders.map(g => (
                    <button key={g} onClick={() => updateParam('gender', g)} className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest rounded-full border transition-all ${selectedGender === g ? 'bg-black text-white' : 'bg-white text-slate-500 hover:border-black'}`}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">Style Aesthetic</label>
                <div className="flex flex-wrap gap-2">
                  {styles.map(s => (
                    <button key={s} onClick={() => updateParam('style', s)} className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest rounded-full border transition-all ${selectedStyle === s ? 'bg-black text-white' : 'bg-white text-slate-500 hover:border-black'}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">Sizes</label>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map(s => (
                    <button key={s} onClick={() => updateParam('size', s)} className={`w-full py-2 text-[9px] font-bold uppercase rounded-lg border flex items-center justify-center transition-all ${selectedSize === s ? 'bg-black text-white border-black' : 'bg-white text-slate-500 hover:border-black'}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">Price Points</label>
                <div className="flex flex-col gap-2">
                  {priceRanges.map(p => (
                    <button key={p} onClick={() => updateParam('price', p)} className={`text-left px-4 py-3 text-[9px] font-bold uppercase tracking-widest rounded-xl border flex items-center justify-between transition-all ${selectedPriceRange === p ? 'bg-black text-white border-black' : 'bg-white text-slate-500 hover:border-black'}`}>
                      {p}
                      {selectedPriceRange === p && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-center">
              <div className="flex flex-wrap gap-6">
                 <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-3">Color Filter</label>
                    <div className="flex gap-2">
                      {colors.map(c => (
                        <button key={c} onClick={() => updateParam('color', c)} className={`px-3 py-1.5 text-[8px] font-bold uppercase border rounded-md ${selectedColor === c ? 'bg-black text-white' : 'bg-white text-slate-400'}`}>{c}</button>
                      ))}
                    </div>
                 </div>
                 <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-3">Fabric Filter</label>
                    <div className="flex gap-2">
                      {fabrics.map(f => (
                        <button key={f} onClick={() => updateParam('fabric', f)} className={`px-3 py-1.5 text-[8px] font-bold uppercase border rounded-md ${selectedFabric === f ? 'bg-black text-white' : 'bg-white text-slate-400'}`}>{f}</button>
                      ))}
                    </div>
                 </div>
              </div>
              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] hover:text-black transition-colors flex items-center">
                   <X size={14} className="mr-2" /> Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}

        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 pb-32">
            {sortedProducts.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onToggleSaved={onToggleSaved} isSaved={savedItems.includes(p.id)} />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center animate-fade-in">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={24} className="text-slate-200" />
             </div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">No matching pieces found.</p>
             <button onClick={clearFilters} className="mt-8 text-[10px] font-bold text-black border-b border-black pb-1 uppercase tracking-widest hover:opacity-50 transition-opacity">Reset Discovery</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
