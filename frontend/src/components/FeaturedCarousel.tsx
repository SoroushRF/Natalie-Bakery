"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

interface FeaturedCarouselProps {
  products: any[];
}

export default function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(4);
  const [itemWidthPercent, setItemWidthPercent] = useState(23);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1.2); // Show 1 full item and a peek of the next
        setItemWidthPercent(80);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
        setItemWidthPercent(45);
      } else {
        setItemsToShow(4);
        setItemWidthPercent(23);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (products.length <= itemsToShow || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= products.length - Math.floor(itemsToShow)) return 0;
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length, isHovered, itemsToShow]);

  // Show grid if enough items aren't present
  if (products.length <= Math.floor(itemsToShow)) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="featured" />
        ))}
      </div>
    );
  }

  const handleNext = () => {
    if (currentIndex < products.length - Math.floor(itemsToShow)) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const gapPx = 32;

  return (
    <div 
      className="relative group/carousel mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden px-4 md:px-1"> {/* Increased padding on mobile to prevent control clipping */}
        <motion.div
          className="flex gap-8 items-stretch"
          animate={{ x: `calc(-${currentIndex * itemWidthPercent}% - ${currentIndex * gapPx}px)` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 group/card h-auto" style={{ width: `${itemWidthPercent}%` }}>
              <ProductCard product={product} variant="featured" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Buttons - Adjusted for mobile visibility */}
      <div className="flex justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none px-2 md:-mx-8">
        <button
          onClick={handlePrev}
          className={`pointer-events-auto bg-white/90 backdrop-blur-sm shadow-xl p-3 md:p-4 text-charcoal hover:text-gold transition-all rounded-full border border-gold/10 ${currentIndex === 0 ? 'opacity-0 invisible' : 'opacity-100'}`}
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={handleNext}
          className={`pointer-events-auto bg-white/90 backdrop-blur-sm shadow-xl p-3 md:p-4 text-charcoal hover:text-gold transition-all rounded-full border border-gold/10 ${currentIndex >= products.length - Math.floor(itemsToShow) ? 'opacity-0 invisible' : 'opacity-100'}`}
          disabled={currentIndex >= products.length - Math.floor(itemsToShow)}
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mt-8 md:mt-12 flex-wrap px-4">
        {Array.from({ length: Math.max(0, products.length - Math.floor(itemsToShow) + 1) }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 transition-all duration-500 rounded-full ${currentIndex === idx ? 'w-8 md:w-12 bg-gold' : 'w-2 md:w-3 bg-gold/10 hover:bg-gold/30'}`}
          />
        ))}
      </div>
    </div>
  );
}
