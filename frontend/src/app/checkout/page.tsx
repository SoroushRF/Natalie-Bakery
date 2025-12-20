"use client";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { fetchAPI } from "@/utils/api";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { format, addDays } from "date-fns";
import { motion } from "framer-motion";

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickupDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    pickupTime: "12:00",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const hasCustomCake = items.some(item => item.isCustomCake);
  const minDate = hasCustomCake ? format(addDays(new Date(), 3), 'yyyy-MM-dd') : format(addDays(new Date(), 1), 'yyyy-MM-dd');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const pickup_datetime = `${formData.pickupDate}T${formData.pickupTime}:00Z`;

    const orderData = {
      customer_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      total_price: getTotalPrice(),
      pickup_datetime,
      items: items.map(item => ({
        product: item.id,
        quantity: item.quantity,
        flavor: item.flavor || null,
        filling: item.filling || null,
        size: item.size || null,
        price: item.price
      }))
    };

    try {
      await fetchAPI('/orders/', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
      setSuccess(true);
      clearCart();
      setTimeout(() => router.push('/'), 5000);
    } catch (err: any) {
      setError(err.message || "An error occurred while placing your order.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full">
          <CheckCircle2 className="h-16 md:h-24 w-16 md:w-24 text-gold mx-auto mb-8 animate-bounce" />
          <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-4">Order Received</h2>
          <p className="text-charcoal/60 mb-8 text-sm md:text-base leading-relaxed">Thank you for choosing Natalie Bakery. We have received your order and will contact you shortly for confirmation.</p>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Redirecting to home...</p>
            <div className="w-12 h-0.5 bg-gold/20 relative overflow-hidden">
                <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gold"
                />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center">
         <p className="font-serif text-charcoal">Your bag is empty. Please add items to checkout.</p>
         <button onClick={() => router.push('/shop')} className="mt-4 underline text-gold">Go to Shop</button>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-charcoal mb-8 md:mb-12 text-center uppercase tracking-[0.2em]">Reserve Your Selection</h1>
        
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10 md:gap-12">
          {/* Customer Details */}
          <div className="space-y-6 md:space-y-8">
            <h3 className="font-serif text-xl md:text-2xl text-charcoal border-b border-gold/10 pb-4">Personal Information</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-charcoal/60 block mb-2 font-bold">Full Name</label>
                <input 
                  required
                  className="w-full bg-white/70 backdrop-blur-sm border border-gold/20 p-4 rounded-md transition-all focus:border-gold focus:bg-white outline-none text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Cyrus the Great"
                />
              </div>
              
              <div>
                <label className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-charcoal/60 block mb-2 font-bold">Email Address</label>
                <input 
                  required
                  type="email"
                  className="w-full bg-white/70 backdrop-blur-sm border border-gold/20 p-4 rounded-md transition-all focus:border-gold focus:bg-white outline-none text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="name@luxury.com"
                />
              </div>

              <div>
                <label className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-charcoal/60 block mb-2 font-bold">Phone Number</label>
                <input 
                  required
                  type="tel"
                  className="w-full bg-white/70 backdrop-blur-sm border border-gold/20 p-4 rounded-md transition-all focus:border-gold focus:bg-white outline-none text-sm"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1 (416) 000-0000"
                />
              </div>
            </div>
          </div>

          {/* Logistics */}
          <div className="space-y-6 md:space-y-8">
            <h3 className="font-serif text-xl md:text-2xl text-charcoal border-b border-gold/10 pb-4">Pickup Logistics</h3>
            
            <div className="space-y-6">
               {hasCustomCake && (
                 <div className="p-4 bg-gold/5 border-l-4 border-gold">
                   <p className="text-[10px] font-bold text-gold uppercase tracking-widest leading-relaxed">
                     Notice: Your selection includes a Custom Cake. The earliest available pickup is {minDate}.
                   </p>
                 </div>
               )}

              <div>
                <label className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-charcoal/60 block mb-2 font-bold flex items-center">
                  <Calendar className="h-3 w-3 mr-2 text-gold" />
                  Pickup Date
                </label>
                <input 
                  required
                  type="date"
                  min={minDate}
                  className="w-full bg-white/70 backdrop-blur-sm border border-gold/20 p-4 rounded-md transition-all focus:border-gold focus:bg-white outline-none text-sm"
                  value={formData.pickupDate}
                  onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-charcoal/60 block mb-2 font-bold flex items-center">
                   <Clock className="h-3 w-3 mr-2 text-gold" />
                   Pickup Time
                </label>
                <select 
                  required
                  className="w-full bg-white/70 backdrop-blur-sm border border-gold/20 p-4 rounded-md transition-all focus:border-gold focus:bg-white outline-none text-sm"
                  value={formData.pickupTime}
                  onChange={(e) => setFormData({...formData, pickupTime: e.target.value})}
                >
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                </select>
              </div>
            </div>

            <div className="pt-6 md:pt-8 border-t border-gold/10">
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-charcoal/60 font-bold">Total Amount Due</span>
                <span className="text-2xl md:text-3xl font-serif text-charcoal">${getTotalPrice().toFixed(2)}</span>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest border border-red-100">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-primary w-full h-14 md:h-16 flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-gold/10"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "COMPLETE RESERVATION"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
