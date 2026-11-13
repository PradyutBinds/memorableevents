import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetSettings } from "@workspace/api-client-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { data: settings } = useGetSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/gallery", label: "Gallery" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/contact", label: "Contact" },
  ];

  const siteName = settings?.siteName || "Memorable Events";

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-40 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span
              className={cn(
                "font-serif text-2xl md:text-3xl font-bold tracking-tight",
                isScrolled ? "text-foreground" : "text-foreground md:text-white"
              )}
            >
              {siteName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium tracking-wide uppercase transition-colors hover:text-primary",
                  location === link.href
                    ? "text-primary"
                    : isScrolled
                    ? "text-foreground/80"
                    : "text-white/90"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="rounded-none px-8 h-12 uppercase tracking-widest text-xs">
              <Link href="/book">Book Event</Link>
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className={cn(
              "md:hidden p-2",
              isScrolled ? "text-foreground" : "text-foreground md:text-white"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b shadow-lg py-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-lg font-medium py-2 border-b border-border/50",
                location === link.href ? "text-primary" : "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="w-full mt-4 rounded-none h-12 uppercase tracking-widest">
            <Link href="/book">Book Event</Link>
          </Button>
        </div>
      )}
    </header>
  );
}