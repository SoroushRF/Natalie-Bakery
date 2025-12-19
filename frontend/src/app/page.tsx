import Link from "next/link";
import { fetchAPI, getSiteContent } from "@/utils/api";

export const revalidate = 0; // Disable revalidation for immediate updates as requested

export default async function Home() {
  let featuredProducts = [];
  let siteContent = null;

  try {
    [featuredProducts, siteContent] = await Promise.all([
      fetchAPI('/products/?limit=4', { cache: 'no-store' } as any),
      getSiteContent()
    ]);
  } catch (err) {
    console.error("Failed to fetch data for home page", err);
  }

  const heroImage = siteContent?.hero_main_image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
  const heroTitle = siteContent?.hero_title || 'The Art of Persian Pastry';
  const heroSubtitle = siteContent?.hero_subtitle || 'Delicate saffron, cardamom, and rosewater masterpieces crafted for the most discerning palates.';
  const heroButtonText = siteContent?.hero_button_text || 'Explore the Collection';

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('${heroImage}')` }}
      >
        <div className="absolute inset-0 bg-charcoal/40" />
        <div className="relative text-center px-4">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight">
            {heroTitle}
          </h1>
          <p className="text-cream text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            {heroSubtitle}
          </p>
          <Link href="/shop" className="btn-primary">
            {heroButtonText}
          </Link>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4 uppercase tracking-widest text-charcoal">Featured Creations</h2>
            <div className="w-20 h-1 bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product: any) => (
                <div key={product.id} className="group card flex flex-col items-center text-center">
                  <div className="relative w-full aspect-square mb-6 overflow-hidden">
                    <img 
                      src={product.image || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'} 
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="font-serif text-xl mb-2 text-charcoal">{product.name}</h3>
                  <p className="text-gold font-semibold mb-4">${product.price}</p>
                  <Link href={`/product/${product.slug}`} className="text-xs uppercase tracking-[0.2em] text-charcoal/60 hover:text-gold transition-colors">
                    View Creation
                  </Link>
                </div>
              ))
            ) : (
                <div className="col-span-full text-center text-charcoal/40">
                    No products available.
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Craftsmanship/Story Section */}
      <section className="py-24 bg-white border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-serif mb-8 text-charcoal leading-tight">
              {siteContent?.about_title || "Handcrafted with Generations of Tradition"}
            </h2>
            <div className="text-charcoal/70 mb-8 leading-relaxed whitespace-pre-line">
              {siteContent?.about_description || "Every item at Natalie Bakery is a labor of love. We use only the finest saffron from Khorasan, premium organic rosewater, and locally sourced dairy to ensure that every bite transports you to the heart of Persian heritage.\n\nOur master bakers follow centuries-old techniques, blending them with modern luxury to create an unforgettable sensory experience."}
            </div>

            {/* Dynamic Features/Text Blocks */}
            {siteContent?.features?.length > 0 && (
              <div className="space-y-6 mb-8">
                {siteContent.features.map((feature: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-gold/30 pl-4">
                    <h3 className="font-serif text-lg text-charcoal mb-1">{feature.title}</h3>
                    <p className="text-charcoal/60 text-sm whitespace-pre-line">{feature.text}</p>
                  </div>
                ))}
              </div>
            )}

            <Link href="/contact" className="text-gold font-semibold uppercase tracking-widest text-sm border-b-2 border-gold pb-1 hover:text-charcoal hover:border-charcoal transition-all">
              {siteContent?.contact_tagline || "Visit Our Boutique"}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src={siteContent?.about_side_image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"} 
              alt="Artisan Baking 1" 
              className="w-full h-64 object-cover" 
            />
            <img 
              src={siteContent?.about_side_image_2 || "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=400&q=80"} 
              alt="Artisan Baking 2" 
              className="mt-8 w-full h-64 object-cover" 
            />
          </div>
        </div>
      </section>

      {/* Dynamic Gallery Section (Add/Remove Pics) */}
      {siteContent?.gallery_images?.length > 0 && (
        <section className="py-24 bg-cream/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {siteContent.gallery_images.map((item: any, idx: number) => (
                <div key={idx} className="aspect-square relative overflow-hidden group">
                  <img 
                    src={item.image} 
                    alt={item.caption || `Gallery ${idx}`}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  {item.caption && (
                    <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-cream text-xs uppercase tracking-widest px-4 text-center">{item.caption}</p>
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
