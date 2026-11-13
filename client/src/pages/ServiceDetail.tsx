import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useGetService, useListServices } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const PROCESS = [
  { step: "01", title: "Initial Consultation", desc: "We discuss your vision, expectations, and event requirements in detail." },
  { step: "02", title: "Custom Proposal", desc: "We prepare a bespoke concept and detailed proposal tailored to your event." },
  { step: "03", title: "Vendor Curation", desc: "We source and brief the finest vendors, negotiating the best terms on your behalf." },
  { step: "04", title: "Day-of Execution", desc: "Our team takes full charge on the day so you can simply enjoy every moment." },
];

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const serviceId = parseInt(id, 10);
  const { data: service, isLoading } = useGetService(serviceId, { query: { enabled: !isNaN(serviceId) } });
  const { data: allServices } = useListServices();

  useEffect(() => {
    if (service) document.title = `${service.name} — Memorable Events`;
  }, [service]);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin h-10 w-10 text-primary" />
        </div>
      </PublicLayout>
    );
  }

  if (!service) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex flex-col items-center justify-center text-center pt-32 pb-24">
          <h2 className="text-3xl font-serif text-foreground mb-4">Service Not Found</h2>
          <p className="text-muted-foreground mb-8">This service doesn't exist or has been removed.</p>
          <Button asChild className="rounded-none"><Link href="/services">View All Services</Link></Button>
        </div>
      </PublicLayout>
    );
  }

  const others = allServices?.filter(s => s.isActive && s.id !== service.id).slice(0, 3) || [];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end justify-start pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={service.imageUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=90"}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest mb-8">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary">{service.name}</span>
            </div>
            <span className="text-primary font-medium tracking-[0.4em] uppercase text-xs mb-4 block">Our Service</span>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-[1.05] max-w-3xl">{service.name}</h1>
            <p className="text-xl text-white/70 max-w-2xl font-light leading-relaxed mb-10">
              {service.description}
            </p>
            <Button asChild size="lg" className="rounded-none px-10 h-14 uppercase tracking-widest text-sm">
              <Link href="/book">Book This Service</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Details */}
      <section className="py-28 md:py-36 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-3 gap-16 md:gap-24">
            {/* Main */}
            <div className="lg:col-span-2">
              <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-6 block">What's Included</span>
              <h2 className="text-4xl font-serif text-foreground mb-8 leading-[1.1]">
                Everything You Need,<br />Nothing Left to Chance
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-12">
                Our {service.name} service is crafted with meticulous attention to detail. From the initial concept to the final moment of the event, our team ensures every element reflects your vision and exceeds your expectations.
              </p>

              {service.features && (service.features as string[]).length > 0 && (
                <div>
                  <h3 className="text-2xl font-serif text-foreground mb-8">Key Inclusions</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {(service.features as string[]).map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="flex items-start gap-3 p-5 border border-border hover:border-primary/50 transition-colors"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Process */}
              <div className="mt-20">
                <h3 className="text-2xl font-serif text-foreground mb-10">Our Process</h3>
                <div className="space-y-6">
                  {PROCESS.map((p, i) => (
                    <motion.div
                      key={p.step}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="flex gap-6 p-6 bg-accent/20 border border-border/50"
                    >
                      <div className="text-primary/30 text-4xl font-serif font-bold leading-none shrink-0">{p.step}</div>
                      <div>
                        <h4 className="font-serif text-lg text-foreground mb-2">{p.title}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Book CTA */}
                <div className="bg-secondary p-8 text-white">
                  <h3 className="text-2xl font-serif mb-4">Ready to Book?</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    Take the first step toward an extraordinary event. Submit your details and our creative director will reach out personally.
                  </p>
                  <Button asChild className="w-full rounded-none h-12 uppercase tracking-widest text-xs">
                    <Link href="/book">Request a Consultation</Link>
                  </Button>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-white/50 text-xs text-center">Or call us: <a href="tel:9816585535" className="text-primary hover:underline">9816585535</a></p>
                  </div>
                </div>

                {/* Price indicator */}
                {service.priceRange && (
                  <div className="border border-border p-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Starting From</p>
                    <p className="text-3xl font-serif text-primary">{service.priceRange}</p>
                    <p className="text-xs text-muted-foreground mt-2">Final pricing based on requirements</p>
                  </div>
                )}

                {/* Other Services */}
                {others.length > 0 && (
                  <div className="border border-border p-6">
                    <h4 className="font-serif text-lg text-foreground mb-4">Other Services</h4>
                    <div className="space-y-3">
                      {others.map(s => (
                        <Link key={s.id} href={`/services/${s.id}`} className="flex items-center justify-between gap-3 group py-2 border-b border-border/50 last:border-0">
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors">{s.name}</span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
