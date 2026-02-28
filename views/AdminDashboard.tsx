
import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Product, Order, AdminNotification, User, BlogPost } from '../types';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Plus, 
  Search, 
  MoreHorizontal,
  ArrowUpRight,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  Mail,
  Zap,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Globe,
  Settings,
  X,
  LogOut,
  Filter,
  Download,
  Activity,
  ArrowDownRight,
  CreditCard,
  Image as ImageIcon,
  Leaf,
  Info,
  Box,
  Layers,
  Calendar,
  Hash,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area
} from 'recharts';

interface AdminDashboardProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  users: User[];
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  onAdminLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, setProducts, orders, setOrders, users, blogPosts, setBlogPosts, onAdminLogout }) => {
  const location = useLocation();
  const [notifications, setNotifications] = React.useState<AdminNotification[]>([]);
  const [activeTab, setActiveTab] = React.useState(location.pathname.split('/').pop() || 'analytics');
  const [isEditingProduct, setIsEditingProduct] = React.useState<Product | null>(null);

  React.useEffect(() => {
    setActiveTab(location.pathname.split('/').pop() || 'analytics');
  }, [location.pathname]);

  const addNotification = (message: string, type: AdminNotification['type'] = 'system') => {
    const newNotif: AdminNotification = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 8));
  };

  const lastOrderCount = React.useRef(orders.length);
  const lastUserCount = React.useRef(users.length);

  React.useEffect(() => {
    if (orders.length > lastOrderCount.current) {
      const latestOrder = orders[0];
      addNotification(`Transaction Completed: ${latestOrder.id} for ₹${latestOrder.amount}`, 'order');
      lastOrderCount.current = orders.length;
    }
    if (users.length > lastUserCount.current) {
      const latestUser = users[users.length - 1];
      addNotification(`New Collector Registered: ${latestUser.name}`, 'system');
      lastUserCount.current = users.length;
    }
  }, [orders, users]);

  const deleteProduct = (id: string) => {
    if (confirm('Are you sure you want to remove this piece from the collection?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      addNotification(`Piece #${id} archived from collection`, 'inventory');
    }
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        addNotification(`Order ${id} marked as ${status}`, 'order');
        return { ...o, status };
      }
      return o;
    }));
  };

  const deleteOrder = (id: string) => {
    if (confirm('Remove this order from the record? This cannot be undone.')) {
      setOrders(prev => prev.filter(o => o.id !== id));
      addNotification(`Order ${id} removed from record`, 'order');
    }
  };

  const handleUpdateStock = (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stockCount: newStock, inStock: newStock > 0 } : p));
    addNotification(`Stock updated for Piece #${id}`, 'inventory');
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === updatedProduct.id);
      if (exists) {
        return prev.map(p => p.id === updatedProduct.id ? updatedProduct : p);
      }
      return [updatedProduct, ...prev];
    });
    setIsEditingProduct(null);
    addNotification(`Product ${updatedProduct.name} successfully updated.`, 'system');
  };

  const handleCreateNew = () => {
    const newProduct: Product = {
      id: Math.floor(Math.random() * 10000).toString(),
      name: '',
      price: 0,
      category: 'Tops',
      gender: 'Unisex',
      style: 'Minimalist',
      description: '',
      image: '',
      gallery: [],
      sustainabilityTags: [],
      sizes: ['S', 'M', 'L'],
      colors: ['Neutral'],
      fabric: '',
      fabricType: 'Cotton',
      care: '',
      fitDescription: '',
      inStock: true,
      stockCount: 1,
      salesCount: 0
    };
    setIsEditingProduct(newProduct);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 bg-[#0D0D0D] flex flex-col pt-24 shrink-0">
        <div className="px-6 mb-12 flex items-center justify-between">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.5em]">Command</span>
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-white/10 rounded-full"></div>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1 px-3">
          {[
            { id: 'analytics', label: 'Overview', icon: BarChart3, path: '/admin/analytics' },
            { id: 'products', label: 'Collection', icon: Package, path: '/admin/products' },
            { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
            { id: 'inventory', label: 'Stock Levels', icon: LayoutDashboard, path: '/admin/inventory' },
            { id: 'blog', label: 'Blog', icon: FileText, path: '/admin/blog' },
            { id: 'users', label: 'Customers', icon: Users, path: '/admin/users' },
          ].map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === item.id ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-white/5 bg-black/20">
           <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Global Activity</span>
              <Activity size={12} className="text-emerald-500 animate-pulse" />
           </div>
           <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar pr-2">
              {notifications.map(n => (
                <div key={n.id} className="text-[8px] uppercase tracking-widest border-l border-white/10 pl-3 py-1 animate-fade-in">
                   <p className="text-white/30 mb-0.5">{n.timestamp}</p>
                   <p className="text-white/70 leading-relaxed">{n.message}</p>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-[8px] uppercase tracking-widest text-white/10 italic">Awaiting events...</p>
              )}
           </div>
        </div>

        <div className="p-6 border-t border-white/5">
          <Link to="/" className="text-[10px] font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest flex items-center">
            Exit Control <ArrowUpRight size={12} className="ml-1" />
          </Link>
          <button onClick={onAdminLogout} className="mt-4 w-full flex items-center space-x-3 px-4 py-3 text-rose-600 hover:bg-rose-900/10 rounded-xl text-xs font-bold uppercase tracking-widest">
            <LogOut size={16} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto pt-24 px-10 pb-20 custom-scrollbar">
        <Routes>
          <Route path="/" element={<Navigate to="analytics" />} />
          <Route path="analytics" element={<AnalyticsView products={products} orders={orders} users={users} />} />
          <Route path="products" element={<ProductsView products={products} onDelete={deleteProduct} onEdit={setIsEditingProduct} onCreate={handleCreateNew} />} />
          <Route path="orders" element={<OrdersView orders={orders} users={users} onStatusChange={updateOrderStatus} onDeleteOrder={deleteOrder} />} />
          <Route path="inventory" element={<InventoryView products={products} onUpdateStock={handleUpdateStock} />} />
          <Route path="blog" element={<AdminBlogView posts={blogPosts} setPosts={setBlogPosts} />} />
          <Route path="users" element={<UsersView users={users} orders={orders} />} />
        </Routes>
      </main>

      {isEditingProduct && (
        <ProductEditor 
          product={isEditingProduct} 
          onSave={handleSaveProduct} 
          onClose={() => setIsEditingProduct(null)} 
        />
      )}
    </div>
  );
};

// --- Specialized Components ---

interface ProductEditorProps {
  product: Product;
  onSave: (p: Product) => void;
  onClose: () => void;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = React.useState<Product>({ ...product });
  const [activeTab, setActiveTab] = React.useState<'core' | 'media' | 'logistics' | 'impact'>('core');
  const [newTag, setNewTag] = React.useState('');
  const [newImg, setNewImg] = React.useState('');

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    setFormData(prev => ({
      ...prev,
      sustainabilityTags: [...(prev.sustainabilityTags || []), newTag.trim()]
    }));
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      sustainabilityTags: prev.sustainabilityTags?.filter(t => t !== tag)
    }));
  };

  const handleAddImage = () => {
    if (!newImg.trim()) return;
    setFormData(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), newImg.trim()]
    }));
    setNewImg('');
  };

  const removeImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery?.filter(u => u !== url)
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
       <div className="bg-[#0D0D0D] w-full max-w-4xl h-[85vh] rounded-[40px] border border-white/5 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
          {/* Editor Header */}
          <div className="px-12 pt-12 pb-8 flex justify-between items-start border-b border-white/5">
             <div>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] mb-2 block">
                  {product.name ? 'Edit product' : 'Add new product'}
                </span>
                <h2 className="text-3xl font-bold uppercase italic tracking-tighter">
                  {formData.name || 'Untitled Garment'}
                </h2>
             </div>
             <button onClick={onClose} className="p-4 bg-white/5 text-white/30 hover:text-white rounded-full transition-all">
                <X size={24} />
             </button>
          </div>

          {/* Navigation */}
          <div className="px-12 py-4 bg-black/20 flex space-x-10">
             {[
               { id: 'core', label: 'Basic Metadata', icon: Info },
               { id: 'media', label: 'Media Assets', icon: ImageIcon },
               { id: 'logistics', label: 'Inventory Control', icon: Box },
               { id: 'impact', label: 'Sustainability', icon: Leaf }
             ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-3 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
                    activeTab === tab.id ? 'text-white' : 'text-white/20 hover:text-white/50'
                  }`}
                >
                  <tab.icon size={14} />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-px bg-white animate-fade-in"></div>}
                </button>
             ))}
          </div>

          {/* Editor Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-12 py-10">
             {activeTab === 'core' && (
                <div className="space-y-10 animate-fade-in">
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Display Name</label>
                         <input 
                           type="text" 
                           value={formData.name}
                           onChange={e => setFormData({...formData, name: e.target.value})}
                           className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-xs font-bold uppercase tracking-widest focus:border-white/20 outline-none"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Price Point (INR)</label>
                         <input 
                           type="number" 
                           value={formData.price}
                           onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                           className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-xs font-bold uppercase tracking-widest focus:border-white/20 outline-none"
                         />
                      </div>
                   </div>
                   <div className="grid grid-cols-3 gap-8">
                      <div className="space-y-2">
                         <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Category</label>
                         <select 
                           value={formData.category}
                           onChange={e => setFormData({...formData, category: e.target.value})}
                           className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-xs font-bold uppercase tracking-widest focus:border-white/20 outline-none"
                         >
                            <option value="Tops">Tops</option>
                            <option value="Bottoms">Bottoms</option>
                            <option value="Outerwear">Outerwear</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Knitwear">Knitwear</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Gender Segment</label>
                         <select 
                           value={formData.gender}
                           onChange={e => setFormData({...formData, gender: e.target.value as any})}
                           className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-xs font-bold uppercase tracking-widest focus:border-white/20 outline-none"
                         >
                            <option value="Unisex">Unisex</option>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Kids">Kids</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Style Aesthetic</label>
                         <select 
                           value={formData.style}
                           onChange={e => setFormData({...formData, style: e.target.value as any})}
                           className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-xs font-bold uppercase tracking-widest focus:border-white/20 outline-none"
                         >
                            <option value="Minimalist">Minimalist</option>
                            <option value="Streetwear">Streetwear</option>
                            <option value="Formal">Formal</option>
                            <option value="Loungewear">Loungewear</option>
                         </select>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Narrative Description</label>
                      <textarea 
                        rows={5}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-xs font-light tracking-wide focus:border-white/20 outline-none leading-relaxed"
                      />
                   </div>
                </div>
             )}

             {activeTab === 'media' && (
                <div className="space-y-12 animate-fade-in">
                   <div className="space-y-4">
                      <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Hero Asset URL</label>
                      <div className="flex space-x-6">
                         <div className="w-24 h-32 bg-white/5 rounded-xl border border-white/5 overflow-hidden shrink-0">
                            <img src={formData.image} className="w-full h-full object-cover grayscale" />
                         </div>
                         <input 
                           type="text" 
                           value={formData.image}
                           onChange={e => setFormData({...formData, image: e.target.value})}
                           placeholder="https://..."
                           className="flex-1 bg-white/5 border border-white/5 p-5 rounded-2xl text-xs font-mono tracking-tight focus:border-white/20 outline-none h-fit"
                         />
                      </div>
                   </div>

                   <div className="space-y-6">
                      <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Gallery Collection</label>
                      <div className="grid grid-cols-4 gap-6">
                         {formData.gallery?.map((url, i) => (
                            <div key={i} className="relative group">
                               <div className="aspect-[3/4] bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                                  <img src={url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                               </div>
                               <button 
                                 onClick={() => removeImage(url)}
                                 className="absolute -top-2 -right-2 p-2 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                               >
                                  <Trash2 size={12} />
                               </button>
                            </div>
                         ))}
                         <div className="aspect-[3/4] bg-white/5 rounded-2xl border border-dashed border-white/10 flex items-center justify-center">
                            <div className="text-center">
                               <Plus size={20} className="text-white/20 mx-auto mb-2" />
                               <span className="text-[8px] font-bold uppercase tracking-widest text-white/10">Add View</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <input 
                           type="text" 
                           value={newImg}
                           onChange={e => setNewImg(e.target.value)}
                           placeholder="Paste additional image URL..."
                           className="flex-1 bg-white/5 border border-white/5 p-4 rounded-xl text-xs font-mono tracking-tight focus:border-white/20 outline-none"
                         />
                         <button onClick={handleAddImage} className="px-8 py-4 bg-white/10 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-white/20">Append</button>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'logistics' && (
                <div className="space-y-12 animate-fade-in">
                   <div className="grid grid-cols-2 gap-12">
                      <div className="space-y-8">
                         <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                            <div className="flex justify-between items-center mb-6">
                               <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Master Stock</h4>
                               <Box size={16} className="text-white/20" />
                            </div>
                            <div className="flex items-center space-x-8">
                               <span className="text-6xl font-mono font-bold tracking-tighter">{formData.stockCount}</span>
                               <div className="flex-1 flex space-x-2">
                                  <button onClick={() => setFormData({...formData, stockCount: Math.max(0, formData.stockCount - 1)})} className="flex-1 bg-white/5 py-4 rounded-xl border border-white/5 hover:bg-white/10 text-xl font-bold">-</button>
                                  <button onClick={() => setFormData({...formData, stockCount: formData.stockCount + 1})} className="flex-1 bg-white/10 py-4 rounded-xl border border-white/5 hover:bg-white/20 text-xl font-bold">+</button>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center space-x-3 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                            <ShieldCheck size={16} className="text-emerald-500" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">Auto-update Visibility Enabled</span>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Fabric Composition</label>
                            <input 
                              type="text" 
                              value={formData.fabric}
                              onChange={e => setFormData({...formData, fabric: e.target.value})}
                              placeholder="e.g. 100% GOTS Cotton"
                              className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-xs font-bold uppercase tracking-widest focus:border-white/20 outline-none"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Anatomical Fit</label>
                            <textarea 
                              rows={3}
                              value={formData.fitDescription}
                              onChange={e => setFormData({...formData, fitDescription: e.target.value})}
                              placeholder="Detailed fit instructions..."
                              className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-xs font-light tracking-wide focus:border-white/20 outline-none"
                            />
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'impact' && (
                <div className="space-y-12 animate-fade-in">
                   <header className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20">
                         <Leaf size={32} className="text-emerald-500" />
                      </div>
                      <div>
                         <h3 className="text-xl font-bold uppercase italic tracking-tighter">Sustainability Ethics</h3>
                         <p className="text-[9px] text-white/30 uppercase tracking-[0.4em] mt-1">Ethical Sourcing & Production Metrics</p>
                      </div>
                   </header>

                   <div className="space-y-8">
                      <div className="space-y-4">
                         <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Impact Tags</label>
                         <div className="flex flex-wrap gap-3">
                            {formData.sustainabilityTags?.map(tag => (
                               <span key={tag} className="flex items-center bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-emerald-500/20">
                                  {tag}
                                  <button onClick={() => removeTag(tag)} className="ml-3 hover:text-white transition-colors"><X size={12} /></button>
                               </span>
                            ))}
                            {(!formData.sustainabilityTags || formData.sustainabilityTags.length === 0) && (
                               <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest py-2 italic">No tags assigned yet...</span>
                            )}
                         </div>
                         <div className="flex gap-4 pt-4">
                            <input 
                              type="text" 
                              value={newTag}
                              onChange={e => setNewTag(e.target.value)}
                              placeholder="Add tag (e.g. Recycled)..."
                              className="flex-1 bg-white/5 border border-white/5 p-4 rounded-xl text-xs font-bold uppercase tracking-widest focus:border-white/20 outline-none"
                            />
                            <button onClick={handleAddTag} className="px-8 py-4 bg-white/10 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-white/20">Add</button>
                         </div>
                      </div>

                      <div className="p-8 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                         <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Common Certifications</h4>
                         <div className="flex gap-4">
                            {['Organic Cotton', 'Ethical Labor', 'Carbon Neutral', 'Vegan', 'Fair Trade'].map(c => (
                               <button 
                                 key={c}
                                 onClick={() => !formData.sustainabilityTags?.includes(c) && setFormData({...formData, sustainabilityTags: [...(formData.sustainabilityTags || []), c]})}
                                 className="px-4 py-2 border border-white/10 text-[8px] font-bold uppercase tracking-widest rounded-lg hover:bg-white/5 transition-colors"
                               >
                                  {c}
                               </button>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             )}
          </div>

          {/* Editor Footer */}
          <div className="px-12 py-10 bg-black/40 border-t border-white/5 flex justify-between items-center">
             <div className="flex items-center space-x-6">
                <div className="flex -space-x-3">
                   {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-white/10 flex items-center justify-center text-[10px] font-bold">A</div>)}
                </div>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">3 Collaborative Edits Today</span>
             </div>
             <div className="flex space-x-6">
                <button onClick={onClose} className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Discard Draft</button>
                <button 
                  onClick={() => onSave(formData)}
                  className="px-12 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] rounded-2xl shadow-xl shadow-white/5 hover:bg-slate-200 transition-all"
                >
                  Save & Synchronize
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

const AnalyticsView = ({ products, orders, users }: { products: Product[], orders: Order[], users: User[] }) => {
  const revenue = orders.reduce((acc, o) => acc + o.amount, 0);
  const bestSellers = [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 3);
  const lowStockCount = products.filter(p => p.stockCount < 5).length;
  const inventoryValue = products.reduce((acc, p) => acc + (p.price * p.stockCount), 0);

  const funnelData = [
    { name: 'Catalogue Views', value: 5200, fill: '#111' },
    { name: 'Intent to Buy', value: 1200, fill: '#222' },
    { name: 'Checkout Pipeline', value: 450, fill: '#444' },
    { name: 'Finalized Transactions', value: orders.length, fill: '#fff' },
  ];

  const getDailySales = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dayName = days[d.getDay()];
      const dayOrders = orders.filter(o => {
         const oDate = new Date(o.date);
         return oDate.getDate() === d.getDate() && oDate.getMonth() === d.getMonth();
      });
      const dayTotal = dayOrders.reduce((acc, o) => acc + o.amount, 0);
      result.push({ name: dayName, sales: dayTotal });
    }
    return result;
  };

  const salesData = getDailySales();

  return (
    <div className="animate-fade-in space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-5xl font-bold tracking-tighter uppercase italic mb-2">Market Pulse</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.4em]">Real-Time Operational Intelligence</p>
        </div>
        <div className="flex gap-10">
           <div className="text-right">
              <p className="text-[9px] font-bold text-white/20 uppercase mb-2 tracking-widest">Aggregate Revenue</p>
              <p className="text-3xl font-mono font-bold tracking-tighter text-emerald-400">₹{revenue.toLocaleString('en-IN')}</p>
           </div>
           <div className="text-right">
              <p className="text-[9px] font-bold text-white/20 uppercase mb-2 tracking-widest">Active Collectors</p>
              <p className="text-3xl font-mono font-bold tracking-tighter">{users.length}</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-[#121212] p-10 rounded-3xl border border-white/5 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-center mb-12 relative z-10">
             <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 flex items-center">
                <TrendingUp size={14} className="mr-3 text-emerald-500" /> Revenue Stream (7D)
             </h3>
             <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Live Flow</span>
             </div>
          </div>
          <div className="h-80 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fff" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#444" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#333'}} />
                <YAxis stroke="#444" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#333'}} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', padding: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  cursor={{ stroke: '#fff', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#fff" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#121212] p-10 rounded-3xl border border-white/5 flex flex-col justify-between">
           <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-12 text-white/40">Market Velocity</h3>
           <div className="space-y-8">
              {funnelData.map((stage, i) => (
                <div key={stage.name} className="relative group">
                   <div className="flex justify-between items-end mb-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">{stage.name}</span>
                      <span className="text-xs font-mono font-bold">{stage.value}</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-1000" 
                        style={{ width: `${(stage.value / funnelData[0].value) * 100}%`, opacity: 1 - (i * 0.2) }}
                      ></div>
                   </div>
                </div>
              ))}
           </div>
           <div className="pt-10 mt-10 border-t border-white/5 flex justify-between items-baseline">
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest italic">Aura Conversion</span>
              <span className="text-2xl font-mono font-bold text-white">{((orders.length / funnelData[0].value) * 100).toFixed(1)}%</span>
           </div>
        </div>

        <div className="lg:col-span-4 bg-[#121212] p-10 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
           <div className="flex justify-between items-start mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Inventory Value</h3>
              <Package size={20} className="text-white/20" />
           </div>
           <div className="space-y-4">
              <p className="text-4xl font-mono font-bold tracking-tighter">₹{(inventoryValue / 100000).toFixed(1)}L</p>
              <div className="flex items-center space-x-2 text-[9px] font-bold text-rose-500 uppercase tracking-widest">
                 <AlertTriangle size={12} />
                 <span>{lowStockCount} Assets below critical threshold</span>
              </div>
           </div>
        </div>

        <div className="lg:col-span-8 bg-[#121212] p-10 rounded-3xl border border-white/5">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Recent Pulse</h3>
              <button className="text-[9px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">Audit Feed</button>
           </div>
           <div className="space-y-6">
              {orders.slice(0, 4).map((order) => (
                 <div key={order.id} className="flex items-center justify-between group animate-fade-in">
                    <div className="flex items-center space-x-6">
                       <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                          <CreditCard size={14} className="text-white/30" />
                       </div>
                       <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider group-hover:text-emerald-400 transition-colors">Transaction finalizing: #{order.id}</p>
                          <p className="text-[9px] text-white/20 uppercase tracking-widest mt-0.5">{order.customerEmail} • {order.items} Items</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[11px] font-mono font-bold tracking-tight">₹{order.amount.toLocaleString('en-IN')}</p>
                       <p className="text-[8px] text-white/10 uppercase tracking-widest mt-0.5">{order.date}</p>
                    </div>
                 </div>
              ))}
              {orders.length === 0 && <p className="text-[10px] text-white/20 italic uppercase tracking-widest text-center py-10">Waiting for first transaction...</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

const PRODUCT_CATEGORIES = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Knitwear'] as const;

const ProductsView = ({ products, onDelete, onEdit, onCreate }: { products: Product[], onDelete: (id: string) => void, onEdit: (p: Product) => void, onCreate: () => void }) => {
  const [categoryFilter, setCategoryFilter] = React.useState<string>('All');
  const filteredByCategory = categoryFilter === 'All' ? products : products.filter(p => p.category === categoryFilter);

  return (
    <div className="animate-fade-in space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold tracking-tighter uppercase italic">Collection</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] mt-1">By category · Lifecycle & refinement</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mr-2">Category:</span>
            {PRODUCT_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest rounded-full border transition-all ${categoryFilter === cat ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button 
            onClick={onCreate}
            className="bg-white text-black px-10 py-5 text-[10px] font-bold uppercase tracking-widest flex items-center space-x-3 rounded-2xl hover:bg-slate-200 transition-all shadow-xl shadow-white/5 shrink-0"
          >
            <Plus size={18} />
            <span>Add new product</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredByCategory.map(product => (
          <div key={product.id} className="bg-[#121212] border border-white/5 rounded-[32px] p-8 flex items-center space-x-12 hover:border-white/10 transition-all group overflow-hidden relative">
            <div className="w-24 h-32 bg-black rounded-2xl overflow-hidden shrink-0 border border-white/5 relative">
              <img src={product.image} className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 group-hover:scale-110" alt="" />
              <div className="absolute top-2 right-2 flex space-x-1">
                 {product.sustainabilityTags?.slice(0, 1).map(t => (
                    <div key={t} className="p-1.5 bg-emerald-500 rounded-full shadow-lg">
                       <Leaf size={10} className="text-white" />
                    </div>
                 ))}
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-2">
                <h4 className="text-lg font-bold tracking-widest uppercase mb-1">{product.name}</h4>
                <div className="flex items-center space-x-4 mb-4">
                   <span className="text-[10px] text-white/30 uppercase tracking-widest">{product.category}</span>
                   <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                   <span className="text-[10px] text-white/30 uppercase tracking-widest">SKU-{product.id.padStart(4, '0')}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                   {product.sustainabilityTags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[8px] font-bold uppercase tracking-widest px-3 py-1 bg-emerald-500/5 text-emerald-500 rounded-md border border-emerald-500/10">
                         {tag}
                      </span>
                   ))}
                </div>
              </div>
              <div className="flex flex-col justify-center">
                 <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Asset Value</p>
                 <p className="text-xl font-mono font-bold tracking-tighter text-white">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
              <div className="flex flex-col justify-center">
                 <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Allocation</p>
                 <div className="flex items-center space-x-3">
                    <span className="text-xl font-mono font-bold text-white">{product.stockCount}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest ${product.stockCount > 5 ? 'text-emerald-500 bg-emerald-500/5' : 'text-rose-500 bg-rose-500/5'}`}>
                       {product.stockCount > 5 ? 'Stable' : 'Critical'}
                    </span>
                 </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3 relative z-10">
              <button 
                onClick={() => onEdit(product)} 
                className="p-5 bg-white/5 text-white/30 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-white/5"
                title="Edit Product"
              >
                <Edit3 size={20} />
              </button>
              <button 
                onClick={() => onDelete(product.id)} 
                className="p-5 bg-white/5 text-white/30 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all border border-white/5"
                title="Archive Product"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        {filteredByCategory.length === 0 && (
          <div className="bg-[#121212] border border-white/5 rounded-[32px] p-16 text-center">
            <Package size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {categoryFilter === 'All' ? 'No products in collection.' : `No products in category "${categoryFilter}".`}
            </p>
            <button onClick={onCreate} className="mt-6 bg-white text-black px-8 py-4 text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">
              Add new product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const OrdersView = ({ orders, users, onStatusChange, onDeleteOrder }: { orders: Order[], users: User[], onStatusChange: (id: string, s: Order['status']) => void, onDeleteOrder: (id: string) => void }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [auditFor, setAuditFor] = React.useState<{ user: User | null; email: string } | null>(null);

  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.customerEmail || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCollectorForOrder = (order: Order) => {
    const email = (order.customerEmail || '').toLowerCase();
    return users.find(u => (u.email || '').toLowerCase() === email) || null;
  };

  return (
    <div className="animate-fade-in space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tighter uppercase italic">Orders</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] mt-1">Audit Trail & Fulfillment · Linked to Collectors</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            placeholder="Search transaction ID or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121212] border border-white/5 p-5 pl-14 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:border-white/20 outline-none transition-all"
          />
        </div>
      </header>

      <div className="overflow-x-auto bg-[#121212] rounded-[40px] border border-white/5 p-12">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              <th className="pb-10 text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center">
                <Hash size={12} className="mr-2" /> ID
              </th>
              <th className="pb-10 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                Collector
              </th>
              <th className="pb-10 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                <Calendar size={12} className="inline mr-2" /> Date
              </th>
              <th className="pb-10 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                Net Value
              </th>
              <th className="pb-10 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                Fulfillment
              </th>
              <th className="pb-10 text-right text-[10px] font-bold text-white/30 uppercase tracking-widest">
                Command
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredOrders.map(order => {
              const collector = getCollectorForOrder(order);
              return (
                <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-10 font-mono text-xs tracking-widest text-white/60">#{order.id}</td>
                  <td className="py-10">
                    <div className="flex flex-col">
                      <p className="text-[11px] font-bold uppercase tracking-wider">
                        {collector ? collector.name : 'Guest'}
                      </p>
                      <p className="text-[10px] text-white/40 lowercase italic mt-0.5">{order.customerEmail}</p>
                      <span className="text-[8px] text-white/10 uppercase tracking-widest mt-1">{order.items} items</span>
                      <button
                        type="button"
                        onClick={() => setAuditFor({ user: collector, email: order.customerEmail || '' })}
                        className="text-[9px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors mt-2 flex items-center"
                      >
                        View collector <ChevronRight size={12} className="ml-0.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-10">
                    <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-tighter italic">
                      {order.date}
                    </span>
                  </td>
                  <td className="py-10 text-sm font-bold tracking-tighter">
                    ₹{order.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-10">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                      order.status === 'Delivered' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                      order.status === 'Cancelled' ? 'border-rose-500/20 text-rose-400 bg-rose-500/5' :
                      'border-amber-500/20 text-amber-400 bg-amber-500/5'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-10 text-right flex items-center justify-end gap-3">
                    <select
                      value={order.status}
                      onChange={(e) => onStatusChange(order.id, e.target.value as Order['status'])}
                      className="bg-black border border-white/10 text-[10px] uppercase font-bold tracking-widest rounded-xl px-4 py-3 focus:border-white transition-all cursor-pointer"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => onDeleteOrder(order.id)}
                      className="p-3 bg-white/5 text-white/30 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl border border-white/5 transition-all"
                      title="Remove order from record"
                    >
                      <X size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em]">No matching transactions found in history.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {auditFor && (
        <AuditHistoryModal
          user={auditFor.user}
          email={auditFor.email}
          orders={orders.filter(o => (o.customerEmail || '').toLowerCase() === auditFor.email.toLowerCase())}
          onClose={() => setAuditFor(null)}
        />
      )}
    </div>
  );
};

const InventoryView = ({ products, onUpdateStock }: { products: Product[], onUpdateStock: (id: string, s: number) => void }) => {
  return (
    <div className="animate-fade-in space-y-12">
      <h2 className="text-4xl font-bold tracking-tighter uppercase italic">Stock Pipeline</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(p => (
          <div key={p.id} className="bg-[#121212] p-10 rounded-[40px] border border-white/5 relative group hover:border-white/10 transition-all">
            <div className="flex items-center space-x-6 mb-10">
              <img src={p.image} className="w-16 h-20 object-cover rounded-2xl border border-white/5 grayscale group-hover:grayscale-0 transition-all" alt="" />
              <div>
                 <h4 className="text-[11px] font-bold uppercase tracking-widest max-w-[140px] leading-relaxed mb-1">{p.name}</h4>
                 <span className="text-[9px] font-mono text-white/20 block uppercase tracking-tighter">SKU-{p.id.padStart(4, '0')}</span>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                 <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Available Pieces</p>
                 <p className={`text-5xl font-mono font-bold tracking-tighter ${p.stockCount < 5 ? 'text-rose-500' : 'text-white'}`}>{p.stockCount}</p>
              </div>
              <div className="flex flex-col space-y-2">
                 <button onClick={() => onUpdateStock(p.id, p.stockCount + 1)} className="p-4 bg-white/5 hover:bg-white text-white hover:text-black rounded-xl border border-white/5 transition-all text-xl font-bold">+</button>
                 <button onClick={() => onUpdateStock(p.id, Math.max(0, p.stockCount - 1))} className="p-4 bg-white/5 hover:bg-rose-500 text-white hover:text-white rounded-xl border border-white/5 transition-all text-xl font-bold">-</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UsersView = ({ users, orders }: { users: User[], orders: Order[] }) => {
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'name' | 'joined' | 'orders' | 'value'>('name');
  const [auditUser, setAuditUser] = React.useState<User | null>(null);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const usersWithStats = React.useMemo(() => {
    return filteredUsers.map(user => {
      const userOrders = orders.filter(o => (o.customerEmail || '').toLowerCase() === (user.email || '').toLowerCase());
      const orderCount = userOrders.length;
      const lifetimeValue = userOrders.reduce((sum, o) => sum + o.amount, 0);
      return { user, orderCount, lifetimeValue, userOrders };
    });
  }, [filteredUsers, orders]);

  const sorted = React.useMemo(() => {
    const list = [...usersWithStats];
    switch (sortBy) {
      case 'name': list.sort((a, b) => a.user.name.localeCompare(b.user.name)); break;
      case 'joined': list.sort((a, b) => (b.user.joinedDate || '').localeCompare(a.user.joinedDate || '')); break;
      case 'orders': list.sort((a, b) => b.orderCount - a.orderCount); break;
      case 'value': list.sort((a, b) => b.lifetimeValue - a.lifetimeValue); break;
    }
    return list;
  }, [usersWithStats, sortBy]);

  return (
    <div className="animate-fade-in space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tighter uppercase italic">The Collective</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] mt-1">Collector Identity Management</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#121212] border border-white/10 text-[10px] font-bold uppercase tracking-widest rounded-xl px-4 py-3 focus:border-white/20 outline-none"
          >
            <option value="name">Sort: Name</option>
            <option value="joined">Sort: Member since</option>
            <option value="orders">Sort: Orders</option>
            <option value="value">Sort: Lifetime value</option>
          </select>
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              placeholder="Search identity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121212] border border-white/5 p-5 pl-14 rounded-2xl text-xs font-bold uppercase tracking-widest focus:border-white/20 outline-none transition-all"
            />
          </div>
        </div>
      </header>

      <div className="bg-[#121212] rounded-[40px] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              <th className="p-10 text-[10px] font-bold text-white/30 uppercase tracking-widest">Collector Profile</th>
              <th className="p-10 text-[10px] font-bold text-white/30 uppercase tracking-widest">Member Since</th>
              <th className="p-10 text-[10px] font-bold text-white/30 uppercase tracking-widest">Orders</th>
              <th className="p-10 text-[10px] font-bold text-white/30 uppercase tracking-widest">Lifetime Value</th>
              <th className="p-10 text-right text-[10px] font-bold text-white/30 uppercase tracking-widest">Command</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-20 text-center">
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">No collectors match your search.</p>
                </td>
              </tr>
            ) : (
              sorted.map(({ user, orderCount, lifetimeValue }) => (
                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="p-10">
                    <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 bg-white/5 text-white/50 rounded-full flex items-center justify-center font-bold text-xl border border-white/10 group-hover:border-white transition-all uppercase">
                        {(user.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wider group-hover:text-white transition-colors">{user.name}</p>
                        <p className="text-[10px] text-white/20 lowercase tracking-widest mt-1 italic">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-10 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                    {user.joinedDate || '—'}
                  </td>
                  <td className="p-10">
                    <span className="text-sm font-mono font-bold text-white/80">{orderCount}</span>
                  </td>
                  <td className="p-10">
                    <span className="text-sm font-mono font-bold text-white/80">₹{lifetimeValue.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="p-10 text-right">
                    <button
                      onClick={() => setAuditUser(user)}
                      className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors flex items-center justify-end ml-auto"
                    >
                      Audit History <ChevronRight size={14} className="ml-2" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {auditUser && (
        <AuditHistoryModal
          user={auditUser}
          email={auditUser.email || ''}
          orders={orders.filter(o => (o.customerEmail || '').toLowerCase() === (auditUser.email || '').toLowerCase())}
          onClose={() => setAuditUser(null)}
        />
      )}
    </div>
  );
};

const AuditHistoryModal = ({ user, email, orders, onClose }: { user: User | null; email: string; orders: Order[]; onClose: () => void }) => {
  const sorted = [...orders].sort((a, b) => (b.date > a.date ? 1 : -1));
  const displayName = user ? user.name : 'Guest collector';
  const displayEmail = email || (user?.email ?? '');
  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in" onClick={onClose}>
      <div className="bg-[#0D0D0D] w-full max-w-2xl max-h-[85vh] rounded-[32px] border border-white/5 shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-10 py-8 border-b border-white/5 flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold uppercase italic tracking-tighter">{displayName}</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{displayEmail}</p>
            {!user && <span className="inline-block mt-2 text-[8px] font-bold text-white/30 uppercase tracking-widest border border-white/10 px-2 py-1 rounded">Guest · not in Collective</span>}
            <p className="text-[9px] text-white/20 uppercase tracking-widest mt-2">Order history · {sorted.length} transaction{sorted.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 text-white/30 hover:text-white rounded-full transition-all">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {sorted.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">No orders yet</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-10 py-5 text-[9px] font-bold text-white/30 uppercase tracking-widest">Order</th>
                  <th className="px-10 py-5 text-[9px] font-bold text-white/30 uppercase tracking-widest">Date</th>
                  <th className="px-10 py-5 text-[9px] font-bold text-white/30 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-5 text-[9px] font-bold text-white/30 uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sorted.map(order => (
                  <tr key={order.id} className="hover:bg-white/[0.02]">
                    <td className="px-10 py-5 font-mono text-[10px] text-white/70">#{order.id}</td>
                    <td className="px-10 py-5 text-[10px] font-bold text-white/50 uppercase tracking-widest">{order.date}</td>
                    <td className="px-10 py-5">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${
                        order.status === 'Delivered' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                        order.status === 'Cancelled' ? 'border-rose-500/20 text-rose-400 bg-rose-500/5' :
                        'border-amber-500/20 text-amber-400 bg-amber-500/5'
                      }`}>{order.status}</span>
                    </td>
                    <td className="px-10 py-5 text-right text-sm font-mono font-bold">₹{order.amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-10 py-6 border-t border-white/5 flex justify-between items-center">
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
            Total: ₹{sorted.reduce((s, o) => s + o.amount, 0).toLocaleString('en-IN')}
          </p>
          <button onClick={onClose} className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};

// --- Blog Management ---

const BLOG_CATEGORIES: BlogPost['category'][] = ['Design', 'Sustainability', 'Culture', 'Behind the Scenes', 'Style Guide'];

const AdminBlogView = ({ posts, setPosts }: { posts: BlogPost[], setPosts: React.Dispatch<React.SetStateAction<BlogPost[]>> }) => {
  const [editing, setEditing] = React.useState<BlogPost | null>(null);
  const [filterCat, setFilterCat] = React.useState<string>('All');

  const filtered = filterCat === 'All' ? posts : posts.filter(p => p.category === filterCat);
  const sorted = [...filtered].sort((a, b) => (b.date > a.date ? 1 : -1));

  const handleCreate = () => {
    const blank: BlogPost = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      excerpt: '',
      body: '',
      coverImage: '',
      category: 'Design',
      author: 'AURA Editorial',
      date: new Date().toISOString().split('T')[0],
      published: false,
    };
    setEditing(blank);
  };

  const handleSave = (post: BlogPost) => {
    setPosts(prev => {
      const exists = prev.find(p => p.id === post.id);
      if (exists) return prev.map(p => p.id === post.id ? post : p);
      return [post, ...prev];
    });
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this blog post?')) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const togglePublish = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, published: !p.published } : p));
  };

  if (editing) {
    return <BlogEditor post={editing} onSave={handleSave} onClose={() => setEditing(null)} />;
  }

  return (
    <div className="animate-fade-in space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold tracking-tighter uppercase italic">Blog</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] mt-1">Publish & manage journal entries</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilterCat('All')} className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest rounded-full border transition-all ${filterCat === 'All' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}>All</button>
            {BLOG_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)} className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest rounded-full border transition-all ${filterCat === cat ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}>{cat}</button>
            ))}
          </div>
          <button onClick={handleCreate} className="bg-white text-black px-10 py-5 text-[10px] font-bold uppercase tracking-widest flex items-center space-x-3 rounded-2xl hover:bg-slate-200 transition-all shadow-xl shadow-white/5 shrink-0">
            <Plus size={18} />
            <span>New Post</span>
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="bg-[#121212] border border-white/5 rounded-[32px] p-20 text-center">
          <FileText size={48} className="mx-auto text-white/10 mb-4" />
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-6">No blog posts yet</p>
          <button onClick={handleCreate} className="bg-white text-black px-8 py-4 text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">Write your first post</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sorted.map(post => (
            <div key={post.id} className="bg-[#121212] border border-white/5 rounded-[32px] p-8 flex items-center space-x-8 hover:border-white/10 transition-all group">
              <div className="w-24 h-20 bg-black rounded-2xl overflow-hidden shrink-0 border border-white/5">
                {post.coverImage ? (
                  <img src={post.coverImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10 text-2xl font-serif italic">A</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${post.published ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-amber-500/20 text-amber-400 bg-amber-500/5'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{post.category}</span>
                </div>
                <h4 className="text-sm font-bold tracking-widest uppercase truncate">{post.title || 'Untitled'}</h4>
                <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">{post.author} · {post.date}</p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={() => togglePublish(post.id)}
                  className={`p-4 rounded-2xl border border-white/5 transition-all ${post.published ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-white/5 text-white/30 hover:text-amber-400 hover:bg-amber-500/10'}`}
                  title={post.published ? 'Unpublish' : 'Publish'}
                >
                  {post.published ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button onClick={() => setEditing(post)} className="p-4 bg-white/5 text-white/30 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-white/5" title="Edit">
                  <Edit3 size={18} />
                </button>
                <button onClick={() => handleDelete(post.id)} className="p-4 bg-white/5 text-white/30 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all border border-white/5" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BlogEditor = ({ post, onSave, onClose }: { post: BlogPost, onSave: (p: BlogPost) => void, onClose: () => void }) => {
  const [form, setForm] = React.useState<BlogPost>({ ...post });

  const handleSubmit = () => {
    if (!form.title.trim()) return alert('Title is required.');
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-[#0D0D0D] w-full max-w-3xl h-[85vh] rounded-[40px] border border-white/5 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
        <div className="px-12 pt-12 pb-8 flex justify-between items-start border-b border-white/5">
          <div>
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] mb-2 block">
              {post.title ? 'Edit Post' : 'New Blog Post'}
            </span>
            <h2 className="text-2xl font-bold uppercase italic tracking-tighter">{form.title || 'Untitled'}</h2>
          </div>
          <button onClick={onClose} className="p-4 bg-white/5 text-white/30 hover:text-white rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-12 py-10 space-y-10">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2 col-span-2">
              <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Post title..."
                className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-xs font-bold uppercase tracking-widest focus:border-white/20 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value as BlogPost['category'] })}
                className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-xs font-bold uppercase tracking-widest focus:border-white/20 outline-none"
              >
                {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={e => setForm({ ...form, author: e.target.value })}
                className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-xs font-bold uppercase tracking-widest focus:border-white/20 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Cover Image URL</label>
            <input
              type="text"
              value={form.coverImage}
              onChange={e => setForm({ ...form, coverImage: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-xs font-mono tracking-tight focus:border-white/20 outline-none"
            />
            {form.coverImage && (
              <div className="mt-4 w-full aspect-[21/9] bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                <img
                  src={form.coverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Excerpt</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={e => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Short summary for the card..."
              className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-xs font-light tracking-wide focus:border-white/20 outline-none leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Body</label>
            <textarea
              rows={12}
              value={form.body}
              onChange={e => setForm({ ...form, body: e.target.value })}
              placeholder="Write your blog post content here. Use blank lines to separate paragraphs."
              className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-xs font-light tracking-wide focus:border-white/20 outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={form.published}
              onChange={e => setForm({ ...form, published: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 text-white focus:ring-white cursor-pointer"
            />
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Publish immediately</span>
          </div>
        </div>

        <div className="px-12 py-8 border-t border-white/5 flex justify-end space-x-4">
          <button onClick={onClose} className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="bg-white text-black px-10 py-4 text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all shadow-xl shadow-white/5">
            {post.title ? 'Save Changes' : 'Create Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
