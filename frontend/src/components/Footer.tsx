"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Instagram, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sun, 1 = Mon, ...
      const hour = now.getHours();

      if (day === 0) { // Sunday
        setIsOpen(hour >= 10 && hour < 19);
      } else { // Mon-Sat
        setIsOpen(hour >= 9 && hour < 20);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-charcoal text-cream py-16 border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="font-serif text-3xl tracking-tight">NATALIE <span className="text-gold">BAKERY</span></h3>
            <p className="text-cream/60 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Natalie Bakery Limited &mdash; Where traditional Persian artistry meets modern luxury in the heart of Thornhill.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="https://instagram.com/nataliebakery.toronto" target="_blank" className="text-gold hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-gold uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
              <MapPin className="h-4 w-4" /> Reach Us
            </h4>
            <ul className="text-sm text-cream/60 space-y-4">
              <li className="hover:text-gold transition-colors">
                <a href="https://maps.google.com/?q=55+Glen+Cameron+Rd+Unit+14+Thornhill+ON+L3T+5W2" target="_blank" className="leading-relaxed">
                  55 Glen Cameron Rd, Unit 14<br />
                  Thornhill, ON L3T 5W2
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-cream font-medium">
                <Phone className="h-4 w-4 text-gold" />
                <a href="tel:+14165669693" className="hover:text-gold transition-colors">+1 (416) 566-9693</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-gold uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
              <Clock className="h-4 w-4" /> Hours
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-cream/60 border-b border-cream/5 pb-1">
                <span>Mon - Sat</span>
                <span>9:00 AM – 8:00 PM</span>
              </div>
              <div className="flex justify-between text-sm text-cream/60 border-b border-cream/5 pb-1">
                <span>Sunday</span>
                <span>10:00 AM – 7:00 PM</span>
              </div>
              
              <div className="pt-2 flex justify-center md:justify-start">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isOpen ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                  {isOpen ? 'Open Now' : 'Closed'}
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-56 md:h-full min-h-[200px] relative grayscale hover:grayscale-0 transition-all duration-700 border border-gold/10 group">
            <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2877.9427320490!2d-79.4187!3d43.8153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b2d6ffaaaaaaa%3A0x7d9f9693!2s55+Glen+Cameron+Rd+%2314%2C+Thornhill%2C+ON+L3T+5W2!5e0!3m2!1sen!2sca!4v1713555000000!5m2!1sen!2sca" 
               width="100%" 
               height="100%" 
               style={{ border: 0 }} 
               allowFullScreen 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
               className="opacity-70 group-hover:opacity-100 transition-opacity"
            ></iframe>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-cream/10 text-center text-[10px] text-cream/40 uppercase tracking-[0.2em] flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; 2026 Natalie Bakery Limited. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-gold transition-colors">Contact</Link>
            <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <Link href="/checkout" className="hover:text-gold transition-colors">Pickup</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
