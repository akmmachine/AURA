
import React from 'react';
import { ADMIN_CREDENTIALS } from '../constants';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';

interface AdminAuthProps {
  onAdminLogin: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onAdminLogin }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);

    // Simulate API call delay
    setTimeout(() => {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        onAdminLogin();
        navigate('/dashboard'); // Redirect to /dashboard after admin login
      } else {
        setError('Invalid credentials. Please check your admin email and password.');
      }
      setIsAuthenticating(false);
    }, 1000); // Simulate network delay
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md p-10 bg-[#111] border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/10"></div>
        
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
            <Shield size={40} className="text-white/30" />
          </div>
        </div>

        <h2 className="text-3xl font-bold tracking-tighter uppercase italic text-center mb-4">
          Admin Gate
        </h2>
        <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] text-center mb-10">
          Secure Access to AURA Command Center
        </p>

        {error && (
          <div className="mb-6 p-4 bg-rose-900/20 text-rose-400 text-[10px] font-bold tracking-widest uppercase rounded-xl border border-rose-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              placeholder="admin@aura.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-xs uppercase font-bold tracking-widest focus:border-white/20 transition-all outline-none text-white placeholder:text-white/20" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-xs uppercase font-bold tracking-widest focus:border-white/20 transition-all outline-none text-white placeholder:text-white/20" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isAuthenticating}
            className="w-full bg-white text-black py-5 font-bold tracking-[0.3em] uppercase text-[10px] rounded-xl hover:bg-slate-200 transition-all shadow-xl shadow-white/5 disabled:opacity-50 flex items-center justify-center space-x-3"
          >
            {isAuthenticating ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Lock size={16} />
                <span>Access Command Center</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[8px] text-white/20 uppercase tracking-widest mt-10">
            AURA Admin Panel v1.0.0
        </p>
      </div>
    </div>
  );
};

export default AdminAuth;
