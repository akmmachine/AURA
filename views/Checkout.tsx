
import React from 'react';
import { CartItem, SavedPaymentMethod } from '../types';
// Fix: Added Info to imported icons from lucide-react
import { ChevronLeft, CreditCard, ShieldCheck, Smartphone, Truck, Lock, ShieldAlert, CheckCircle2, Zap, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CheckoutProps {
  items: CartItem[];
  onComplete: (orderData: { total: number; email: string; paymentMethod: string; shippingCost: number }) => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Puducherry"
];

const validateCardNumber = (number: string) => {
  const digits = number.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = parseInt(digits[digits.length - 1 - i]);
    if (i % 2 === 1) d *= 2;
    if (d > 9) d -= 9;
    sum += d;
  }
  return sum % 10 === 0;
};

const Checkout: React.FC<CheckoutProps> = ({ items, onComplete }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<'upi' | 'card' | 'paypal' | 'applepay' | 'googlepay' | 'cod'>('upi');
  const [saveCard, setSaveCard] = React.useState(false);
  const [createAccount, setCreateAccount] = React.useState(false);
  
  const [cardNum, setCardNum] = React.useState('');
  const [cardError, setCardError] = React.useState('');
  const [email, setEmail] = React.useState('');

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 2999 ? 0 : 150;
  const total = subtotal + shipping;

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'card' && !validateCardNumber(cardNum)) {
      setCardError('Invalid card number. Please check and try again.');
      return;
    }
    
    setIsProcessing(true);
    // Simulate payment gateway delay — no OTP; complete and redirect
    setTimeout(() => {
      setIsProcessing(false);
      handleFinalizeOrder();
    }, 1800);
  };

  const handleFinalizeOrder = () => {
    if (saveCard && paymentMethod === 'card') {
      const savedMethods = JSON.parse(localStorage.getItem('aura_saved_payments') || '[]');
      const newMethod: SavedPaymentMethod = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'card',
        last4: cardNum.slice(-4),
        brand: 'Visa',
        expiry: '12/28',
        isDefault: savedMethods.length === 0
      };
      localStorage.setItem('aura_saved_payments', JSON.stringify([...savedMethods, newMethod]));
    }
    
    onComplete({ 
      total, 
      email, 
      paymentMethod: paymentMethod.toUpperCase(),
      shippingCost: shipping 
    });
    navigate('/order-placed');
  };

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/cart')} className="text-slate-400 hover:text-black transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tighter uppercase italic">Secure Checkout</h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Order #AURA-{Math.floor(Math.random()*10000)} • Express Checkout Enabled</p>
          </div>
        </div>
        <div className="hidden md:flex items-center text-[9px] font-bold text-emerald-600 tracking-[0.3em] uppercase space-x-8">
          <span className="flex items-center"><Lock size={12} className="mr-2" /> Encrypted Connection</span>
          <span className="flex items-center"><ShieldCheck size={12} className="mr-2" /> Trusted by Norton</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7">
          <form onSubmit={handleInitialSubmit} className="space-y-12">
            {/* Express Pay (Apple/Google) */}
            <section className="animate-fade-in">
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button" 
                    onClick={() => setPaymentMethod('applepay')}
                    className={`flex items-center justify-center py-4 rounded-xl border transition-all ${paymentMethod === 'applepay' ? 'bg-black border-black text-white' : 'bg-white border-slate-200 hover:border-black'}`}
                  >
                    <Zap size={14} className="mr-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Apple Pay</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPaymentMethod('googlepay')}
                    className={`flex items-center justify-center py-4 rounded-xl border transition-all ${paymentMethod === 'googlepay' ? 'bg-[#4285F4] border-[#4285F4] text-white' : 'bg-white border-slate-200 hover:border-black'}`}
                  >
                    <Zap size={14} className="mr-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Google Pay</span>
                  </button>
               </div>
               <div className="relative flex items-center justify-center py-8">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                  <span className="relative bg-white px-4 text-[8px] font-bold text-slate-300 uppercase tracking-widest italic">Or Continue with Shipping Details</span>
               </div>
            </section>

            {/* Shipping Info */}
            <section className="animate-fade-in">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 flex items-center text-slate-400">
                <span className="w-6 h-6 bg-black text-white text-[9px] rounded-full flex items-center justify-center mr-4">01</span>
                Shipping Destination
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <input required type="text" placeholder="Full Recipient Name" className="w-full border border-slate-200 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-black transition-colors bg-white rounded-xl" />
                </div>
                <div className="sm:col-span-2">
                  <input 
                    required 
                    type="email" 
                    placeholder="Email Address for Tracking" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-200 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-black transition-colors bg-white rounded-xl" 
                  />
                </div>
                <div className="sm:col-span-2">
                  <input required type="text" placeholder="Street, Apartment, Suite" className="w-full border border-slate-200 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-black transition-colors bg-white rounded-xl" />
                </div>
                <input required type="text" placeholder="City" className="w-full border border-slate-200 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-black transition-colors bg-white rounded-xl" />
                <select required className="w-full border border-slate-200 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-black transition-colors bg-white rounded-xl appearance-none">
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
                <input required type="text" maxLength={6} placeholder="Postal Code" className="w-full border border-slate-200 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-black transition-colors bg-white rounded-xl" />
                <input required type="tel" placeholder="Contact Mobile (+91)" className="w-full border border-slate-200 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-black transition-colors bg-white rounded-xl" />
              </div>
              
              <div className="mt-8 flex items-center space-x-3 px-1">
                 <input 
                  type="checkbox" 
                  checked={createAccount}
                  onChange={(e) => setCreateAccount(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-black focus:ring-black cursor-pointer"
                 />
                 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Enroll in AURA Rewards for future benefits</span>
              </div>
            </section>

            {/* Payment Info */}
            <section className="animate-fade-in">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 flex items-center text-slate-400">
                <span className="w-6 h-6 bg-black text-white text-[9px] rounded-full flex items-center justify-center mr-4">02</span>
                Payment Method
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'upi', label: 'UPI / Scan & Pay', icon: Smartphone },
                  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                  { id: 'paypal', label: 'PayPal Secure', icon: Lock },
                  { id: 'cod', label: 'Cash on Delivery', icon: Truck }
                ].map((method) => (
                  <div 
                    key={method.id}
                    className={`border p-6 rounded-2xl cursor-pointer transition-all ${paymentMethod === method.id ? 'border-black bg-slate-50 shadow-md shadow-black/5' : 'border-slate-100 hover:border-slate-300 bg-white'}`}
                    onClick={() => { setPaymentMethod(method.id as any); setCardError(''); }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2.5 rounded-xl ${paymentMethod === method.id ? 'bg-black text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                          <method.icon size={18} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {method.label}
                        </span>
                      </div>
                      {paymentMethod === method.id && <CheckCircle2 size={16} className="text-black" />}
                    </div>
                    {paymentMethod === 'card' && method.id === 'card' && (
                      <div className="mt-8 space-y-5 animate-fade-in border-t border-slate-100 pt-8">
                        <div className="relative">
                          <input 
                            required 
                            type="text" 
                            placeholder="Card Number" 
                            value={cardNum}
                            onChange={(e) => {
                              setCardNum(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim());
                              setCardError('');
                            }}
                            className={`w-full border ${cardError ? 'border-rose-400' : 'border-slate-200'} p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-black transition-colors bg-white`} 
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-30 grayscale">
                             <CreditCard size={16} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input required type="text" placeholder="EXP MM/YY" maxLength={5} className="w-full border border-slate-200 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-black transition-colors bg-white" />
                          <input required type="password" placeholder="CVV / CVC" maxLength={4} className="w-full border border-slate-200 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-black transition-colors bg-white" />
                        </div>
                        {cardError && <p className="text-[8px] font-bold text-rose-500 uppercase tracking-widest mt-2">{cardError}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <div className="pt-6">
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full bg-black text-white py-6 font-bold tracking-[0.4em] uppercase text-[11px] hover:opacity-90 transition-all flex items-center justify-center space-x-4 rounded-2xl shadow-2xl shadow-black/20 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Complete Purchase — ₹{total.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>
              <p className="text-center text-[8px] text-slate-400 uppercase tracking-widest mt-6">By completing your order, you agree to AURA's Terms of Service and Privacy Policy.</p>
            </div>
          </form>
        </div>

        {/* Totals Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-white p-10 rounded-3xl border border-slate-100 sticky top-24 shadow-xl shadow-slate-200/50">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-10 border-b border-slate-50 pb-6 text-slate-400 italic flex justify-between">
               Order Overview 
               <span className="text-black not-italic">{items.length} Items</span>
            </h3>
            <div className="space-y-8 max-h-[350px] overflow-y-auto mb-10 pr-4 custom-scrollbar">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex space-x-6 group">
                  <div className="w-16 h-20 bg-slate-50 overflow-hidden rounded-xl border border-slate-100 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                       <h4 className="text-[10px] font-bold uppercase tracking-wider max-w-[120px]">{item.name}</h4>
                       <p className="text-[10px] font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                    <p className="text-[8px] text-slate-400 mt-1 uppercase tracking-widest leading-relaxed">
                       {item.selectedColor} • {item.selectedSize} <br />
                       Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-5 pt-8 border-t border-slate-50">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span>Items Subtotal</span>
                <span className="text-black">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span className="flex items-center">Standard Delivery <Info size={10} className="ml-2 opacity-50" /></span>
                <span className={shipping === 0 ? 'text-emerald-500' : 'text-black'}>{shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}</span>
              </div>
              <div className="pt-6 border-t-2 border-black flex justify-between items-baseline">
                <span className="text-lg font-bold tracking-tighter uppercase italic">Total Balance</span>
                <span className="text-2xl font-bold tracking-tighter">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-10 space-y-4">
               <div className="p-5 bg-slate-50 rounded-2xl flex items-start space-x-4 border border-slate-100">
                 <ShieldAlert size={16} className="text-slate-300 mt-1 flex-shrink-0" />
                 <p className="text-[9px] text-slate-400 leading-relaxed uppercase tracking-widest">
                   Orders are finalized upon authentication. You will receive a confirmation email with a unique tracking ID once dispatched.
                 </p>
               </div>
               
               <div className="flex items-center justify-center space-x-4 opacity-40">
                  <img src="https://img.icons8.com/color/48/visa.png" className="h-6" alt="Visa" />
                  <img src="https://img.icons8.com/color/48/mastercard.png" className="h-6" alt="Mastercard" />
                  <img src="https://img.icons8.com/color/48/paypal.png" className="h-6" alt="PayPal" />
                  <img src="https://img.icons8.com/color/48/apple-pay.png" className="h-6" alt="Apple Pay" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
