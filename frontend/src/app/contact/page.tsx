"use client";
import { Mail, Phone, MapPin, Instagram, Clock, Send } from "lucide-react";

export default function Contact() {
  const businessInfo = {
    name: "Natalie Bakery Limited",
    address: "55 Glen Cameron Rd, Unit 14, Thornhill, ON L3T 5W2",
    phone: "+1 416-566-9693",
    instagram: "@nataliebakery.toronto",
    hours: [
      { days: "Monday - Saturday", time: "9:00 AM – 8:00 PM" },
      { days: "Sunday", time: "10:00 AM – 7:00 PM" },
    ]
  };

  return (
    <div className="bg-cream min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-20">
          <span className="text-xs uppercase tracking-[0.5em] text-gold font-bold mb-4 block">Get in Touch</span>
          <h1 className="text-5xl md:text-6xl font-serif text-charcoal mb-6">Contact Us</h1>
          <div className="w-24 h-1 bg-gold mx-auto" />
        </header>

        <div className="grid lg:grid-cols-2 gap-20">
          {/* Information Column */}
          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-serif text-charcoal mb-8 italic">Visit Our Boutique</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gold/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-1">Address</h3>
                    <p className="text-charcoal text-lg leading-relaxed">
                      {businessInfo.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-gold/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-1">Phone</h3>
                    <a href={`tel:${businessInfo.phone.replace(/\D/g, '')}`} className="text-charcoal text-lg hover:text-gold transition-colors">
                      {businessInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-gold/10 p-3 rounded-full">
                    <Instagram className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-1">Instagram</h3>
                    <a href="https://instagram.com/nataliebakery.toronto" target="_blank" className="text-charcoal text-lg hover:text-gold transition-colors">
                      {businessInfo.instagram}
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 border border-gold/10 shadow-sm">
              <h2 className="text-2xl font-serif text-charcoal mb-6 flex items-center gap-3">
                <Clock className="h-5 w-5 text-gold" /> Boutique Hours
              </h2>
              <div className="space-y-4">
                {businessInfo.hours.map((h, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gold/5 pb-2">
                    <span className="text-charcoal/70">{h.days}</span>
                    <span className="font-semibold text-charcoal">{h.time}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Map Column */}
          <div className="space-y-8">
             <div className="h-[400px] w-full border border-gold/20 shadow-xl grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden group">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2877.9427320490!2d-79.4187!3d43.8153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b2d6ffaaaaaaa%3A0x7d9f9693!2s55+Glen+Cameron+Rd+%2314%2C+Thornhill%2C+ON+L3T+5W2!5e0!3m2!1sen!2sca!4v1713555000000!5m2!1sen!2sca" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="group-hover:scale-105 transition-transform duration-1000"
                ></iframe>
             </div>
             
             <div className="bg-charcoal p-10 text-cream">
               <h2 className="font-serif text-3xl mb-4 italic text-gold">Custom Orders</h2>
               <p className="text-cream/70 leading-relaxed mb-8">
                 Looking for a custom masterpiece for your next celebration? 
                 Call us directly or visit our boutique to discuss flavor profiles and designs.
               </p>
               <a href={`tel:${businessInfo.phone.replace(/\D/g, '')}`} className="btn-primary w-full text-center inline-block">
                 Call Now to Inquire
               </a>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
