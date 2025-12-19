"use client";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const [isOpen, setIsOpen] = useState(false);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

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

      {isOpen && (
        <div className="md:hidden bg-cream border-b border-gold/20 pb-4 px-4 animate-in slide-in-from-top duration-300">
          <Link href="/" onClick={() => setIsOpen(false)} className="block py-2 text-charcoal font-medium">HOME</Link>
          <Link href="/shop" onClick={() => setIsOpen(false)} className="block py-2 text-charcoal font-medium">SHOP</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="block py-2 text-charcoal font-medium">CONTACT</Link>
        </div>
      )}
    </nav>
  );
}
