import React from 'react';
import { ShoppingBag, Heart, User, Search, Menu, X, ArrowUpRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Product } from '../types';
import { PRODUCTS } from '../constants';

interface NavbarProps {
  cartCount: number;
  savedCount: number;
  isLoggedIn: boolean;
}

/**
 * Custom Levenshtein Distance implementation to calculate string similarity.
 * Returns the number of edits needed to transform string 'a' into 'b'.
 */
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, savedCount, isLoggedIn }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Enhanced fuzzy search logic that scores products based on relevance.
   */
  const getSuggestions = (query: string): Product[] => {
    if (!query.trim()) return [];
    
    const normalizedQuery = query.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/);

    return PRODUCTS.map(product => {
      const name = product.name.toLowerCase();
      const category = product.category.toLowerCase();
      const desc = product.description.toLowerCase();
      const fullText = `${name} ${category} ${desc}`;
      const targetWords = fullText.split(/\s+/);

      let score = 0;

      // 1. Check for exact name match (Highest priority)
      if (name === normalizedQuery) score += 100;
      else if (name.startsWith(normalizedQuery)) score += 80;
      else if (name.includes(normalizedQuery)) score += 50;

      // 2. Check each word in query for fuzzy matches or inclusions
      queryWords.forEach(qWord => {
        if (qWord.length < 2) return;

        // Substring check
        if (fullText.includes(qWord)) score += 20;

        // Typo/Fuzzy check (Levenshtein)
        targetWords.forEach(tWord => {
          if (tWord.length < 3) return;
          const distance = levenshteinDistance(qWord, tWord);
          
          // Allow 1 typo for short words, 2 for longer ones
          const maxDistance = qWord.length > 5 ? 2 : 1;
          if (distance > 0 && distance <= maxDistance) {
            score += (maxDistance - distance + 1) * 10;
          }
        });
      });

      return { product, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product)
    .slice(0, 5);
  };

  const suggestions = React.useMemo(() => getSuggestions(searchQuery), [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    } else {
      navigate('/shop');
    }
  };

  const selectSuggestion = (p: Product) => {
    navigate(`/product/${p.id}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  // Sync search input with URL on the shop page
  React.useEffect(() => {
    if (location.pathname === '/shop') {
      const params = new URLSearchParams(location.search);
      setSearchQuery(params.get('q') || '');
    }
  }, [location.search, location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-[0.3em] text-black">AURA</Link>
          </div>

          {/* Prominent Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center max-w-md mx-8 relative">
            <form onSubmit={handleSearch} className="relative w-full group">
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                className="w-full bg-slate-50 border-none rounded-full py-2.5 px-10 text-xs font-medium focus:ring-1 focus:ring-black/5 transition-all placeholder:text-slate-400 placeholder:uppercase placeholder:tracking-widest"
              />
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => { setSearchQuery(''); navigate('/shop'); setShowSuggestions(false); }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black"
                >
                  <X size={14} />
                </button>
              )}
            </form>

            {/* Autocomplete Dropdown */}
            {showSuggestions && searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {suggestions.length > 0 ? 'Curated Suggestions' : 'Discovery Intelligence'}
                  </span>
                  <button onClick={() => setShowSuggestions(false)}><X size={12} className="text-slate-300 hover:text-black" /></button>
                </div>
                {suggestions.length > 0 ? (
                  <div className="p-2">
                    {suggestions.map(p => (
                      <button 
                        key={p.id}
                        onClick={() => selectSuggestion(p)}
                        className="w-full flex items-center p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group"
                      >
                        <img src={p.image} className="w-10 h-10 rounded-md object-cover mr-4 grayscale group-hover:grayscale-0 transition-all" />
                        <div className="flex-1">
                          <p className="text-xs font-bold uppercase tracking-tight">{p.name}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{p.category} • {p.gender}</p>
                        </div>
                        <ArrowUpRight size={14} className="text-slate-200 group-hover:text-black transition-colors" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Searching for alternatives...</p>
                  </div>
                )}
                <div className="p-3 bg-slate-50">
                  <button 
                    onClick={handleSearch}
                    className="w-full py-2 text-[10px] font-bold text-center uppercase tracking-widest hover:text-black transition-colors"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex space-x-8 items-center mr-8">
            <Link to="/shop" className="text-[10px] font-bold text-slate-500 hover:text-black transition-colors uppercase tracking-[0.2em]">Shop</Link>
            <Link to="/about" className="text-[10px] font-bold text-slate-500 hover:text-black transition-colors uppercase tracking-[0.2em]">Philosophy</Link>
            <Link to="/blog" className="text-[10px] font-bold text-slate-500 hover:text-black transition-colors uppercase tracking-[0.2em]">Journal</Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-5">
            <Link to="/wishlist" className="text-slate-600 hover:text-black relative">
              <Heart size={20} />
              {savedCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {savedCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="text-slate-600 hover:text-black relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to={isLoggedIn ? "/dashboard" : "/auth"} className="text-slate-600 hover:text-black">
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 p-6 space-y-6 shadow-2xl animate-fade-in">
          <form onSubmit={handleSearch} className="relative">
             <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-lg py-3 px-10 text-sm focus:ring-2 focus:ring-black/5"
              />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </form>
          <div className="space-y-4 pt-4">
            <Link to="/shop" className="block text-sm font-bold uppercase tracking-widest text-slate-800" onClick={() => setIsOpen(false)}>Shop All</Link>
            <Link to="/about" className="block text-sm font-bold uppercase tracking-widest text-slate-800" onClick={() => setIsOpen(false)}>Philosophy</Link>
            <Link to="/blog" className="block text-sm font-bold uppercase tracking-widest text-slate-800" onClick={() => setIsOpen(false)}>Journal</Link>
            <Link to="/wishlist" className="block text-sm font-bold uppercase tracking-widest text-slate-800" onClick={() => setIsOpen(false)}>Wishlist</Link>
            {!isLoggedIn && (
              <>
                <Link to="/auth" className="block text-sm font-bold uppercase tracking-widest text-slate-800" onClick={() => setIsOpen(false)}>Log in</Link>
                <Link to="/register" className="block text-sm font-bold uppercase tracking-widest text-black border-b border-black pb-1" onClick={() => setIsOpen(false)}>Create account</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;