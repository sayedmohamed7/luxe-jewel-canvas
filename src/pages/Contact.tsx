import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-24">
        <div className="luxury-container">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="luxury-subheading mb-4">Get in Touch</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Contact Us</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We'd love to hear from you. Whether you have a question about our
              collections, need assistance with an order, or simply want to say
              hello.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">
                      First Name
                    </label>
                    <Input
                      placeholder="Your first name"
                      className="border-foreground/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">
                      Last Name
                    </label>
                    <Input
                      placeholder="Your last name"
                      className="border-foreground/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="border-foreground/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    placeholder="+971 XX XXX XXXX"
                    className="border-foreground/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">
                    Message
                  </label>
                  <Textarea
                    placeholder="How can we assist you?"
                    rows={5}
                    className="border-foreground/20 focus:border-primary resize-none"
                  />
                </div>

                <Button variant="luxury" size="lg" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:pl-8">
              <div className="bg-secondary p-8 md:p-12 h-full">
                <h2 className="font-serif text-2xl mb-8">Visit Our Boutique</h2>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Address</h3>
                      <p className="text-muted-foreground text-sm">
                        The Dubai Mall, Fashion Avenue
                        <br />
                        Downtown Dubai, UAE
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Phone</h3>
                      <p className="text-muted-foreground text-sm">
                        +971 4 XXX XXXX
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
                      <p className="text-muted-foreground text-sm">
                        concierge@maisonlumiere.ae
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Opening Hours</h3>
                      <p className="text-muted-foreground text-sm">
                        Sunday – Thursday: 10am – 10pm
                        <br />
                        Friday – Saturday: 10am – 12am
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    For private viewing appointments or bespoke inquiries,
                    please call our concierge team directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
