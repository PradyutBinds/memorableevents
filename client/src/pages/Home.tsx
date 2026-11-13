import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useGetSettings, useListServices, useListTestimonials, useListGallery } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ChevronRight, CheckCircle2, Quote, Play, Award, Users, Calendar, MapPin, Phone, Mail, ArrowDown } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const STATS = [
  { value: "15+", label: "Years of Excellence" },
  { value: "500+", label: "Events Curated" },
  { value: "50+", label: "Premium Venues" },
  { value: "98%", label: "Client Satisfaction" },
];

const PROCESS = [
  {
    step: "01",
    title: "Discovery Consultation",
    desc: "We begin with an in-depth conversation to understand your vision, preferences, and expectations — crafting a tailored blueprint for your event.",
  },
  {
    step: "02",
    title: "Concept & Design",
    desc: "Our creative team develops immersive mood boards, venue concepts, and thematic narratives that capture your unique story.",
  },
  {
    step: "03",
    title: "Precision Planning",
    desc: "From vendor selection to logistics, every detail is orchestrated with military precision so you can relax and savour every moment.",
  },
  {
    step: "04",
    title: "Flawless Execution",
    desc: "On the day, our dedicated team ensures seamless delivery — anticipating every need before you even realise it.",
  },
];

const WHY_US = [
  { icon: Award, title: "Award-Winning Team", desc: "Recognised as Himachal Pradesh's top event management agency, with accolades from leading industry bodies." },
  { icon: Users, title: "Bespoke Attention", desc: "A dedicated event director personally guides you from first call to final curtain, available 24/7." },
  { icon: MapPin, title: "Himalayan Expertise", desc: "Unrivalled access to premium venues and vendors across Shimla, Manali, and the wider Himalayan region." },
  { icon: Calendar, title: "End-to-End Service", desc: "From venue scouting to clean-up — every dimension of your event is our responsibility." },
  { icon: Star, title: "Luxury Partnerships", desc: "Exclusive tie-ups with the finest caterers, florists, photographers, and decorators in the region." },
  { icon: CheckCircle2, title: "Transparent Pricing", desc: "No hidden costs, no surprises. Detailed proposals and milestone-based billing you can trust." },
];

const TESTIMONIALS_STATIC = [
  { name: "Priya & Arjun Sharma", role: "Wedding Clients", quote: "Memorable Events transformed our dream wedding into a flawless reality. Every detail was perfect — from the Himalayan backdrop to the last flower petal.", rating: 5 },
  { name: "Rajesh Kapoor", role: "Corporate Client, TCS Shimla", quote: "Our annual conference was elevated beyond expectations. The team's professionalism and attention to detail was extraordinary. We will not work with anyone else.", rating: 5 },
  { name: "Sunita Verma", role: "Birthday Celebration", quote: "They turned my 50th birthday into a magical evening I'll cherish forever. Guests are still talking about it months later!", rating: 5 },
];

const GALLERY_STATIC = [
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80", alt: "Luxury Wedding" },
  { src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80", alt: "Corporate Event" },
  { src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80", alt: "Birthday Celebration" },
  { src: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=800&q=80", alt: "Gala Dinner" },
  { src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80", alt: "Outdoor Ceremony" },
  { src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80", alt: "Venue Decor" },
];

const FAQ_PREVIEW = [
  { q: "What types of events do you manage?", a: "We specialise in weddings, corporate galas, birthday celebrations, private parties, and destination events across the Himalayas." },
  { q: "How far in advance should I book?", a: "We recommend booking at least 6–12 months ahead for weddings and major events. However, we also accommodate shorter timelines." },
  { q: "Do you handle destination events outside Shimla?", a: "Yes — we plan events across Himachal Pradesh including Manali, Dharamshala, Kasauli, and beyond." },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

export default function Home() {
  const { data: settings } = useGetSettings();
  const { data: services } = useListServices();
  const { data: testimonials } = useListTestimonials();
  const { data: gallery } = useListGallery();
  const [statsVisible, setStatsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const displayTestimonials = (testimonials && testimonials.length > 0) ? testimonials : TESTIMONIALS_STATIC;
  const displayGallery = (gallery && gallery.length > 0) ? gallery.slice(0, 6) : GALLERY_STATIC;

  useEffect(() => {
    document.title = `${settings?.siteName || "Memorable Events"} — Luxury Event Management`;
  }, [settings]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % displayTestimonials.length), 5000);
    return () => clearInterval(t);
  }, [displayTestimonials.length]);

  return (
    <PublicLayout>
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=90"
            alt="Luxury Wedding Shimla"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/60 to-secondary/90" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="container relative z-10 mx-auto px-4 text-center"
        >
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }}>
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0.3em" }}
              animate={{ opacity: 1, letterSpacing: "0.4em" }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="text-primary font-medium tracking-[0.4em] uppercase text-xs md:text-sm mb-8 block"
            >
              Event Managing Agencies in Shimla
            </motion.span>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif text-white mb-8 leading-[1.05] tracking-tight">
              {settings?.heroHeadline
                ? settings.heroHeadline
                : <>Your Dream Event,<br /><em className="text-primary not-italic">Perfectly Orchestrated</em></>}
            </h1>

            <p className="text-lg md:text-xl text-white/75 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
              {settings?.heroSubheadline || "From intimate mountain weddings to grand corporate galas — we craft extraordinary experiences in the heart of the Himalayas."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button asChild size="lg" className="px-10 h-14 text-base rounded-none bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest">
                <Link href="/book">Begin Your Journey</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-10 h-14 text-base rounded-none border-white/40 text-white hover:bg-white hover:text-secondary uppercase tracking-widest">
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>

            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ArrowDown className="w-6 h-6 text-white/50 mx-auto" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS BAR ── */}
      <div ref={statsRef} className="bg-primary py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-3xl md:text-5xl font-serif font-bold text-secondary mb-1">{stat.value}</div>
                <div className="text-secondary/80 text-sm font-medium uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── OUR STORY ── */}
      <section className="py-28 md:py-36 bg-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
              <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-6 block">Our Heritage</span>
              <h2 className="text-4xl md:text-6xl font-serif text-foreground mb-8 leading-[1.1]">
                Crafting Unforgettable Experiences Since 2009
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                {settings?.aboutText || "Born in the heart of Shimla, Memorable Events was founded on a singular belief: that every celebration deserves the same meticulous care as a work of art. What began as a boutique wedding planning firm has grown into Himachal Pradesh's most trusted full-service event management house."}
              </p>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                Today we blend timeless Indian hospitality with international luxury standards — curating sensory experiences that unfold against the breathtaking backdrop of the Himalayas.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 mb-10">
                {[["Intimate to Grand", "5 to 5,000 guests"], ["Mountain Specialists", "Shimla, Manali & beyond"], ["Full Service", "Concept to clean-up"]].map(([t, d]) => (
                  <div key={t}>
                    <div className="text-foreground font-semibold text-sm mb-1">{t}</div>
                    <div className="text-muted-foreground text-sm">{d}</div>
                  </div>
                ))}
              </div>
              <Button asChild variant="link" className="text-primary p-0 h-auto font-medium text-base group">
                <Link href="/about" className="flex items-center gap-2">
                  Discover Our Full Story <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="relative">
              <div className="relative h-[600px] md:h-[700px]">
                <img
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=85"
                  alt="Elegant Event Setup"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 to-transparent" />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-8 -left-8 bg-card p-8 shadow-2xl max-w-[240px] border border-primary/20"
              >
                <div className="text-5xl font-serif text-primary mb-2">15+</div>
                <div className="font-semibold text-foreground text-lg mb-1">Years of Excellence</div>
                <p className="text-sm text-muted-foreground">Flawless execution, uncompromising quality.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -top-6 -right-6 bg-primary p-6 shadow-xl max-w-[180px]"
              >
                <div className="text-4xl font-serif text-secondary mb-1">500+</div>
                <div className="font-medium text-secondary/90 text-sm">Events Crafted</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-28 md:py-36 bg-secondary/5">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div>
              <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-4 block">Our Expertise</span>
              <h2 className="text-4xl md:text-6xl font-serif text-foreground leading-[1.1]">
                Bespoke Services<br />for Every Occasion
              </h2>
            </div>
            <Button asChild variant="outline" className="self-start md:self-auto rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 h-12 uppercase tracking-widest text-xs">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-0.5 bg-border/30">
            {(services?.filter(s => s.isActive).slice(0, 3) || []).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative overflow-hidden cursor-pointer bg-background"
              >
                <Link href={`/services/${service.id}`}>
                  <div className="relative h-80 md:h-[420px] overflow-hidden">
                    <img
                      src={service.imageUrl || `https://images.unsplash.com/photo-${["1519741497674-611481863552","1464366400600-7168b8af9bc3","1530103862676-de8c9debad1d"][index]}?auto=format&fit=crop&w=800&q=80`}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="text-primary/60 text-xs font-medium tracking-widest uppercase mb-2">0{index + 1}</div>
                    <h3 className="text-2xl md:text-3xl font-serif text-white mb-3">{service.name}</h3>
                    <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-4 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      {service.description}
                    </p>
                    <span className="text-primary text-sm font-medium flex items-center gap-2">
                      Explore <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-28 md:py-36 bg-secondary text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-5">
          <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2000&q=80" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-4 block">How We Work</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white leading-[1.1]">Our Process</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative"
              >
                <div className="text-primary/30 text-8xl font-serif font-bold leading-none mb-6 select-none">{p.step}</div>
                <div className="w-12 h-px bg-primary mb-6" />
                <h3 className="text-xl font-serif text-white mb-4">{p.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{p.desc}</p>
                {i < 3 && <div className="hidden md:block absolute top-10 right-0 w-full h-px bg-primary/20 translate-x-1/2" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ── */}
      <section className="py-28 md:py-36 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-4 block">Our Portfolio</span>
              <h2 className="text-4xl md:text-6xl font-serif text-foreground leading-[1.1]">
                Moments We've<br />Made Extraordinary
              </h2>
            </div>
            <Button asChild variant="outline" className="self-start md:self-auto rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 h-12 uppercase tracking-widest text-xs">
              <Link href="/gallery">View Gallery</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {displayGallery.map((item: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`relative overflow-hidden group cursor-pointer ${i === 0 ? "row-span-2" : ""}`}
                style={{ aspectRatio: i === 0 ? "auto" : "1/1" }}
              >
                <img
                  src={(item as any).imageUrl || (item as any).src}
                  alt={(item as any).caption || (item as any).alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ height: i === 0 ? "100%" : "240px" }}
                />
                <div className="absolute inset-0 bg-secondary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-white font-serif text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    {(item as any).caption || (item as any).alt}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-28 md:py-36 bg-accent/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-4 block">Why Memorable Events</span>
            <h2 className="text-4xl md:text-6xl font-serif text-foreground leading-[1.1]">The Difference Is<br />in the Details</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
            {WHY_US.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-10 bg-background hover:bg-primary transition-all duration-500 cursor-default border border-border/50 hover:border-primary"
              >
                <item.icon className="w-8 h-8 text-primary group-hover:text-secondary mb-6 transition-colors duration-500" />
                <h3 className="text-xl font-serif text-foreground group-hover:text-secondary mb-4 transition-colors duration-500">{item.title}</h3>
                <p className="text-muted-foreground group-hover:text-secondary/80 text-sm leading-relaxed transition-colors duration-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 md:py-36 bg-secondary text-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-4 block">Client Stories</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white leading-[1.1]">Voices of Our Clients</h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <Quote className="w-16 h-16 text-primary/20 mb-8 mx-auto" />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="text-xl md:text-3xl font-serif text-white/90 leading-relaxed mb-10 italic">
                  "{(displayTestimonials[activeTestimonial] as any).quote || (displayTestimonials[activeTestimonial] as any).content}"
                </p>
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-primary text-primary" />)}
                </div>
                <div className="text-white font-semibold text-lg">{(displayTestimonials[activeTestimonial] as any).clientName || (displayTestimonials[activeTestimonial] as any).name}</div>
                <div className="text-white/50 text-sm mt-1">{(displayTestimonials[activeTestimonial] as any).eventType || (displayTestimonials[activeTestimonial] as any).role}</div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-12">
              {displayTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`transition-all duration-300 rounded-full ${i === activeTestimonial ? "bg-primary w-8 h-2" : "bg-white/30 w-2 h-2 hover:bg-white/60"}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button asChild variant="outline" className="rounded-none border-white/30 text-white hover:bg-white hover:text-secondary px-10 h-12 uppercase tracking-widest text-xs">
              <Link href="/testimonials">Read All Stories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FAQ PREVIEW ── */}
      <section className="py-28 md:py-36 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
            <div>
              <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-6 block">Common Questions</span>
              <h2 className="text-4xl md:text-6xl font-serif text-foreground leading-[1.1] mb-8">
                Answers to Your Questions
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-10">
                Planning your event should be exciting, not stressful. Here are the answers to the questions we hear most often.
              </p>
              <Button asChild className="rounded-none px-10 h-12 uppercase tracking-widest text-xs">
                <Link href="/faq">View All FAQs</Link>
              </Button>
            </div>

            <div className="space-y-0 border border-border/50">
              {FAQ_PREVIEW.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="border-b border-border/50 last:border-0"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-8 py-6 flex items-center justify-between gap-4 hover:bg-accent/30 transition-colors"
                  >
                    <span className="font-medium text-foreground">{faq.q}</span>
                    <ChevronRight className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-8 pb-6 text-muted-foreground leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-36 md:py-48 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Event Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary/85" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-8 block">Begin Your Story</span>
            <h2 className="text-5xl md:text-7xl font-serif mb-8 text-white leading-[1.05]">
              Let's Create Something<br /><em className="text-primary not-italic">Extraordinary</em>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              Every great event begins with a conversation. Schedule a complimentary consultation with our creative director and start building your vision today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="px-12 h-14 text-base rounded-none bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest">
                <Link href="/book">Request a Consultation</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-12 h-14 text-base rounded-none border-white/30 text-white hover:bg-white hover:text-secondary uppercase tracking-widest">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-10 text-white/60 text-sm">
              <a href={`tel:${settings?.phone || "9816585535"}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" /> {settings?.phone || "9816585535"}
              </a>
              <a href={`mailto:${settings?.email || "info@universalagencies.in"}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" /> {settings?.email || "info@universalagencies.in"}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Shimla, Himachal Pradesh
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
