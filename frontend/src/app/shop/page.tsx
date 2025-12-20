"use client";
import { useState, useEffect } from "react";
import { fetchAPI } from "@/utils/api";
import ProductCard from "@/components/ProductCard";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          fetchAPI('/categories/'),
          fetchAPI('/products/')
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter((p: any) => p.category_name.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="bg-cream min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-10 sm:px-6 lg:px-8">
        <header className="mb-8 md:mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-serif text-charcoal mb-4 tracking-tight uppercase tracking-widest">Our Collection</h1>
          <p className="text-charcoal/60 max-w-xl mx-auto md:mx-0 text-sm md:text-base">
            Browse our full range of pastries, artisanal breads, and custom celebratory cakes. Every item is baked fresh daily.
          </p>
        </header>

        {/* Categories Bar - Responsive */}
        <div className="mb-10 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
          <div className="flex md:flex-wrap gap-2 md:gap-4 pb-2 md:pb-0 min-w-max md:min-w-0">
            <button 
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-2 rounded-full text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold transition-all border ${selectedCategory === "all" ? "bg-gold text-white border-gold shadow-md" : "bg-white/50 text-charcoal/60 border-gold/10 hover:border-gold/30"}`}
            >
              All Collections
            </button>
            {categories.map((cat: any) => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-6 py-2 rounded-full text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold transition-all border ${selectedCategory === cat.name ? "bg-gold text-white border-gold shadow-md" : "bg-white/50 text-charcoal/60 border-gold/10 hover:border-gold/30"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white/50 aspect-square animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {filteredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} variant="recent" />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/30 border border-dashed border-gold/30">
              <p className="text-charcoal/40 font-serif">No creations found in this collection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
