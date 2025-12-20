"use client";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, X } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [itemToConfirmRemove, setItemToConfirmRemove] = useState<any>(null);

  const handleDecreaseQuantity = (item: any) => {
    if (item.quantity === 1) {
      setItemToConfirmRemove(item);
    } else {
      updateQuantity(item.cartId, item.quantity - 1);
    }
  };

  const handleRemoveClick = (item: any) => {
    setItemToConfirmRemove(item);
  };

  const confirmRemoval = () => {
    if (itemToConfirmRemove) {
      removeItem(itemToConfirmRemove.cartId);
      setItemToConfirmRemove(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <ShoppingBag className="h-16 w-16 text-gold mb-6 opacity-20" />
        <h2 className="text-3xl font-serif text-charcoal mb-4">Your bag is empty</h2>
        <p className="text-charcoal/60 mb-8 max-w-xs text-center">It seems you haven't added any delicacies to your selection yet.</p>
        <Link href="/shop" className="btn-primary">
          Discover Our Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif text-charcoal mb-12">Your Shopping Bag</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item: any) => (
              <div key={item.cartId} className="bg-white p-6 flex flex-col sm:flex-row gap-6 items-center border border-gold/10">
                <div className="w-24 h-24 flex-shrink-0">
                  <img 
                    src={item.image || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80'} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-serif text-xl text-charcoal">{item.name}</h3>
                  <div className="text-[10px] uppercase tracking-widest text-gold mt-1">
                    {item.size}
                    {item.flavor && <> &bull; {item.flavor}</>}
                    {item.filling && <> &bull; {item.filling}</>}
                  </div>
                  <p className="text-charcoal/60 text-sm mt-2">${Number(item.price).toFixed(2)}</p>
                </div>

                <div className="flex items-center border border-gold/20 h-10 w-fit bg-cream/30">
                  <button 
                    onClick={() => handleDecreaseQuantity(item)} 
                    className="h-full px-3 flex items-center justify-center hover:bg-gold/10 transition-colors border-r border-gold/10"
                  >
                    &minus;
                  </button>
                  <span className="w-10 text-center text-sm font-sans font-bold text-charcoal">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)} 
                    className="h-full px-3 flex items-center justify-center hover:bg-gold/10 transition-colors border-l border-gold/10"
                  >
                    +
                  </button>
                </div>

                <div className="w-24 text-right">
                  <p className="font-bold text-charcoal">${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <button onClick={() => handleRemoveClick(item)} className="p-2 text-charcoal/30 hover:text-red-500 transition-colors">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 border border-gold/20 sticky top-32">
              <h3 className="font-serif text-2xl mb-8 border-b border-gold/10 pb-4">Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-charcoal/60">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-charcoal/60">
                  <span>Estimated Shipping</span>
                  <span className="text-[10px] uppercase tracking-widest bg-gold/10 px-2 py-1 text-gold">Store Pickup Only</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t border-gold/10 pt-4 mt-4">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-3">
                PROCEED TO CHECKOUT
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <p className="mt-6 text-[10px] text-center text-charcoal/40 uppercase tracking-widest">
                Safe and Secure Selection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Confirmation Modal with Framer Motion */}
      <AnimatePresence>
        {itemToConfirmRemove && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity" 
              onClick={() => setItemToConfirmRemove(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative bg-white max-w-sm w-full p-8 border border-gold/30 shadow-2xl"
            >
              <button 
                onClick={() => setItemToConfirmRemove(null)}
                className="absolute top-4 right-4 text-charcoal/30 hover:text-charcoal transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="text-center">
                <Trash2 className="h-10 w-10 text-gold mx-auto mb-6 opacity-40" />
                <h2 className="font-serif text-2xl text-charcoal mb-4">Remove Selection?</h2>
                <p className="text-charcoal/60 text-sm mb-8 leading-relaxed">
                  Are you sure you want to remove <span className="font-bold text-charcoal">{itemToConfirmRemove.name}</span> from your collection?
                </p>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={confirmRemoval}
                    className="bg-charcoal text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-black transition-colors"
                  >
                    Yes, Remove Item
                  </button>
                  <button 
                    onClick={() => setItemToConfirmRemove(null)}
                    className="border border-gold/20 py-3 uppercase tracking-widest text-xs font-bold hover:bg-cream transition-colors text-charcoal"
                  >
                    Keep in Bag
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
