export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <h3 className="font-serif text-2xl mb-4">NATALIE <span className="text-gold">BAKERY</span></h3>
            <p className="text-cream/60 text-sm leading-relaxed">
              Authentic Persian flavors meet modern culinary artistry. Handcrafted daily with premium ingredients and traditional recipes.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-lg mb-4 text-gold uppercase tracking-widest">Contact</h4>
            <ul className="text-sm text-cream/60 space-y-2">
              <li>123 Luxury Lane, Beverly Hills, CA</li>
              <li>(555) 123-4567</li>
              <li>hello@nataliebakery.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg mb-4 text-gold uppercase tracking-widest">Hours</h4>
            <ul className="text-sm text-cream/60 space-y-2">
              <li>Tue - Sat: 9:00 AM - 7:00 PM</li>
              <li>Sun: 10:00 AM - 6:00 PM</li>
              <li>Mon: Closed</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-cream/10 text-center text-[10px] text-cream/40 uppercase tracking-[0.2em]">
          &copy; 2024 Natalie Bakery. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
