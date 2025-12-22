"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * A smooth "Scroll to Top" button that appears after the user scrolls down.
 * Designed with the Natalie Bakery Charcoal & Gold aesthetic.
 */
export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 800px
      if (window.scrollY > 800) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ 
            scale: 1.1,
            backgroundColor: "#222222",
            borderColor: "rgba(212, 175, 55, 0.6)"
          }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 z-[100] w-12 h-12 flex items-center justify-center bg-charcoal text-gold border border-gold/30 rounded-full shadow-2xl backdrop-blur-sm transition-all duration-300 group"
          aria-label="Scroll to top"
        >
          <ChevronUp 
            className="h-6 w-6 transform group-hover:-translate-y-1 transition-transform duration-300" 
            strokeWidth={2.5} 
          />
          
          {/* Subtle ring animation on hover */}
          <motion.div 
            className="absolute inset-0 rounded-full border border-gold/0"
            whileHover={{ 
              scale: 1.2, 
              opacity: [0, 0.5, 0],
              borderColor: "rgba(212, 175, 55, 0.5)"
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
