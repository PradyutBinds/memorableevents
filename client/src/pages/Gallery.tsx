import { useEffect, useState } from "react";
import { useListGallery } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORIES = ["All", "Wedding", "Corporate", "Birthday", "Private Events"];

const FALLBACK = [
  { id: 1, imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80", title: "Mountain Wedding", category: "Wedding", isActive: true },
  { id: 2, imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80", title: "Corporate Conference", category: "Corporate", isActive: true },
  { id: 3, imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80", title: "Birthday Gala", category: "Birthday", isActive: true },
  { id: 4, imageUrl: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=800&q=80", title: "Garden Reception", category: "Wedding", isActive: true },
  { id: 5, imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80", title: "Himalayan Ceremony", category: "Wedding", isActive: true },
  { id: 6, imageUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80", title: "Evening Gala", category: "Corporate", isActive: true },
  { id: 7, imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80", title: "Luxury Decor", category: "Wedding", isActive: true },
  { id: 8, imageUrl: "https://images.unsplash.com/photo-1521543298264-785fba548a99?auto=format&fit=crop&w=800&q=80", title: "Private Party", category: "Private Events", isActive: true },
  { id: 9, imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80", title: "Night Reception", category: "Wedding", isActive: true },
  { id: 10, imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80", title: "Floral Wedding", category: "Wedding", isActive: true },
  { id: 11, imageUrl: "https://images.unsplash.com/photo-1487837647815-bbc1f30cd0d2?auto=format&fit=crop&w=800&q=80", title: "Grand Banquet", category: "Corporate", isActive: true },
  { id: 12, imageUrl: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80", title: "Sweet Celebration", category: "Birthday", isActive: true },
];

export default function Gallery() {
  const { data: gallery, isLoading } = useListGallery();
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items = (gallery && gallery.length > 0) ? gallery.filter((g: any) => g.isActive) : FALLBACK;
  const filtered = activeCategory === "All" ? items : items.filter((g: any) =>
    (g.category || "").toLowerCase().includes(activeCategory.toLowerCase()) ||
    (g.title || "").toLowerCase().includes(activeCategory.toLowerCase())
  );

  useEffect(() => {
    document.title = "Gallery — Memorable Events";
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox(p => p !== null ? Math.min(p + 1, filtered.length - 1) : null);
      if (e.key === "ArrowLeft") setLightbox(p => p !== null ? Math.max(p - 1, 0) : null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, filtered.length]);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end justify-center pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2400&q=90" alt="Gallery" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-secondary/20" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <span className="text-primary font-medium tracking-[0.4em] uppercase text-xs mb-6 block">Our Portfolio</span>
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 leading-[1.05]">
              <em className="text-primary not-italic">Gallery</em>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Every photograph tells a story of meticulous planning, creative vision, and flawless execution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-[64px] z-20 bg-background/95 backdrop-blur-md border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-5 py-2 text-xs font-medium uppercase tracking-widest transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary bg-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="shrink-0 ml-auto text-xs text-muted-foreground whitespace-nowrap pl-4">{filtered.length} images</span>
          </div>
        </div>
      </div>

      {/* Masonry Grid */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No images in this category yet.</div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-3">
              {filtered.map((item: any, i: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="relative group overflow-hidden cursor-pointer break-inside-avoid mb-3"
                  onClick={() => setLightbox(i)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105 block"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-secondary/75 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-white font-serif text-xl mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">{item.title}</h3>
                    {item.category && <p className="text-primary text-xs uppercase tracking-widest translate-y-2 group-hover:translate-y-0 transition-transform duration-500">{item.category}</p>}
                    <div className="w-8 h-px bg-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors" onClick={() => setLightbox(null)}>
              <X className="w-8 h-8" />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-3 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightbox(p => p !== null ? Math.max(p - 1, 0) : null); }}
              disabled={lightbox === 0}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={filtered[lightbox]?.imageUrl}
              alt={filtered[lightbox]?.title}
              className="max-h-[85vh] max-w-[85vw] object-contain shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-3 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightbox(p => p !== null ? Math.min(p + 1, filtered.length - 1) : null); }}
              disabled={lightbox === filtered.length - 1}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <p className="text-white/80 font-serif text-lg">{filtered[lightbox]?.title}</p>
              <p className="text-white/40 text-sm mt-1">{lightbox + 1} / {filtered.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PublicLayout>
  );
}
