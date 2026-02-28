
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate as useRouteNavigate, useSearchParams, useLocation } from 'react-router-dom'; // Renamed useNavigate to useRouteNavigate to avoid conflict with local function
import Navbar from './components/Navbar';
import Home from './views/Home';
import ProductDetail from './views/ProductDetail';
import Cart from './views/Cart';
import Checkout from './views/Checkout';
import OrderPlaced from './views/OrderPlaced';
import UserDashboard from './views/UserDashboard'; // Renamed from Dashboard
import Philosophy from './views/Philosophy';
import Shop from './views/Shop';
import Support from './views/Support';
import AdminDashboard from './views/AdminDashboard';
import AdminAuth from './views/AdminAuth';
import ProductCard from './components/ProductCard';
import Blog from './views/Blog';
import { Product, CartItem, User, Order, BlogPost } from './types';
import { PRODUCTS as INITIAL_PRODUCTS, MOCK_ORDERS as INITIAL_ORDERS, ADMIN_CREDENTIALS } from './constants';
import { HelpCircle } from 'lucide-react';
import { api } from './api';

const AppContent: React.FC = () => { // Wrapper component to use useNavigate
  const navigate = useRouteNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const authFormRef = React.useRef<HTMLDivElement>(null);
  const authNameInputRef = React.useRef<HTMLInputElement>(null);

  const [products, setProducts] = React.useState<Product[]>(() => {
    const saved = localStorage.getItem('aura_products_db');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = React.useState<Order[]>(() => {
    const saved = localStorage.getItem('aura_orders_db');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [registeredUsers, setRegisteredUsers] = React.useState<User[]>(() => {
    const saved = localStorage.getItem('aura_users_db');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = React.useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aura-cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [savedItems, setSavedItems] = React.useState<string[]>(() => {
    const saved = localStorage.getItem('aura-saved');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = React.useState<User | null>(() => {
    const saved = localStorage.getItem('aura-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState<boolean>(() => {
    const saved = localStorage.getItem('aura-admin-logged-in');
    return saved ? JSON.parse(saved) : false;
  });

  const [blogPosts, setBlogPosts] = React.useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('aura_blog_db');
    return saved ? JSON.parse(saved) : [];
  });

  const [userOrders, setUserOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(api.isConfigured());
  const skipProductsSync = React.useRef(false);
  const skipOrdersSync = React.useRef(false);
  const skipBlogSync = React.useRef(false);

  const [isLoginMode, setIsLoginMode] = React.useState(true);
  const [authName, setAuthName] = React.useState('');
  const [authEmail, setAuthEmail] = React.useState('');
  const [authPassword, setAuthPassword] = React.useState('');
  const [authError, setAuthError] = React.useState('');

  // Sync auth mode with URL so /auth?mode=signup opens Create Account directly
  React.useEffect(() => {
    if (location.pathname === '/auth' || (location.pathname === '/' && window.location.hash.includes('/auth'))) {
      const mode = searchParams.get('mode');
      if (mode === 'signup') setIsLoginMode(false);
      else if (mode !== 'signup') setIsLoginMode(true);
    }
  }, [location.pathname, searchParams]);

  // When switching to sign-up, focus the name field and scroll form into view
  React.useEffect(() => {
    if (!isLoginMode && authFormRef.current) {
      authFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const t = setTimeout(() => authNameInputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [isLoginMode]);

  // When user logs in and API is configured, fetch their orders for dashboard
  React.useEffect(() => {
    if (!api.isConfigured() || !user?.email || isAdminLoggedIn) return;
    api.getOrders(false, user.email).then(setUserOrders).catch(() => setUserOrders([]));
  }, [user?.email, isAdminLoggedIn]);

  // Fetch initial data from API when configured
  React.useEffect(() => {
    if (!api.isConfigured()) return;
    (async () => {
      try {
        const [prods, blog] = await Promise.all([api.getProducts(), api.getBlogPosts()]);
        const ords = await api.getOrders(true).catch(() => []);
        const usersRes = await api.getUsers().catch(() => []);
        skipProductsSync.current = true;
        skipOrdersSync.current = true;
        skipBlogSync.current = true;
        setProducts(prods);
        setOrders(Array.isArray(ords) ? ords : []);
        setBlogPosts(blog);
        setRegisteredUsers(Array.isArray(usersRes) ? usersRes : []);
      } catch (e) {
        console.error('API initial load failed', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  React.useEffect(() => {
    if (api.isConfigured()) {
      if (skipProductsSync.current) { skipProductsSync.current = false; return; }
      api.setProducts(products).catch(console.error);
    } else {
      localStorage.setItem('aura_products_db', JSON.stringify(products));
    }
  }, [products]);

  React.useEffect(() => {
    if (api.isConfigured()) {
      if (skipOrdersSync.current) { skipOrdersSync.current = false; return; }
      api.setOrders(orders).catch(console.error);
    } else {
      localStorage.setItem('aura_orders_db', JSON.stringify(orders));
    }
  }, [orders]);

  // Real-time orders: sync when another tab updates orders (e.g. user places order)
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'aura_orders_db' && e.newValue) {
        try {
          const next = JSON.parse(e.newValue) as Order[];
          if (Array.isArray(next)) setOrders(next);
        } catch (_) { /* ignore */ }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // When admin tab gains focus, refresh orders from localStorage (catch any external updates)
  React.useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const raw = localStorage.getItem('aura_orders_db');
        if (raw) {
          try {
            const next = JSON.parse(raw) as Order[];
            if (Array.isArray(next)) setOrders(next);
          } catch (_) { /* ignore */ }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  React.useEffect(() => {
    if (!api.isConfigured()) localStorage.setItem('aura_users_db', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  React.useEffect(() => {
    if (api.isConfigured()) {
      if (skipBlogSync.current) { skipBlogSync.current = false; return; }
      api.setBlogPosts(blogPosts).catch(console.error);
    } else {
      localStorage.setItem('aura_blog_db', JSON.stringify(blogPosts));
    }
  }, [blogPosts]);

  React.useEffect(() => {
    localStorage.setItem('aura-cart', JSON.stringify(cart));
  }, [cart]);

  React.useEffect(() => {
    localStorage.setItem('aura-saved', JSON.stringify(savedItems));
  }, [savedItems]);

  React.useEffect(() => {
    localStorage.setItem('aura-admin-logged-in', JSON.stringify(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  const handleAddToCart = (product: Product, size?: string, color?: string, fit?: string) => {
    // Check global stock first
    const currentProduct = products.find(p => p.id === product.id);
    if (!currentProduct || currentProduct.stockCount <= 0) return;

    const selectedSize = size || product.sizes[0];
    const selectedColor = color || product.colors[0];
    const selectedFit = fit || (product.fits ? product.fits[0] : undefined);
    
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor &&
        item.selectedFit === selectedFit
      );
      
      if (existing) {
        // Ensure we don't exceed stock when adding more
        if (existing.quantity >= currentProduct.stockCount) return prev;

        return prev.map(item => 
          item.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor &&
          item.selectedFit === selectedFit
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize, selectedColor, selectedFit }];
    });
  };

  const updateCartItem = (id: string, oldSize: string, oldColor: string, updates: Partial<{selectedSize: string, selectedColor: string, quantity: number}>) => {
    setCart(prev => {
      const targetIndex = prev.findIndex(item => item.id === id && item.selectedSize === oldSize && item.selectedColor === oldColor);
      if (targetIndex === -1) return prev;

      const newCart = [...prev];
      const itemToUpdate = { ...newCart[targetIndex], ...updates };

      // Check for merging: if the new properties match another item in the cart
      const duplicateIndex = newCart.findIndex((item, idx) => 
        idx !== targetIndex && 
        item.id === itemToUpdate.id && 
        item.selectedSize === itemToUpdate.selectedSize && 
        item.selectedColor === itemToUpdate.selectedColor &&
        item.selectedFit === itemToUpdate.selectedFit
      );

      if (duplicateIndex !== -1) {
        // Merge with existing
        newCart[duplicateIndex].quantity += itemToUpdate.quantity;
        newCart.splice(targetIndex, 1);
      } else {
        newCart[targetIndex] = itemToUpdate;
      }

      return newCart;
    });
  };

  const updateQuantity = (id: string, size: string, color: string, delta: number) => {
    const productRef = products.find(p => p.id === id);
    if (!productRef) return;

    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size && item.selectedColor === color) {
        let newQty = item.quantity + delta;
        // Clamp between 1 and available stock
        newQty = Math.max(1, Math.min(newQty, productRef.stockCount));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string, size: string, color: string) => {
    setCart(prev => prev.filter(item => 
      !(item.id === id && item.selectedSize === size && item.selectedColor === color)
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const finalizeOrderStock = (cartItems: CartItem[]) => {
    setProducts(prev => prev.map(p => {
      const soldItem = cartItems.find(item => item.id === p.id);
      if (soldItem) {
        const newStock = Math.max(0, p.stockCount - soldItem.quantity);
        return { 
          ...p, 
          stockCount: newStock, 
          inStock: newStock > 0,
          salesCount: p.salesCount + soldItem.quantity 
        };
      }
      return p;
    }));
  };

  const handleOrderComplete = async (orderData: { total: number; email: string; paymentMethod: string; shippingCost: number }) => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      amount: orderData.total,
      status: 'Processing',
      items: cart.reduce((acc, item) => acc + item.quantity, 0),
      paymentMethod: orderData.paymentMethod,
      shippingCost: orderData.shippingCost,
      customerEmail: orderData.email || user?.email || 'guest@aura.com'
    };

    if (api.isConfigured()) {
      try {
        await api.createOrder(newOrder);
      } catch (e) {
        console.error(e);
        alert('Order could not be saved. Please try again.');
        return;
      }
    }

    setOrders(prev => [newOrder, ...prev]);
    if (user?.email && !isAdminLoggedIn) setUserOrders(prev => [newOrder, ...prev]);
    finalizeOrderStock(cart);
    clearCart();
  };

  const toggleSaved = (id: string) => {
    setSavedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (api.isConfigured()) {
      try {
        if (isLoginMode) {
          const { user: u } = await api.login(authEmail, authPassword);
          setUser(u);
          localStorage.setItem('aura-user', JSON.stringify(u));
          resetAuthForm();
        } else {
          const { user: u } = await api.register(authName, authEmail, authPassword);
          setUser(u);
          localStorage.setItem('aura-user', JSON.stringify(u));
          resetAuthForm();
        }
      } catch (err: any) {
        setAuthError(err?.message || 'Something went wrong.');
      }
      return;
    }

    if (isLoginMode) {
      const existingUser = registeredUsers.find(u => u.email === authEmail && (u as any).password === authPassword);
      
      if (existingUser) {
        const userSession: User = { 
          id: existingUser.id, 
          name: existingUser.name, 
          email: existingUser.email,
          joinedDate: existingUser.joinedDate 
        };
        setUser(userSession);
        localStorage.setItem('aura-user', JSON.stringify(userSession));
        resetAuthForm();
      } else {
        setAuthError('Invalid email or password.');
      }
    } else {
      if (registeredUsers.some(u => u.email === authEmail)) {
        setAuthError('An account with this email already exists.');
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: authName,
        email: authEmail,
        joinedDate: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
      };
      
      (newUser as any).password = authPassword;

      setRegisteredUsers(prev => [...prev, newUser]);
      
      setUser(newUser);
      localStorage.setItem('aura-user', JSON.stringify(newUser));
      resetAuthForm();
    }
  };

  const resetAuthForm = () => {
    setAuthName('');
    setAuthEmail('');
    setAuthPassword('');
    setAuthError('');
  };

  // State-only logout for regular users
  const logout = () => {
    setUser(null);
    localStorage.removeItem('aura-user');
    setIsLoginMode(true);
    resetAuthForm();
    // No navigation here, UserDashboard will handle the redirect if needed
  };

  // Admin Login/Logout Handlers
  const handleAdminLogin = async () => {
    if (api.isConfigured()) {
      try {
        await api.adminLogin(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
        const ords = await api.getOrders(true).catch(() => []);
        if (Array.isArray(ords)) {
          skipOrdersSync.current = true;
          setOrders(ords);
        }
        const usersRes = await api.getUsers().catch(() => []);
        if (Array.isArray(usersRes)) setRegisteredUsers(usersRes);
      } catch (err: any) {
        alert(err?.message || 'Admin login failed');
        return;
      }
    }
    setIsAdminLoggedIn(true);
    setUser({ id: 'admin', name: 'Administrator', email: ADMIN_CREDENTIALS.email });
  };

  const handleAdminLogout = () => {
    if (api.isConfigured()) api.adminLogout();
    setIsAdminLoggedIn(false);
    setUser(null);
    localStorage.removeItem('aura-user');
  };

  // State-only function to signal navigation to Admin Console
  const navigateToAdminConsole = () => {
    // UserDashboard will handle the actual navigation
    navigate('/admin/analytics');
  }


  if (api.isConfigured() && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar 
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} 
        savedCount={savedItems.length}
        isLoggedIn={!!user}
      />
      
      {/* Floating Help Button */}
      <Link to="/support" className="fixed bottom-8 right-8 z-[60] bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center group overflow-hidden">
         <HelpCircle size={20} />
         <span className="max-w-0 group-hover:max-w-xs transition-all duration-500 overflow-hidden whitespace-nowrap text-[10px] font-bold uppercase tracking-widest ml-0 group-hover:ml-3">Help Center</span>
      </Link>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} onToggleSaved={toggleSaved} savedItems={savedItems} products={products} />} />
          <Route path="/shop" element={<Shop onAddToCart={handleAddToCart} onToggleSaved={toggleSaved} savedItems={savedItems} products={products} />} />
          <Route path="/support" element={<Support />} />
          <Route path="/product/:id" element={<ProductDetail products={products} onAddToCart={handleAddToCart} onToggleSaved={toggleSaved} savedItems={savedItems} />} />
          <Route path="/cart" element={<Cart items={cart} products={products} user={user} onUpdateQuantity={updateQuantity} onUpdateItem={updateCartItem} onRemove={removeFromCart} />} />
          <Route path="/checkout" element={user ? <Checkout items={cart} onComplete={handleOrderComplete} /> : <Navigate to="/auth" replace />} />
          <Route path="/order-placed" element={<OrderPlaced />} />
          <Route path="/about" element={<Philosophy />} />
          <Route path="/blog" element={<Blog posts={blogPosts} />} />
          <Route path="/blog/:id" element={<Blog posts={blogPosts} />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={isAdminLoggedIn ? <Navigate to="/dashboard" /> : <AdminAuth onAdminLogin={handleAdminLogin} />} />
          <Route path="/admin/*" element={
            isAdminLoggedIn ? (
              <AdminDashboard 
                products={products} 
                setProducts={setProducts} 
                orders={orders} 
                setOrders={setOrders} 
                users={registeredUsers}
                blogPosts={blogPosts}
                setBlogPosts={setBlogPosts}
                onAdminLogout={handleAdminLogout}
              />
            ) : (
              <Navigate to="/admin/login" />
            )
          } />
          
          <Route path="/wishlist" element={
            <div className="pt-24 px-4 max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold tracking-tighter mb-12 uppercase italic">SAVED FOR LATER</h1>
              {savedItems.length === 0 ? (
                <div className="py-40 text-center">
                  <p className="text-slate-400 font-light mb-8 uppercase tracking-widest">No items saved yet.</p>
                  <Link to="/shop" className="bg-black text-white px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em]">Explore Collections</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
                  {products.filter(p => savedItems.includes(p.id)).map(p => (
                    <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onToggleSaved={toggleSaved} isSaved={true} />
                  ))}
                </div>
              )}
            </div>
          } />
          <Route path="/dashboard" element={
            user ? (
              <UserDashboard 
                user={user} 
                orders={isAdminLoggedIn ? orders : (api.isConfigured() ? userOrders : orders.filter(o => o.customerEmail === user.email))}
                onLogout={logout}
                isAdmin={isAdminLoggedIn} 
                onAdminLogout={handleAdminLogout}
                navigateToAdminConsole={navigateToAdminConsole}
              />
            ) : (
              <Navigate to="/auth" />
            )
          } />
          <Route path="/register" element={<Navigate to="/auth?mode=signup" replace />} />
          <Route path="/auth" element={
            user && !isAdminLoggedIn ? <Navigate to="/dashboard" /> : (
              <div ref={authFormRef} className="pt-32 flex justify-center px-4 pb-20">
                <div className="w-full max-w-md p-10 border border-slate-100 shadow-2xl rounded-2xl bg-white">
                  <h2 className="text-2xl font-bold mb-10 text-center tracking-[0.3em] uppercase italic">
                    {isLoginMode ? 'Member Login' : 'Join AURA'}
                  </h2>
                  
                  {authError && (
                    <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-[10px] font-bold tracking-widest uppercase rounded-md border border-rose-100">
                      {authError}
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit} className="space-y-6">
                    {!isLoginMode && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          ref={authNameInputRef}
                          required 
                          type="text" 
                          placeholder="Jane Doe" 
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          className="w-full border border-slate-100 bg-slate-50 p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-black/5 transition-all text-sm" 
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                      <input 
                        required 
                        type="email" 
                        placeholder="jane@example.com" 
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full border border-slate-100 bg-slate-50 p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-black/5 transition-all text-sm" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                      <input 
                        required 
                        type="password" 
                        placeholder="••••••••" 
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full border border-slate-100 bg-slate-50 p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-black/5 transition-all text-sm" 
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      className="w-full bg-black text-white py-5 font-bold tracking-[0.3em] uppercase text-[10px] rounded-xl hover:opacity-90 transition-all shadow-xl shadow-black/10 mt-4"
                    >
                      {isLoginMode ? 'Log In' : 'Create Account'}
                    </button>

                    <div className="flex flex-col items-center space-y-6 pt-6">
                      {isLoginMode ? (
                        <>
                          <button 
                            type="button" 
                            className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-black transition-colors"
                          >
                            Forgot Password?
                          </button>
                          <div className="w-12 h-px bg-slate-100"></div>
                          <button 
                            type="button" 
                            onClick={() => { setSearchParams({ mode: 'signup' }); setIsLoginMode(false); setAuthError(''); }}
                            className="text-[10px] font-bold text-black uppercase tracking-[0.2em] border-b border-black pb-1 hover:opacity-70 transition-opacity"
                          >
                            Create New Account
                          </button>
                        </>
                      ) : (
                        <button 
                          type="button" 
                          onClick={() => { setSearchParams({}); setIsLoginMode(true); setAuthError(''); }}
                          className="text-[10px] font-bold text-black uppercase tracking-[0.2em] border-b border-black pb-1 hover:opacity-70 transition-opacity"
                        >
                          Already a member? Login
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )
          } />
        </Routes>
      </main>

      <footer className="bg-black text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 border-b border-white/10 pb-16">
          <div className="col-span-1 md:col-span-1">
            <span className="text-3xl font-bold tracking-[0.4em]">AURA</span>
            <p className="mt-8 text-white/40 max-w-sm font-light leading-relaxed text-[11px] uppercase tracking-wider">
              Elevating the everyday through minimalist design and intentional craftsmanship.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-10 text-white/30 italic">Explore Collections</h4>
            <ul className="space-y-5 text-[10px] font-bold uppercase tracking-widest">
              <li><Link to="/shop" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white text-white/50 transition-colors">Shop All</Link></li>
              <li><Link to="/shop?gender=Men" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white text-white/50 transition-colors">Men's Wardrobe</Link></li>
              <li><Link to="/shop?gender=Women" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white text-white/50 transition-colors">Women's Wardrobe</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-10 text-white/30 italic">Concierge & Care</h4>
            <ul className="space-y-5 text-[10px] font-bold uppercase tracking-widest">
              <li><Link to="/support" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white text-white/50 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/support" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white text-white/50 transition-colors">Contact Support</Link></li>
              <li><Link to="/support" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white text-white/50 transition-colors">Exchange Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-10 text-white/30 italic">Connect with Aura</h4>
            <ul className="space-y-5 text-[10px] font-bold uppercase tracking-widest">
              <li><a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white text-white/50 transition-colors">Instagram</a></li>
              <li><Link to="/blog" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white text-white/50 transition-colors">Journal</Link></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white text-white/50 transition-colors">Newsletter</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 flex flex-col sm:flex-row justify-between items-center text-[8px] text-white/20 tracking-[0.5em] uppercase">
          <p>&copy; 2026 Aura Apparel Inc. Consciously Produced.</p>
          <div className="flex gap-8 mt-6 sm:mt-0">
             <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white/60 transition-colors">Privacy</a>
             <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white/60 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App component that wraps AppContent with HashRouter
const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
