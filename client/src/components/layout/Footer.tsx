import { Link } from "wouter";
import { useGetSettings } from "@workspace/api-client-react";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const { data: settings } = useGetSettings();

  return (
    <footer className="bg-secondary text-secondary-foreground py-16 md:py-24 border-t border-primary/20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                {settings?.siteName || "Memorable Events"}
              </span>
            </Link>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed max-w-sm">
              {settings?.tagline ||
                "Orchestrating elite weddings, corporate galas, and private celebrations in the Himalayas and beyond."}
            </p>
            <div className="flex gap-4">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg font-medium text-white mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-medium text-white mb-6">Services</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/services/wedding" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                  Wedding Planning
                </Link>
              </li>
              <li>
                <Link href="/services/corporate" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                  Corporate Events
                </Link>
              </li>
              <li>
                <Link href="/services/birthday" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                  Birthday Celebrations
                </Link>
              </li>
              <li>
                <Link href="/services/private" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                  Private Parties
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-medium text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-secondary-foreground/70 text-sm">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span>{settings?.address || "Old Bus Stand Rd, Krishna Nagar, Shimla, Himachal Pradesh 171001"}</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/70 text-sm">
                <Phone size={18} className="text-primary shrink-0" />
                <a href={`tel:${settings?.phone || "9816585535"}`} className="hover:text-primary transition-colors">
                  {settings?.phone || "9816585535"}
                </a>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/70 text-sm">
                <Mail size={18} className="text-primary shrink-0" />
                <a href={`mailto:${settings?.email || "info@universalagencies.in"}`} className="hover:text-primary transition-colors">
                  {settings?.email || "info@universalagencies.in"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary-foreground/50 text-sm">
            © {new Date().getFullYear()} {settings?.siteName || "Memorable Events"}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-secondary-foreground/50 hover:text-primary transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-secondary-foreground/50 hover:text-primary transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}