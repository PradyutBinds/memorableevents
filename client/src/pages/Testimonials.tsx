import { useEffect } from "react";
import { useListTestimonials } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Loader2, Star, Quote } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Testimonials() {
  const { data: testimonials, isLoading } = useListTestimonials();

  useEffect(() => {
    document.title = "Client Stories — Memorable Events";
  }, []);

  const active = testimonials?.filter(t => t.isActive) || [];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end justify-center pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=2400&q=90" alt="Client Stories" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-secondary/20" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <span className="text-primary font-medium tracking-[0.4em] uppercase text-xs mb-6 block">What Our Clients Say</span>
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 leading-[1.05]">
              Client <em className="text-primary not-italic">Stories</em>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Real words from real clients who trusted us with their most important moments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-primary py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: "500+", label: "Events Curated" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "5★", label: "Average Rating" },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-1">{stat.value}</div>
                <div className="text-secondary/80 text-xs font-medium uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <section className="py-28 md:py-36 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
          ) : active.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No testimonials yet.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {active.map((testimonial, i) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  className={`bg-card border border-border p-10 flex flex-col ${i === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
                >
                  <Quote className="w-10 h-10 text-primary/20 mb-6 shrink-0" />
                  <p className="text-foreground/80 text-lg leading-relaxed italic mb-8 flex-1">
                    "{testimonial.review}"
                  </p>
                  <div className="border-t border-border/50 pt-6">
                    <div className="flex items-center gap-4">
                      {testimonial.avatarUrl ? (
                        <img src={testimonial.avatarUrl} alt={testimonial.clientName} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-serif font-bold text-xl shrink-0">
                          {testimonial.clientName.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-semibold text-foreground truncate">{testimonial.clientName}</h4>
                        <p className="text-sm text-muted-foreground truncate">{testimonial.eventType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 mt-4">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${s <= (testimonial.rating || 5) ? "fill-primary text-primary" : "text-muted"}`} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-secondary text-white text-center">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-[1.1]">
              Ready to Write<br />Your Story?
            </h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join hundreds of delighted clients. Let us craft the event you've always imagined.
            </p>
            <Button asChild size="lg" className="px-12 h-14 rounded-none uppercase tracking-widest text-base">
              <Link href="/book">Begin Your Journey</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
