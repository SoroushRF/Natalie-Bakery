"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAPI } from "@/utils/api";
import { useCartStore, generateCartId } from "@/store/useCartStore";
import { Plus, Minus, CheckCircle, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function ProductDetail({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [cakeOptions, setCakeOptions] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [selectedFilling, setSelectedFilling] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const router = useRouter();

  const [showSticky, setShowSticky] = useState(false);
  const priceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If price is not in view (entry.isIntersecting is false), show sticky
        setShowSticky(!entry.isIntersecting);
      },
      { 
        threshold: 0,
        rootMargin: '-80px 0px 0px 0px' // Offset for the fixed navbar (h-20 = 80px)
      }
    );

    if (priceRef.current) {
      observer.observe(priceRef.current);
    }

    return () => {
      if (priceRef.current) {
        observer.unobserve(priceRef.current);
      }
    };
  }, [isLoading]);

  // Find if current product/option combo is in bag
  const currentOptions = product?.is_custom_cake ? {
    flavor: selectedFlavor,
    filling: selectedFilling,
    size: selectedSize
  } : undefined;
  
  const currentCartId = product ? generateCartId(product.id, currentOptions) : null;
  const inBagItem = cartItems.find((item: any) => item.cartId === currentCartId);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const prod = await fetchAPI(`/products/${params.slug}/`);
        setProduct(prod);
        
        if (prod.available_options) {
          const options = prod.available_options;
          setCakeOptions(options);
          
          // Set defaults for available option types
          const flavors = options.filter((o: any) => o.option_type === 'FLAVOR');
          const fillings = options.filter((o: any) => o.option_type === 'FILLING');
          const sizes = options.filter((o: any) => o.option_type === 'SIZE');
          
          if (flavors.length) setSelectedFlavor(flavors[0].name);
          if (fillings.length) setSelectedFilling(fillings[0].name);
          
          if (sizes.length) {
            const regularSize = sizes.find((s: any) => s.name === 'Regular');
            setSelectedSize(regularSize ? regularSize.name : sizes[0].name);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [params.slug]);

  // Dynamic Price Calculation
  const calculateFinalPrice = () => {
    if (!product) return 0;
    let total = parseFloat(product.price);
    
    if (product.is_custom_cake) {
      const flavorOpt = cakeOptions.find(o => o.option_type === 'FLAVOR' && o.name === selectedFlavor);
      const fillingOpt = cakeOptions.find(o => o.option_type === 'FILLING' && o.name === selectedFilling);
      const sizeOpt = cakeOptions.find(o => o.option_type === 'SIZE' && o.name === selectedSize);
      
      if (flavorOpt) total += parseFloat(flavorOpt.price_modifier);
      if (fillingOpt) total += parseFloat(fillingOpt.price_modifier);
      if (sizeOpt) total += parseFloat(sizeOpt.price_modifier);
    }
    
    return total;
  };

  const finalPrice = calculateFinalPrice();

  const handleAddToCart = () => {
    const options = product.is_custom_cake ? {
      flavor: selectedFlavor,
      filling: selectedFilling,
      size: selectedSize
    } : undefined;

    // We pass the calculated price so the cart knows the modified amount
    addItem({ ...product, price: finalPrice }, quantity, options);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  if (isLoading) return <div className="min-h-screen bg-cream flex items-center justify-center font-serif text-charcoal">Loading Natalie's Creation...</div>;
  if (!product) return <div className="min-h-screen bg-cream flex items-center justify-center font-serif text-charcoal">Product not found.</div>;

  const flavors = cakeOptions.filter((o: any) => o.option_type === 'FLAVOR');
  const fillings = cakeOptions.filter((o: any) => o.option_type === 'FILLING');
  const sizes = cakeOptions.filter((o: any) => o.option_type === 'SIZE');

  return (
    <div className="bg-cream min-h-screen py-12">
      {/* Sticky Price Header */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gold/10 shadow-lg py-3 px-4"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
              <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                <img 
                  src={product.image || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80'} 
                  alt={product.name} 
                  className="w-10 h-10 object-cover rounded shadow-sm flex-shrink-0" 
                />
                <div className="flex flex-col min-w-0 justify-center h-10 md:h-12">
                  <h4 className="font-serif text-charcoal text-base md:text-xl truncate max-w-[140px] md:max-w-xs leading-tight">{product.name}</h4>
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:gap-6">
                <div className="text-right flex flex-col items-end">
                  <p className={`text-lg md:text-2xl font-serif leading-none transition-colors duration-300 ${finalPrice !== parseFloat(product.price) ? 'text-gold' : 'text-charcoal'}`}>
                     ${finalPrice.toFixed(2)}
                  </p>
                  <AnimatePresence>
                    {finalPrice !== parseFloat(product.price) && (
                      <motion.p 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="text-[9px] md:text-[10px] text-charcoal/40 line-through mt-0.5"
                      >
                        ${parseFloat(product.price).toFixed(2)}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <motion.button 
                  onClick={handleAddToCart}
                  className={`btn-primary text-[9px] md:text-[10px] h-10 md:h-12 px-0 flex items-center justify-center relative overflow-hidden active:scale-[0.96] transition-all duration-500 whitespace-nowrap w-[130px] md:w-[175px] flex-shrink-0 ${addedToCart ? 'bg-charcoal text-gold border-charcoal' : ''}`}
                >
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.div 
                        key="added"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-1.5 md:gap-2 justify-center w-full"
                      >
                        <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="font-bold tracking-[0.15em]">ADDED</span>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="add"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center justify-center w-full"
                      >
                        <span className="font-bold tracking-[0.1em] md:tracking-[0.2em]">ADD TO BAG</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto px-10 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Image */}
          <div className="card p-0 overflow-hidden shadow-2xl mx-auto max-w-[85%] md:max-w-full">
            <img 
              src={product.image || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80'} 
              alt={product.name}
              className="w-full h-auto object-cover aspect-square md:aspect-[4/5] lg:aspect-square"
            />
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-gold mb-2 block">{product.category_name}</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-charcoal mb-4 leading-tight">{product.name}</h1>
              <div ref={priceRef} className="flex items-baseline gap-3">
              <p className={`text-2xl md:text-3xl font-light transition-colors duration-300 ${finalPrice !== parseFloat(product.price) ? 'text-gold' : 'text-charcoal'}`}>
                ${finalPrice.toFixed(2)}
                <span className="text-xs md:text-sm opacity-60 ml-1">/ {product.unit}</span>
              </p>
              <AnimatePresence>
                {finalPrice !== parseFloat(product.price) && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-xs md:text-sm text-charcoal/40 line-through"
                  >
                    ${parseFloat(product.price).toFixed(2)}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            </div>

            <p className="text-charcoal/70 leading-relaxed text-lg">
              {product.description}
            </p>

            {cakeOptions.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-gold/10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h3 className="font-serif text-lg md:text-xl text-charcoal">
                        {product.is_custom_cake ? "Customization Options" : "Product Options"}
                    </h3>
                    {product.is_custom_cake && (
                        <div className="bg-gold/10 px-3 py-1 rounded-full">
                            <span className="text-[10px] text-gold uppercase tracking-tighter font-bold">+${(finalPrice - parseFloat(product.price)).toFixed(2)} Extras</span>
                        </div>
                    )}
                </div>
                {product.is_custom_cake && (
                    <p className="text-[10px] text-gold uppercase tracking-widest font-bold bg-gold/5 p-2 border-l-2 border-gold">Note: Custom cakes require 3-day lead time.</p>
                )}
                
                <div className="grid grid-cols-1 gap-6">
                  {/* Flavor */}
                  {flavors.length > 0 && (
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-charcoal/60 mb-3 block font-bold">Choose Flavor</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {flavors.map((f) => (
                              <button
                                  key={f.id}
                                  onClick={() => setSelectedFlavor(f.name)}
                                  className={`text-xs md:text-sm py-3 px-4 border text-left transition-all flex justify-between items-center rounded-md ${selectedFlavor === f.name ? 'border-gold bg-gold/5 ring-1 ring-gold/20' : 'border-gold/10 hover:border-gold/30'}`}
                              >
                                  <span>{f.name}</span>
                                  {parseFloat(f.price_modifier) > 0 && <span className="text-[10px] text-gold/60">+${f.price_modifier}</span>}
                              </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Filling */}
                  {fillings.length > 0 && (
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-charcoal/60 mb-3 block font-bold">Choose Filling</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {fillings.map((f) => (
                              <button
                                  key={f.id}
                                  onClick={() => setSelectedFilling(f.name)}
                                  className={`text-xs md:text-sm py-3 px-4 border text-left transition-all flex justify-between items-center rounded-md ${selectedFilling === f.name ? 'border-gold bg-gold/5 ring-1 ring-gold/20' : 'border-gold/10 hover:border-gold/30'}`}
                              >
                                  <span>{f.name}</span>
                                  {parseFloat(f.price_modifier) > 0 && <span className="text-[10px] text-gold/60">+${f.price_modifier}</span>}
                              </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Size */}
                  {sizes.length > 0 && (
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-charcoal/60 mb-3 block font-bold">Select Size</label>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setSelectedSize(s.name)}
                            className={`px-4 md:px-6 py-2 border transition-all flex flex-col items-center min-w-[80px] md:min-w-[100px] rounded-md ${selectedSize === s.name ? 'bg-gold text-white border-gold shadow-md' : 'border-gold/20 text-charcoal hover:border-gold'}`}
                          >
                            <span className="text-xs md:text-sm font-medium">{s.name}</span>
                            {parseFloat(s.price_modifier) > 0 && <span className={`text-[8px] md:text-[9px] uppercase tracking-tighter ${selectedSize === s.name ? 'text-white/80' : 'text-gold/60'}`}>+${s.price_modifier}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-8 border-t border-gold/10 flex flex-col sm:flex-row gap-6 items-end">
              <div className="w-full sm:w-auto">
                <AnimatePresence>
                  {inBagItem && (
                    <Link href="/cart">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center gap-2 text-gold text-[10px] uppercase tracking-widest font-bold mb-3 hover:underline cursor-pointer underline-offset-4 transition-all"
                      >
                        <ShoppingBag size={12} />
                        {inBagItem.quantity} ALREADY IN YOUR BAG
                      </motion.div>
                    </Link>
                  )}
                </AnimatePresence>
                <div className="flex items-center border border-gold/20 h-14 bg-white/30 w-fit rounded-md overflow-hidden relative z-10">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="h-full w-14 flex items-center justify-center hover:bg-gold/10 transition-colors border-r border-gold/10"
                  >
                    <Minus className="h-4 w-4 text-charcoal" />
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    readOnly 
                    className="w-16 text-center bg-transparent font-sans text-xl font-medium text-charcoal focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button 
                    onClick={() => setQuantity(Math.min(10, quantity + 1))} 
                    disabled={quantity >= 10}
                    className="h-full w-14 flex items-center justify-center hover:bg-gold/10 transition-colors border-l border-gold/10 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4 text-charcoal" />
                  </button>
                </div>

                <AnimatePresence>
                  {quantity > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -20, height: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pl-1 flex items-center gap-2">
                        <span className="text-[10px] text-charcoal/40 uppercase tracking-widest font-bold">Total Selection:</span>
                        <span className="text-sm font-serif text-gold font-bold">
                          ${(finalPrice * quantity).toFixed(2)}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button 
                onClick={handleAddToCart}
                className={`btn-primary w-full sm:flex-1 h-14 flex items-center justify-center relative overflow-hidden active:scale-[0.98] transition-colors duration-500 ${addedToCart ? 'bg-charcoal text-gold border-charcoal' : ''}`}
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.div 
                      key="added"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-bold tracking-widest">ADDED TO BAG</span>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="add"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="flex items-center gap-3"
                    >
                      <span className="font-bold tracking-widest">ADD TO SHOPPING BAG</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Subtle shine effect on click */}
                {addedToCart && (
                  <motion.div 
                    initial={{ x: '-150%', opacity: 0 }}
                    animate={{ x: '250%', opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute top-0 bottom-0 w-32 bg-white/20 skew-x-[-25deg] pointer-events-none z-10"
                  />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
