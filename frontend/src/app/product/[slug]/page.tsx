"use client";
import { useState, useEffect } from "react";
import { fetchAPI } from "@/utils/api";
import { useCartStore } from "@/store/useCartStore";
import { Plus, Minus, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const prod = await fetchAPI(`/products/${params.slug}/`);
        setProduct(prod);
        
        if (prod.is_custom_cake) {
          const options = await fetchAPI('/cake-options/');
          setCakeOptions(options);
          
          // Set defaults
          const flavors = options.filter((o: any) => o.option_type === 'FLAVOR');
          const fillings = options.filter((o: any) => o.option_type === 'FILLING');
          const sizes = options.filter((o: any) => o.option_type === 'SIZE');
          
          if (flavors.length) setSelectedFlavor(flavors[0].name);
          if (fillings.length) setSelectedFilling(fillings[0].name);
          if (sizes.length) setSelectedSize(sizes[0].name);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [params.slug]);

  const handleAddToCart = () => {
    const options = product.is_custom_cake ? {
      flavor: selectedFlavor,
      filling: selectedFilling,
      size: selectedSize
    } : undefined;

    addItem(product, quantity, options);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <div className="card p-0 overflow-hidden">
            <img 
              src={product.image || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80'} 
              alt={product.name}
              className="w-full h-auto object-cover aspect-square"
            />
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <span className="text-xs uppercase tracking-[0.4em] text-gold mb-2 block">{product.category_name}</span>
              <h1 className="text-5xl font-serif text-charcoal mb-4">{product.name}</h1>
              <p className="text-2xl text-gold font-light">${product.price}</p>
            </div>

            <p className="text-charcoal/70 leading-relaxed text-lg">
              {product.description}
            </p>

            {product.is_custom_cake && (
              <div className="space-y-6 pt-6 border-t border-gold/10">
                <h3 className="font-serif text-xl text-charcoal">Customization Options</h3>
                <p className="text-xs text-gold uppercase tracking-widest font-bold">Note: Custom cakes require 3-day lead time.</p>
                
                <div className="grid grid-cols-1 gap-6">
                  {/* Flavor */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-charcoal/60 mb-2 block">Choose Flavor</label>
                    <select 
                      value={selectedFlavor}
                      onChange={(e) => setSelectedFlavor(e.target.value)}
                      className="w-full bg-white border border-gold/20 p-3 rounded-none focus:outline-none focus:border-gold"
                    >
                      {flavors.map((f) => <option key={f.id} value={f.name}>{f.name}</option>)}
                    </select>
                  </div>

                  {/* Filling */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-charcoal/60 mb-2 block">Choose Filling</label>
                    <select 
                      value={selectedFilling}
                      onChange={(e) => setSelectedFilling(e.target.value)}
                      className="w-full bg-white border border-gold/20 p-3 rounded-none focus:outline-none focus:border-gold"
                    >
                      {fillings.map((f) => <option key={f.id} value={f.name}>{f.name}</option>)}
                    </select>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-charcoal/60 mb-2 block">Select Size</label>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedSize(s.name)}
                          className={`px-6 py-2 border transition-all ${selectedSize === s.name ? 'bg-gold text-white border-gold' : 'border-gold/20 text-charcoal hover:border-gold'}`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-8 border-t border-gold/10 flex flex-col sm:flex-row gap-6">
              <div className="flex items-center border border-gold/20 h-14">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 hover:bg-gold/10">
                  <Minus className="h-4 w-4" />
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  readOnly 
                  className="w-12 text-center bg-transparent font-medium"
                />
                <button onClick={() => setQuantity(quantity + 1)} className="p-4 hover:bg-gold/10">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className="btn-primary flex-1 h-14 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {addedToCart ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    ADDED TO BAG
                  </>
                ) : (
                  "ADD TO SHOPPING BAG"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
