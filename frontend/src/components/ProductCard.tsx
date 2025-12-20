"use client";
import Link from "next/link";

interface ProductCardProps {
  product: any;
  variant?: 'featured' | 'recent';
}

export default function ProductCard({ product, variant = 'featured' }: ProductCardProps) {
  const isRecent = variant === 'recent';
  
  return (
    <Link 
      href={`/product/${product.slug}`}
      className={`group/card flex flex-col h-full ${!isRecent ? 'card items-center text-center' : ''}`}
    >
      <div className={`relative w-full overflow-hidden ${isRecent ? 'aspect-[4/5] mb-4 bg-cream' : 'aspect-square mb-6'}`}>
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'} 
          alt={product.name}
          className={`object-cover w-full h-full transition-transform duration-700 ${isRecent ? 'group-hover/card:scale-105' : 'group-hover/card:scale-110'}`}
        />
        
        {/* Special Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
            {(() => {
              const createdDate = new Date(product.created_at);
              const sevenDaysAgo = new Date();
              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
              
              if (createdDate >= sevenDaysAgo) {
                return (
                  <span className="bg-gold text-white text-[10px] uppercase tracking-widest px-3 py-1 font-bold shadow-lg animate-pulse">New Selection</span>
                );
              }
              return null;
            })()}
            {product.is_custom_cake && (
                <span className="bg-charcoal text-gold text-[10px] uppercase tracking-widest px-3 py-1 font-bold shadow-lg border border-gold/20">Custom Cake</span>
            )}
        </div>
      </div>

      <div className={`flex-grow ${isRecent ? "flex flex-col md:flex-row md:justify-between items-start gap-1" : ""}`}>
        <div className={isRecent ? "" : "space-y-1 md:space-y-2"}>
          <h3 className={`font-serif text-charcoal transition-colors group-hover/card:text-gold ${isRecent ? 'text-sm md:text-lg leading-snug' : 'text-lg md:text-xl mb-1 md:mb-2'}`}>
            {product.name}
          </h3>
          {isRecent && <p className="text-[10px] md:text-xs text-charcoal/40 uppercase tracking-widest">{product.category_name}</p>}
        </div>
        <div className={`${isRecent ? 'text-sm md:text-base text-charcoal font-medium whitespace-nowrap' : 'text-gold font-semibold mb-4'} `}>
          ${parseFloat(product.price).toFixed(2)}
          <span className="text-[9px] md:text-[10px] opacity-60 ml-1">/ {product.unit}</span>
        </div>
      </div>

      <div 
        className={isRecent 
            ? "mt-4 text-[10px] uppercase tracking-[0.3em] font-bold text-gold flex items-center gap-2 group-hover/card:gap-4 transition-all"
            : "text-xs uppercase tracking-[0.2em] text-charcoal/60 group-hover/card:text-gold transition-colors"
        }
      >
        {isRecent ? "Detail" : "View Creation"}
        {isRecent && <span className="h-px w-8 bg-gold/30"></span>}
      </div>
    </Link>
  );
}
