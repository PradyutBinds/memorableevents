import { useEffect } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Award, Heart, Compass, Shield, Users, Sparkles, Star } from "lucide-react";

const TIMELINE = [
  { year: "2009", title: "Foundation", desc: "Memorable Events was founded in Shimla with a vision to bring world-class event management to the Himalayas." },
  { year: "2012", title: "First Grand Wedding", desc: "Orchestrated our first 500-guest destination wedding in the mountains — a turning point that defined our reputation." },
  { year: "2015", title: "Corporate Expansion", desc: "Expanded into corporate events, partnering with leading tech and FMCG brands for conferences and product launches." },
  { year: "2018", title: "Regional Recognition", desc: "Named Himachal Pradesh's Best Event Management Company by the Tourism & Hospitality Excellence Awards." },
  { year: "2021", title: "Digital Integration", desc: "Launched our end-to-end digital event management platform, enabling seamless virtual and hybrid events." },
  { year: "2024", title: "Premium Division", desc: "Established our Ultra-Luxury division catering exclusively to high-net-worth clients seeking bespoke mountain experiences." },
];

const VALUES = [
  { icon: Award, title: "Excellence Without Compromise", desc: "We hold every element — from the grand arch to the table napkin — to the same standard of perfection." },
  { icon: Heart, title: "Deeply Personal", desc: "Every event is a reflection of its hosts. We listen, absorb, and translate your personality into unforgettable design." },
  { icon: Compass, title: "Creative Boldness", desc: "We push past convention to discover the unexpected idea that transforms a good event into a legendary one." },
  { icon: Shield, title: "Absolute Reliability", desc: "On the day itself, you relax. Our team anticipates every scenario so nothing is left to chance." },
  { icon: Users, title: "Collaborative Spirit", desc: "We work as an extension of your family — transparent, communicative, and invested in your joy." },
  { icon: Sparkles, title: "Himalayan Soul", desc: "We carry the warmth and grandeur of the mountains into everything we create — local expertise, global execution." },
];

const TEAM = [
  {
    name: "Vikram Sharma",
    role: "Founder & Creative Director",
    desc: "With 15 years of crafting luxury events across India, Vikram's vision and relentless pursuit of perfection set the standard for everything we do.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Ananya Kapoor",
    role: "Head of Weddings",
    desc: "A former luxury hotel event manager, Ananya brings an uncompromising eye for detail and a gift for transforming venues into dreamscapes.",
    img: "https://images.unsplash.com/photo-1494790108755-2616b2d0eeaa?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Rohit Thakur",
    role: "Corporate Events Director",
    desc: "Rohit's background in corporate communications and hospitality ensures every brand event delivers both impact and impeccable execution.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Preethi Nair",
    role: "Head of Design & Décor",
    desc: "A trained interior designer turned event stylist, Preethi's aesthetic sensibility turns raw spaces into extraordinary environments.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
  },
];

const ACHIEVEMENTS = [
  { value: "15+", label: "Years of Excellence" },
  { value: "500+", label: "Events Crafted" },
  { value: "50+", label: "Premium Venues" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "12+", label: "Industry Awards" },
  { value: "5,000+", label: "Happy Guests" },
];

const PROCESS = [
  { step: "01", title: "Consultation", desc: "A deep-dive conversation to understand your vision, values, and expectations." },
  { step: "02", title: "Concept Design", desc: "Custom mood boards, theme concepts, and experience blueprints crafted for you alone." },
  { step: "03", title: "Detailed Planning", desc: "Every vendor, timeline, and logistics element locked in with precision." },
  { step: "04", title: "Flawless Delivery", desc: "Our team executes every detail on the day, so you live every moment fully." },
];

export default function About() {
  useEffect(() => {
    document.title = "About Us — Memorable Events";
  }, []);

  return (
    <PublicLayout>
      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex items-end justify-center pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=2400&q=90"
            alt="Memorable Events Team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-secondary/20" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <span className="text-primary font-medium tracking-[0.4em] uppercase text-xs mb-6 block">Who We Are</span>
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 leading-[1.05]">
              About Universal<br /><em className="text-primary not-italic">Agencies</em>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Shimla's most trusted luxury event management house — where Himalayan warmth meets international elegance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="py-28 md:py-36 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
              <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-6 block">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-8 leading-[1.1]">
                Born in the Mountains,<br />Built for Extraordinary Moments
              </h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Memorable Events was founded in 2009 by Vikram Sharma with a singular conviction: that the mountains of Himachal Pradesh deserved an event management company as grand as its landscapes.
                </p>
                <p>
                  What began as a boutique wedding planning service in a small office in Lower Bazaar, Shimla, has grown into Himachal Pradesh's most respected full-service event management house — with a portfolio spanning intimate mountaintop elopements to 2,000-guest corporate galas.
                </p>
                <p>
                  Today, our team of 25 dedicated professionals blends the warmth of traditional Indian hospitality with the precision of international luxury standards. Every event we touch becomes a story worth telling for generations.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=500&q=80" alt="Event 1" className="w-full h-64 object-cover" />
                <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=500&q=80" alt="Event 2" className="w-full h-64 object-cover mt-12" />
                <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=500&q=80" alt="Event 3" className="w-full h-64 object-cover -mt-4" />
                <img src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=500&q=80" alt="Event 4" className="w-full h-64 object-cover mt-8" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="py-28 md:py-36 bg-secondary text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-0.5">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="bg-secondary/80 p-16 border border-white/10">
              <div className="w-14 h-14 border border-primary flex items-center justify-center mb-8">
                <Compass className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-3xl font-serif text-white mb-6">Our Mission</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                To craft transformative event experiences that honour our clients' stories — delivering unparalleled creativity, precision, and warmth at every occasion, while placing Shimla firmly on the map of global luxury event management.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="bg-primary p-16">
              <div className="w-14 h-14 border border-secondary/30 flex items-center justify-center mb-8">
                <Star className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-3xl font-serif text-secondary mb-6">Our Vision</h3>
              <p className="text-secondary/80 text-lg leading-relaxed">
                To be the definitive choice for luxury events across the Himalayas — a name that evokes trust, artistry, and the absolute assurance that every moment will be flawless, memorable, and uniquely yours.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS / STATS ── */}
      <section className="py-28 md:py-36 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-4 block">By the Numbers</span>
            <h2 className="text-4xl md:text-6xl font-serif text-foreground leading-[1.1]">Fifteen Years of<br />Making History</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
            {ACHIEVEMENTS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-12 text-center border border-border/50 bg-background hover:bg-accent/20 transition-colors"
              >
                <div className="text-5xl md:text-6xl font-serif text-primary mb-3">{stat.value}</div>
                <div className="text-muted-foreground text-sm font-medium uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="py-28 md:py-36 bg-accent/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-4 block">What We Stand For</span>
            <h2 className="text-4xl md:text-6xl font-serif text-foreground leading-[1.1]">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-border/20">
            {VALUES.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-12 bg-background hover:bg-secondary transition-all duration-500"
              >
                <val.icon className="w-8 h-8 text-primary group-hover:text-primary mb-8" />
                <h3 className="text-xl font-serif text-foreground group-hover:text-white mb-4 transition-colors duration-500">{val.title}</h3>
                <p className="text-muted-foreground group-hover:text-white/70 text-sm leading-relaxed transition-colors duration-500">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-28 md:py-36 bg-secondary text-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-4 block">Our Journey</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white leading-[1.1]">Milestones That<br />Shaped Us</h2>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-primary/30 -translate-x-1/2" />
            <div className="space-y-12 md:space-y-0">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className={`relative md:grid md:grid-cols-2 md:gap-16 md:mb-16 ${i % 2 === 0 ? "" : "md:direction-rtl"}`}
                >
                  <div className={`${i % 2 === 0 ? "md:text-right md:pr-16" : "md:col-start-2 md:pl-16"} pb-8 md:pb-0`}>
                    <div className="text-primary text-4xl font-serif font-bold mb-3">{item.year}</div>
                    <h3 className="text-2xl font-serif text-white mb-3">{item.title}</h3>
                    <p className="text-white/60 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className={`hidden md:flex items-start ${i % 2 === 0 ? "justify-start pl-16" : "justify-end pr-16 md:col-start-1 md:row-start-1"}`}>
                    <div className="w-4 h-4 rounded-full bg-primary mt-2 ring-4 ring-primary/20" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDER MESSAGE ── */}
      <section className="py-28 md:py-36 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                  alt="Vikram Sharma - Founder"
                  className="w-full h-[500px] object-cover object-top"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-primary p-6">
                  <div className="text-secondary font-serif text-xl font-bold">Vikram Sharma</div>
                  <div className="text-secondary/80 text-sm">Founder & Creative Director</div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-6 block">A Message from the Founder</span>
              <blockquote className="text-3xl md:text-4xl font-serif text-foreground leading-[1.3] mb-8 italic">
                "Every event is a chapter in someone's life story. I consider it our deepest privilege to help write it beautifully."
              </blockquote>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  When I started Memorable Events, I wanted to create something that would endure — not just a business, but a legacy of extraordinary moments crafted with love and intention.
                </p>
                <p>
                  Fifteen years later, watching our clients laugh, cry with joy, and hold each other close at events we've built together — that is everything. The Himalayas taught me that grandeur and intimacy are not opposites. They are perfect partners. That is what we bring to every event.
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-border">
                <div className="text-foreground font-semibold">Vikram Sharma</div>
                <div className="text-muted-foreground text-sm">Founder & Creative Director, Memorable Events</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-28 md:py-36 bg-accent/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-4 block">The Team</span>
            <h2 className="text-4xl md:text-6xl font-serif text-foreground leading-[1.1]">The Artisans<br />Behind Every Event</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden mb-6 h-80">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                </div>
                <div className="text-primary text-xs font-medium tracking-widest uppercase mb-1">{member.role}</div>
                <h3 className="text-xl font-serif text-foreground mb-2">{member.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-28 md:py-36 bg-secondary text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-4 block">How We Work</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white leading-[1.1]">Your Journey With Us</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-1 bg-white/5">
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="p-12 bg-secondary/60 hover:bg-primary/10 transition-colors"
              >
                <div className="text-primary/30 text-7xl font-serif font-bold mb-6">{p.step}</div>
                <div className="w-10 h-px bg-primary mb-6" />
                <h3 className="text-xl font-serif text-white mb-4">{p.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 md:py-36 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-8 block">Work With Us</span>
            <h2 className="text-5xl md:text-7xl font-serif text-foreground mb-8 leading-[1.05]">
              Ready to Create<br /><em className="text-primary not-italic">Your Story?</em>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Let's sit down over chai and begin planning the event of a lifetime. Your vision deserves nothing less.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="px-12 h-14 text-base rounded-none uppercase tracking-widest">
                <Link href="/book">Book a Consultation</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-12 h-14 text-base rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-widest">
                <Link href="/contact" className="flex items-center gap-2">Get in Touch <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
