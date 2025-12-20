"use client";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, Menu, X, MapPin, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  if (!mounted) {
    // Return a skeleton or just the logo during hydration to avoid mismatches
    return (
      <nav className="bg-cream border-b border-gold/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
               <span className="font-serif text-2xl tracking-tighter text-charcoal">
                NATALIE <span className="text-gold">BAKERY</span>
              </span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-cream border-b border-gold/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="font-serif text-2xl tracking-tighter text-charcoal">
              NATALIE <span className="text-gold">BAKERY</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="text-charcoal hover:text-gold transition-colors font-medium text-sm border-b border-transparent hover:border-gold">HOME</Link>
              <Link href="/shop" className="text-charcoal hover:text-gold transition-colors font-medium text-sm border-b border-transparent hover:border-gold">SHOP</Link>
              <Link href="/contact" className="text-charcoal hover:text-gold transition-colors font-medium text-sm border-b border-transparent hover:border-gold">CONTACT</Link>
              <Link href="/cart" className="relative group">
                <ShoppingBag className="h-6 w-6 text-charcoal group-hover:text-gold transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
             <Link href="/cart" className="relative">
                <ShoppingBag className="h-6 w-6 text-charcoal" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 z-[60] bg-charcoal/10 backdrop-blur-[2px]"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 right-0 h-full w-[80%] max-w-[320px] z-[70] bg-cream/95 backdrop-blur-xl shadow-2xl flex flex-col border-l border-gold/10"
            >
              <div className="p-6 flex justify-between items-center border-b border-gold/10">
                <span className="font-serif text-lg tracking-tight text-charcoal">
                  NATALIE <span className="text-gold">MENU</span>
                </span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-charcoal hover:text-gold transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex-grow p-8 flex flex-col gap-6">
                {[
                  { name: "HOME", href: "/" },
                  { name: "SHOP", href: "/shop" },
                  { name: "CONTACT", href: "/contact" }
                ].map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                  >
                    <Link 
                      href={link.href} 
                      onClick={() => setIsOpen(false)} 
                      className="text-2xl font-serif text-charcoal hover:text-gold transition-colors block"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 pt-6 border-t border-gold/10"
                >
                  <Link 
                    href="/cart" 
                    onClick={() => setIsOpen(false)} 
                    className="flex justify-between items-center text-lg font-serif text-charcoal hover:text-gold transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="h-5 w-5" />
                      MY BAG
                    </div>
                    {cartCount > 0 && (
                      <span className="bg-gold text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-sans font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </motion.div>
              </nav>

              <div className="p-8 space-y-6 border-t border-gold/10 bg-gold/5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gold">
                    <MapPin className="h-4 w-4" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Location</span>
                  </div>
                  <a 
                    href="https://maps.google.com/?q=55+Glen+Cameron+Rd+Unit+14+Thornhill+ON+L3T+5W2" 
                    target="_blank" 
                    className="space-y-1 pl-7 block hover:text-gold transition-colors"
                  >
                    <p className="text-sm font-serif text-charcoal inherit:text-gold">55 Glen Cameron Rd, Unit 14</p>
                    <p className="text-xs text-charcoal/60 tracking-wide inherit:text-gold">Thornhill, ON L3T 5W2</p>
                  </a>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gold">
                    <Phone className="h-4 w-4" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Contact</span>
                  </div>
                  <div className="pl-7">
                    <a href="tel:+14165669693" className="text-sm font-medium text-charcoal hover:text-gold transition-colors">+1 (416) 566-9693</a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
