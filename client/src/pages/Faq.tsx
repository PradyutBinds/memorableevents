import { useEffect, useState } from "react";
import { useListFaqs } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronDown, MessageCircle, Phone, Mail } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetSettings } from "@workspace/api-client-react";

export default function Faq() {
  const { data: faqs, isLoading } = useListFaqs();
  const { data: settings } = useGetSettings();
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    document.title = "FAQ — Memorable Events";
  }, []);

  const active = faqs?.filter(f => f.isActive) || [];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end justify-center pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=2400&q=90" alt="FAQ" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-secondary/20" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <span className="text-primary font-medium tracking-[0.4em] uppercase text-xs mb-6 block">Got Questions?</span>
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 leading-[1.05]">
              Frequently Asked<br /><em className="text-primary not-italic">Questions</em>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Everything you need to know about planning your event with Memorable Events.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-28 md:py-36 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-3 gap-16 md:gap-24">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-4 block">Need More Help?</span>
                <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6 leading-[1.2]">
                  Can't find your answer?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Our team is always happy to answer any questions you have. Reach out and we'll respond within one business day.
                </p>
                <div className="space-y-4">
                  <a href={`tel:${settings?.phone || "9816585535"}`} className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group">
                    <div className="w-10 h-10 border border-border group-hover:border-primary group-hover:bg-primary/5 flex items-center justify-center transition-colors">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Call Us</div>
                      <div className="font-medium text-sm">{settings?.phone || "9816585535"}</div>
                    </div>
                  </a>
                  <a href={`mailto:${settings?.email || "info@universalagencies.in"}`} className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group">
                    <div className="w-10 h-10 border border-border group-hover:border-primary group-hover:bg-primary/5 flex items-center justify-center transition-colors">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Email Us</div>
                      <div className="font-medium text-sm">{settings?.email || "info@universalagencies.in"}</div>
                    </div>
                  </a>
                  <Link href="/contact" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group">
                    <div className="w-10 h-10 border border-border group-hover:border-primary group-hover:bg-primary/5 flex items-center justify-center transition-colors">
                      <MessageCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Message Us</div>
                      <div className="font-medium text-sm">Send a Message</div>
                    </div>
                  </Link>
                </div>
                <div className="mt-10">
                  <Button asChild className="rounded-none w-full h-12 uppercase tracking-widest text-xs">
                    <Link href="/book">Book a Consultation</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Accordion */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
              ) : active.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">No FAQs available yet.</div>
              ) : (
                <div className="divide-y divide-border border-t border-b border-border">
                  {active.map((faq, i) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <button
                        onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                        className="w-full text-left flex items-start justify-between gap-6 py-7 hover:text-primary transition-colors duration-200 group"
                      >
                        <span className="font-serif text-lg md:text-xl text-foreground group-hover:text-primary transition-colors leading-snug">
                          {faq.question}
                        </span>
                        <motion.div
                          animate={{ rotate: openId === faq.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="shrink-0 mt-1"
                        >
                          <ChevronDown className="w-5 h-5 text-primary" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {openId === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            className="overflow-hidden"
                          >
                            <p className="pb-7 text-muted-foreground text-base leading-relaxed pr-8">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-accent/20 text-center">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground text-lg mb-6">Still have questions? We're here to help.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="rounded-none px-10 h-12 uppercase tracking-widest text-xs">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-none px-10 h-12 uppercase tracking-widest text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link href="/book">Book an Event</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
