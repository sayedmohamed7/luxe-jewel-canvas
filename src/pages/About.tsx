import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/Logo";

import craftsmanshipImage from "@/assets/craftsmanship.jpg";
import lifestyleImage from "@/assets/collection-lifestyle.jpg";
import heroImage from "@/assets/hero-jewelry.jpg";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Le Bijou Boutique heritage"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-noir/50" />
        </div>
        <div className="relative z-10 text-center text-ivory px-6">
          <Logo size="lg" className="mx-auto mb-6 text-ivory" />
          <p className="luxury-subheading text-ivory/80 mb-4">Est. 1987</p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-normal">
            Our Story
          </h1>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 md:py-32">
        <div className="luxury-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-serif text-2xl md:text-3xl leading-relaxed text-foreground mb-8">
              For over three decades, Le Bijou Boutique has been crafting
              exceptional jewelry that transcends time, blending heritage
              craftsmanship with contemporary elegance.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Born from a passion for beauty and precision, our maison has become
              a destination for those who seek jewelry that tells a story—pieces
              that become cherished heirlooms, passed down through generations.
            </p>
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="py-24 bg-secondary">
        <div className="luxury-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="luxury-subheading mb-4">Our Heritage</p>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">
                A Legacy of
                <br />
                <span className="italic">Excellence</span>
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Le Bijou Boutique was founded in 1987 in the heart of Dubai,
                  at a time when the city was just beginning its transformation
                  into a global destination for luxury.
                </p>
                <p>
                  Our founder, inspired by the timeless beauty of classical
                  jewelry and the vibrant culture of the Middle East, set out to
                  create pieces that would capture the essence of both worlds.
                </p>
                <p>
                  Today, we continue that vision, creating jewelry that honors
                  tradition while embracing modern sensibilities.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src={lifestyleImage}
                alt="Heritage craftsmanship"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-24 md:py-32">
        <div className="luxury-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={craftsmanshipImage}
                alt="Artisan at work"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="luxury-subheading mb-4">The Craft</p>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">
                Master
                <br />
                <span className="italic">Artisanship</span>
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Every piece that leaves our atelier is the result of hundreds
                  of hours of meticulous work. Our master artisans, many of whom
                  have trained for decades, bring together traditional techniques
                  and contemporary innovation.
                </p>
                <p>
                  From the initial sketch to the final polish, each step is
                  executed with unwavering attention to detail. We source only
                  the finest gemstones and precious metals, ensuring that every
                  creation meets our exacting standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-noir text-ivory">
        <div className="luxury-container">
          <div className="text-center mb-16">
            <p className="luxury-subheading text-ivory/60 mb-4">Our Values</p>
            <h2 className="font-serif text-4xl md:text-5xl">
              What We Stand For
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 border border-primary/50 flex items-center justify-center">
                <span className="font-serif text-2xl text-primary">01</span>
              </div>
              <h3 className="font-serif text-xl mb-4">Timeless Design</h3>
              <p className="text-ivory/60 text-sm leading-relaxed">
                We create pieces that transcend trends, designed to be worn and
                treasured for generations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 border border-primary/50 flex items-center justify-center">
                <span className="font-serif text-2xl text-primary">02</span>
              </div>
              <h3 className="font-serif text-xl mb-4">Ethical Sourcing</h3>
              <p className="text-ivory/60 text-sm leading-relaxed">
                Every gemstone and precious metal is responsibly sourced,
                ensuring beauty without compromise.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 border border-primary/50 flex items-center justify-center">
                <span className="font-serif text-2xl text-primary">03</span>
              </div>
              <h3 className="font-serif text-xl mb-4">Personal Service</h3>
              <p className="text-ivory/60 text-sm leading-relaxed">
                Each client receives dedicated attention, from selection to
                care, ensuring a truly exceptional experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 md:py-32">
        <div className="luxury-container">
          <div className="max-w-3xl mx-auto text-center">
            <Logo size="md" className="mx-auto mb-8 text-primary" />
            <blockquote className="font-serif text-2xl md:text-3xl italic text-foreground mb-8">
              "True luxury lies not in opulence, but in the quiet confidence of
              exceptional craftsmanship."
            </blockquote>
            <p className="text-muted-foreground tracking-wider uppercase text-sm">
              — Founder's Philosophy
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
