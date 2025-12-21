import Link from "next/link";
import { fetchAPI, getSiteContent } from "@/utils/api";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0; // Disable revalidation for immediate updates as requested

export default async function Home() {
  let featuredProducts = [];
  let recentProducts = [];
  let siteContent = null;

  try {
    [featuredProducts, recentProducts, siteContent] = await Promise.all([
      fetchAPI('/products/?is_featured=1&limit=12', { cache: 'no-store' } as any),
      fetchAPI('/products/?ordering=-created_at&limit=8', { cache: 'no-store' } as any),
      getSiteContent()
    ]);
  } catch (err) {
    console.error("Failed to fetch data for home page", err);
  }

  const heroImage = siteContent?.hero_main_image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
  const heroTitle = siteContent?.hero_title || 'The Art of Persian Pastry';
  const heroSubtitle = siteContent?.hero_subtitle || 'Delicate saffron, cardamom, and rosewater masterpieces crafted for the most discerning palates.';
  const heroButtonText = siteContent?.hero_button_text || 'Explore the Collection';

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const arrivalsToShow = recentProducts
    .filter((p: any) => new Date(p.created_at) >= sevenDaysAgo)
    .slice(0, 8);

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative h-[85vh] md:h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('${heroImage}')` }}
      >
        <div className="absolute inset-0 bg-charcoal/40" />
        <div className="relative text-center px-4 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight leading-tight">
            {heroTitle}
          </h1>
          <p className="text-cream text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/shop" className="btn-primary">
              {heroButtonText}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 md:py-24 bg-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-4 uppercase tracking-widest text-charcoal">Featured Creations</h2>
            <div className="w-16 md:w-20 h-1 bg-gold mx-auto" />
            <p className="mt-4 text-charcoal/60 font-light italic text-sm md:text-base">Hand-selected masterworks of Persian culinary art.</p>
          </div>

          {featuredProducts.length > 0 ? (
            <FeaturedCarousel products={featuredProducts} />
          ) : (
            <div className="col-span-full text-center text-charcoal/40 py-12 border border-dashed border-gold/20">
                No featured products selected.
            </div>
          )}
          
          <div className="mt-12 md:mt-20 text-center">
            <Link href="/shop" className="inline-flex flex-col items-center group">
                <span className="btn-primary mb-4 px-8 md:px-12 transition-transform group-hover:scale-105">Shop Entire Collection</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Added Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-10 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-baseline md:items-end mb-12 md:mb-16 gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-4 uppercase tracking-widest text-charcoal">Latest Arrivals</h2>
              <div className="w-16 md:w-20 h-1 bg-gold" />
            </div>
            <p className="text-charcoal/60 font-light max-w-sm text-sm md:text-base">The newest additions to our collection of fine Persian pastries and custom confections.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {arrivalsToShow.length > 0 ? (
              arrivalsToShow.map((product: any) => (
                <ProductCard key={product.id} product={product} variant="recent" />
              ))
            ) : (
                <div className="col-span-full text-center text-charcoal/40 py-12">
                    Our master bakers are currently crafting new masterpieces for this week.
                </div>
            )}
          </div>

          <div className="mt-12 md:mt-20 text-center">
            <Link href="/shop" className="inline-flex flex-col items-center group">
                <span className="btn-primary mb-4 px-8 md:px-12 transition-transform group-hover:scale-105">Shop More Items</span>
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-charcoal/40 group-hover:text-gold transition-colors">Everything we bake with love</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Craftsmanship/Story Section */}
      <section className="py-16 md:py-24 bg-cream border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-serif mb-6 md:mb-8 text-charcoal leading-tight">
              {siteContent?.about_title || "Handcrafted with Generations of Tradition"}
            </h2>
            <div className="text-charcoal/70 mb-8 leading-relaxed whitespace-pre-line text-sm md:text-lg">
              {siteContent?.about_description || "Every item at Natalie Bakery is a labor of love. We use only the finest saffron from Khorasan, premium organic rosewater, and locally sourced dairy to ensure that every bite transports you to the heart of Persian heritage.\n\nOur master bakers follow centuries-old techniques, blending them with modern luxury to create an unforgettable sensory experience."}
            </div>

            {/* Dynamic Features/Text Blocks */}
            {siteContent?.features?.length > 0 && (
              <div className="space-y-6 mb-12">
                {siteContent.features.map((feature: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-gold/30 pl-6">
                    <h3 className="font-serif text-lg md:text-xl text-charcoal mb-2">{feature.title}</h3>
                    <p className="text-charcoal/60 text-xs md:text-sm whitespace-pre-line leading-relaxed">{feature.text}</p>
                  </div>
                ))}
              </div>
            )}

            <Link href="/contact" className="text-gold font-bold uppercase tracking-[0.2em] text-[10px] md:text-sm border-b-2 border-gold pb-2 hover:text-charcoal hover:border-charcoal transition-all inline-block">
              {siteContent?.contact_tagline || "Visit Our Boutique"}
            </Link>
          </div>
          <div className="order-1 md:order-2 grid grid-cols-2 gap-4 md:gap-6 p-2 md:p-4 bg-white/50 border border-white">
            <img 
              src={siteContent?.about_side_image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"} 
              alt="Artisan Baking 1" 
              className="w-full h-48 sm:h-64 md:h-80 object-cover shadow-2xl" 
            />
            <img 
              src={siteContent?.about_side_image_2 || "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=400&q=80"} 
              alt="Artisan Baking 2" 
              className="mt-6 md:mt-12 w-full h-48 sm:h-64 md:h-80 object-cover shadow-2xl" 
            />
          </div>
        </div>
      </section>

      {/* Dynamic Gallery Section */}
      {siteContent?.gallery_images?.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {siteContent.gallery_images.map((item: any, idx: number) => (
                <div key={idx} className="aspect-square relative overflow-hidden group shadow-sm bg-cream/20">
                  <img 
                    src={item.image} 
                    alt={item.caption || `Gallery ${idx}`}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  {item.caption && (
                    <div className="absolute inset-0 bg-charcoal/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4 md:p-6">
                      <p className="text-cream text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-center leading-loose">{item.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
