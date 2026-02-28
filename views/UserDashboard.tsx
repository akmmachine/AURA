

import React from 'react';
import { User, SavedPaymentMethod, Order } from '../types';
import { ADMIN_CREDENTIALS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Package, 
  CreditCard, 
  Settings, 
  LogOut, 
  MapPin, 
  Trash2, 
  ShieldCheck, 
  Plus, 
  UserCircle, 
  Edit2, 
  ShieldQuestion,
  Gauge, // Added for Admin Profile -> Command Center
  UserCog, // Added for Admin Profile
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

interface UserDashboardProps {
  user: User;
  orders: Order[];
  onLogout: () => void;
  isAdmin: boolean;
  onAdminLogout: () => void;
  navigateToAdminConsole: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, orders, onLogout, isAdmin, onAdminLogout, navigateToAdminConsole }) => {
  const [activeTab, setActiveTab] = React.useState<'orders' | 'payments' | 'addresses' | 'profile' | 'adminProfile'>('orders');
  const navigate = useNavigate(); // Use useNavigate within the component

  // Set initial tab based on isAdmin
  React.useEffect(() => {
    if (isAdmin) {
      setActiveTab('adminProfile');
    } else {
      setActiveTab('orders');
    }
  }, [isAdmin]);

  const [savedPayments, setSavedPayments] = React.useState<SavedPaymentMethod[]>(() => {
    const saved = localStorage.getItem('aura_saved_payments');
    return saved ? JSON.parse(saved) : [];
  });

  const [profileData, setProfileData] = React.useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '+91 98765 43210',
    joined: user.joinedDate || 'Season 01, 2024'
  });

  const removePaymentMethod = (id: string) => {
    const updated = savedPayments.filter(m => m.id !== id);
    setSavedPayments(updated);
    localStorage.setItem('aura_saved_payments', JSON.stringify(updated));
  };

  const handleLogout = () => {
    if (isAdmin) {
      onAdminLogout();
      navigate('/admin/login');
    } else {
      onLogout();
      navigate('/auth');
    }
  };

  // Real orders for this user (by email)
  const userOrders = React.useMemo(() => {
    return orders
      .filter((o) => (o.customerEmail || '').toLowerCase() === (user.email || '').toLowerCase())
      .sort((a, b) => (b.date > a.date ? 1 : -1));
  }, [orders, user.email]);

  // Collection Value chart: monthly spend from user's real orders (last 6 months)
  const collectionChartData = React.useMemo(() => {
    const now = new Date();
    const months: { name: string; spend: number; sortKey: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name: MONTH_NAMES[d.getMonth()],
        spend: 0,
        sortKey: d.getTime()
      });
    }
    userOrders.forEach((o) => {
      const parts = o.date.split('-').map(Number);
      const y = parts[0], m = parts[1] || 1;
      const orderMonthStart = new Date(y, m - 1, 1).getTime();
      const entry = months.find((mm) => mm.sortKey === orderMonthStart);
      if (entry) entry.spend += o.amount;
    });
    return months.map(({ name, spend }) => ({ name, spend }));
  }, [userOrders]);

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 space-y-2">
          <div className="p-6 bg-slate-50 rounded-2xl mb-6 border border-slate-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-xl border-4 border-white">
              {profileData.name.charAt(0)}
            </div>
            <h2 className="text-lg font-bold tracking-tight uppercase">{profileData.name}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                {isAdmin ? 'AURA Administrator' : 'AURA Collector'}
            </p>
          </div>
          
          <nav className="space-y-1">
            {isAdmin ? (
                <>
                    <button 
                        onClick={() => setActiveTab('adminProfile')}
                        className={`w-full flex items-center space-x-3 px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'adminProfile' ? 'bg-black text-white shadow-xl' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <UserCog size={18} />
                        <span>Admin Profile</span>
                    </button>
                    <button 
                        onClick={navigateToAdminConsole} // Now directly calls the prop, which handles navigation
                        className="w-full flex items-center space-x-3 px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all text-emerald-600 hover:bg-emerald-50"
                    >
                        <Gauge size={18} />
                        <span>Command Center</span>
                    </button>
                </>
            ) : (
                <>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center space-x-3 px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-black text-white shadow-xl' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Package size={18} />
                        <span>Orders</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center space-x-3 px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-black text-white shadow-xl' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <UserCircle size={18} />
                        <span>Profile</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('payments')}
                        className={`w-full flex items-center space-x-3 px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'payments' ? 'bg-black text-white shadow-xl' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <CreditCard size={18} />
                        <span>Payments</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('addresses')}
                        className={`w-full flex items-center space-x-3 px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'addresses' ? 'bg-black text-white shadow-xl' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <MapPin size={18} />
                        <span>Addresses</span>
                    </button>
                </>
            )}
            <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-6 py-4 text-rose-600 hover:bg-rose-50 rounded-xl text-[10px] font-bold uppercase tracking-widest mt-8">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-12">
          {isAdmin && activeTab === 'adminProfile' && (
             <section className="animate-fade-in max-w-2xl">
                <h3 className="text-2xl font-bold tracking-tighter mb-8 uppercase">Administrator Profile</h3>
                <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm space-y-8">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Admin Email</label>
                      <input type="email" value={ADMIN_CREDENTIALS.email} disabled className="w-full bg-slate-50/50 border-none rounded-xl p-4 text-sm font-medium text-slate-400 cursor-not-allowed" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Last Login</label>
                      <p className="p-4 text-sm font-bold uppercase tracking-widest text-black">{new Date().toLocaleString()}</p>
                   </div>
                   <div className="pt-8 border-t border-slate-100">
                      <button 
                        onClick={navigateToAdminConsole} 
                        className="bg-black text-white px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-black/10 flex items-center space-x-3"
                      >
                         <Gauge size={18} />
                         <span>Go to Command Center</span>
                      </button>
                   </div>
                   <div className="mt-8 p-6 bg-slate-50 rounded-xl flex items-start space-x-4">
                     <ShieldQuestion size={20} className="text-slate-400 mt-1" />
                     <div>
                       <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1">Administrative Access</h4>
                       <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-relaxed">
                         You have full access to manage inventory, orders, and site analytics. Exercise caution and verify all changes.
                       </p>
                     </div>
                   </div>
                </div>
             </section>
          )}

          {!isAdmin && activeTab === 'orders' && (
            <>
              <section className="animate-fade-in">
                <h3 className="text-2xl font-bold tracking-tighter mb-8 uppercase">Collection Value</h3>
                <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm">
                  {collectionChartData.some((d) => d.spend > 0) ? (
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={collectionChartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} tickFormatter={(v) => v >= 1000 ? `₹${v/1000}k` : `₹${v}`} />
                          <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)'}} formatter={(v: number) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Spend']} />
                          <Bar dataKey="spend" fill="#000" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-72 flex items-center justify-center text-slate-400">
                      <p className="text-[10px] font-bold uppercase tracking-widest">No orders yet — your collection value will appear here</p>
                    </div>
                  )}
                </div>
              </section>

              <section className="animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold tracking-tighter uppercase">Recent Orders</h3>
                  <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-black">History</button>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {userOrders.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-8 py-16 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            No orders yet — place an order to see it here
                          </td>
                        </tr>
                      ) : (
                        userOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-6 text-sm font-bold text-black font-mono">#{order.id}</td>
                            <td className="px-8 py-6 text-xs text-slate-500 font-medium">{order.date}</td>
                            <td className="px-8 py-6">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' : order.status === 'Processing' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-sm font-bold">₹{order.amount.toLocaleString('en-IN')}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {!isAdmin && activeTab === 'profile' && (
            <section className="animate-fade-in max-w-2xl">
              <h3 className="text-2xl font-bold tracking-tighter mb-8 uppercase">Profile Details</h3>
              <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="flex items-center group">
                      <input 
                        type="text" 
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="flex-1 bg-slate-50 border-none rounded-xl p-4 text-sm font-medium focus:ring-1 focus:ring-black/5" 
                      />
                      <Edit2 size={14} className="ml-3 text-slate-300 group-focus-within:text-black" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input type="email" value={profileData.email} disabled className="w-full bg-slate-50/50 border-none rounded-xl p-4 text-sm font-medium text-slate-400 cursor-not-allowed" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-medium focus:ring-1 focus:ring-black/5" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Member Since</label>
                    <p className="p-4 text-sm font-bold uppercase tracking-widest text-black">{profileData.joined}</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <button className="bg-black text-white px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-black/10">
                    Update Profile
                  </button>
                </div>

                <div className="mt-8 p-6 bg-slate-50 rounded-xl flex items-start space-x-4">
                  <ShieldQuestion size={20} className="text-slate-400 mt-1" />
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1">Privacy Controls</h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-relaxed">
                      Your data is stored in our secure vault. We only use your information to improve your shopping experience and deliver orders.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {!isAdmin && activeTab === 'payments' && (
            <section className="animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold tracking-tighter uppercase">Wallet</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 uppercase">Manage payment credentials</p>
                </div>
                <button className="flex items-center space-x-2 text-[10px] font-bold bg-slate-100 px-6 py-3 rounded-full uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                  <Plus size={14} />
                  <span>Add New</span>
                </button>
              </div>

              {savedPayments.length === 0 ? (
                <div className="p-20 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                  <CreditCard size={48} className="mx-auto text-slate-200 mb-6" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secure vault is empty</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {savedPayments.map((method) => (
                    <div key={method.id} className="relative p-8 border border-slate-100 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all group overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform"></div>
                      <div className="flex justify-between items-start mb-12 relative z-10">
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <CreditCard size={24} className="text-black" />
                        </div>
                        <button onClick={() => removePaymentMethod(method.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-2"><Trash2 size={18} /></button>
                      </div>
                      <div className="space-y-1 relative z-10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Card ending in</p>
                        <p className="text-2xl font-mono font-bold tracking-[0.2em]">•••• {method.last4}</p>
                      </div>
                      <div className="mt-8 flex justify-between items-end relative z-10">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Exp {method.expiry}</div>
                        <div className="flex items-center space-x-1 text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">
                          <ShieldCheck size={12} />
                          <span>Encrypted</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {!isAdmin && activeTab === 'addresses' && (
             <section className="animate-fade-in text-center py-40">
               <MapPin size={48} className="mx-auto text-slate-100 mb-6" />
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No shipping addresses saved yet.</p>
             </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
