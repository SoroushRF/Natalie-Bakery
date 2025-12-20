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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (products.length <= 4 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= products.length - 4) return 0;
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length, isHovered]);

  // Show grid if 4 or fewer
  if (products.length <= 4) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="featured" />
        ))}
      </div>
    );
  }

  const handleNext = () => {
    if (currentIndex < products.length - 4) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Logic for the peek: 
  // Each item is 23% width. (4 items = 92%, 5th item shows 8%)
  // Gap is 32px (gap-8).
  const itemWidthPercent = 23;
  const gapPx = 32;

  return (
    <div 
      className="relative group/carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden px-1"> {/* px-1 prevents clipping shadows */}
        <motion.div
          className="flex gap-8 items-stretch"
          animate={{ x: `calc(-${currentIndex * itemWidthPercent}% - ${currentIndex * gapPx}px)` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          {products.map((product) => (
            <div key={product.id} className="w-[23%] flex-shrink-0 group/card h-auto">
              <ProductCard product={product} variant="featured" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none px-4 md:-mx-8">
        <button
          onClick={handlePrev}
          className={`pointer-events-auto bg-white shadow-2xl p-4 text-charcoal hover:text-gold transition-all rounded-full border border-gold/10 ${currentIndex === 0 ? 'opacity-0 invisible' : 'opacity-100'}`}
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleNext}
          className={`pointer-events-auto bg-white shadow-2xl p-4 text-charcoal hover:text-gold transition-all rounded-full border border-gold/10 ${currentIndex >= products.length - 4 ? 'opacity-0 invisible' : 'opacity-100'}`}
          disabled={currentIndex >= products.length - 4}
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Progress Indicator */}
      <div className="flex justify-center gap-3 mt-12">
        {Array.from({ length: Math.max(0, products.length - 3) }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 transition-all duration-500 rounded-full ${currentIndex === idx ? 'w-12 bg-gold' : 'w-3 bg-gold/10 hover:bg-gold/30'}`}
          />
        ))}
      </div>
    </div>
  );
}
