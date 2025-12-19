"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchAPI } from "@/utils/api";
import { Search, SlidersHorizontal } from "lucide-react";

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
    <div className="bg-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-serif text-charcoal mb-4 tracking-tight">Our Collection</h1>
          <p className="text-charcoal/60 max-w-xl">
            Browse our full range of pastries, artisanal breads, and custom celebratory cakes.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-32">
              <h3 className="font-serif text-lg mb-6 uppercase tracking-widest text-gold border-b border-gold/20 pb-2">Categories</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setSelectedCategory("all")}
                  className={`block text-sm uppercase tracking-wider transition-colors ${selectedCategory === "all" ? "text-gold font-bold" : "text-charcoal/60 hover:text-charcoal"}`}
                >
                  All Collections
                </button>
                {categories.map((cat: any) => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`block text-sm uppercase tracking-wider transition-colors ${selectedCategory === cat.name ? "text-gold font-bold" : "text-charcoal/60 hover:text-charcoal"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white/50 h-96 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product: any) => (
                  <div key={product.id} className="group card flex flex-col items-center text-center">
                    <div className="relative w-full aspect-square mb-6 overflow-hidden">
                      <img 
                        src={product.image || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'} 
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                      />
                      {product.is_custom_cake && (
                        <div className="absolute top-4 right-4 bg-charcoal text-cream text-[10px] px-3 py-1 uppercase tracking-widest font-bold">
                          Custom
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">{product.category_name}</span>
                    <h3 className="font-serif text-xl mb-2 text-charcoal">{product.name}</h3>
                    <p className="text-charcoal/60 font-semibold mb-6 italic">${product.price}</p>
                    <Link href={`/product/${product.slug}`} className="btn-primary w-full text-center">
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/30 border border-dashed border-gold/30">
                <p className="text-charcoal/40 font-serif">Empty in this collection for now.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
