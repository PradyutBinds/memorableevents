import { useEffect } from "react";
import { Link } from "wouter";
import { useListServices } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

const BENEFITS = [
  "Dedicated event director from first call to final curtain",
  "Exclusive access to 50+ premium venues across the Himalayas",
  "In-house creative and décor team",
  "Curated vendor network — caterers, photographers, florists",
  "24/7 support throughout planning and on the day",
  "Transparent pricing with no hidden costs",
];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=800&q=80",
];

const CATEGORIES = [
  { label: "Weddings", img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" },
  { label: "Corporate", img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80" },
  { label: "Celebrations", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80" },
  { label: "Private Events", img: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=600&q=80" },
];

export default function Services() {
  const { data: services, isLoading } = useListServices();

  useEffect(() => {
    document.title = "Our Services — Memorable Events";
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-end justify-center pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2400&q=90"
            alt="Luxury Event"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-secondary/20" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <span className="text-primary font-medium tracking-[0.4em] uppercase text-xs mb-6 block">What We Do</span>
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 leading-[1.05]">
              Our <em className="text-primary not-italic">Services</em>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              From intimate mountaintop ceremonies to grand corporate galas — every service is crafted to exceed your expectations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Alternating Layout */}
      <section className="py-28 md:py-36 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-4 block">Our Offerings</span>
            <h2 className="text-4xl md:text-6xl font-serif text-foreground leading-[1.1]">
              Bespoke Services for<br />Every Celebration
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
          ) : (
            <div className="space-y-0">
              {services?.filter(s => s.isActive).map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="group"
                >
                  <Link href={`/services/${service.id}`}>
                    <div className={`grid md:grid-cols-2 gap-0 border-b border-border/50 hover:bg-accent/10 transition-colors duration-500`}>
                      <div className={`relative h-64 md:h-80 overflow-hidden ${index % 2 === 1 ? "md:order-2" : ""}`}>
                        <img
                          src={service.imageUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className={`p-12 md:p-16 flex flex-col justify-center ${index % 2 === 1 ? "md:order-1" : ""}`}>
                        <div className="text-primary/40 text-xs font-medium tracking-widest uppercase mb-4">0{index + 1}</div>
                        <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-6">{service.name}</h3>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-8">{service.description}</p>
                        {service.features && (service.features as string[]).length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mb-8">
                            {(service.features as string[]).slice(0, 4).map((f: string) => (
                              <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                <span>{f}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all duration-300">
                          Explore Service <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-28 md:py-36 bg-secondary text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-6 block">The Universal Advantage</span>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-[1.1]">
                Why Every Service<br />We Offer Is Different
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-12">
                When you book with Memorable Events, you're not just hiring an event planner — you're partnering with a team whose entire focus is making your vision a reality, at a standard the Himalayas will remember.
              </p>
              <div className="space-y-4">
                {BENEFITS.map((b, i) => (
                  <motion.div
                    key={b}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-white/80">{b}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((cat) => (
                <div key={cat.label} className="relative overflow-hidden group">
                  <img src={cat.img} alt={cat.label} className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-secondary/60 group-hover:bg-secondary/40 transition-colors duration-500" />
                  <div className="absolute bottom-4 left-4 text-white font-serif text-lg">{cat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 md:py-36 bg-background text-center">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-8 block">Get Started</span>
            <h2 className="text-5xl md:text-7xl font-serif text-foreground mb-8 leading-[1.05]">
              Which Event Are<br />We <em className="text-primary not-italic">Crafting Together?</em>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Tell us about your vision. We'll tell you how we'll make it extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="px-12 h-14 text-base rounded-none uppercase tracking-widest">
                <Link href="/book">Book a Consultation</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-12 h-14 text-base rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-widest">
                <Link href="/contact">Ask a Question</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
