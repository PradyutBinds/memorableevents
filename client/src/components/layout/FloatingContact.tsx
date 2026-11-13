import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Phone, MessageCircle } from "lucide-react";

export function FloatingContact() {
  return (
    <>
      <a
        href="tel:9816585535"
        className={cn(
          "fixed bottom-6 left-6 z-50",
          "flex items-center justify-center w-14 h-14 rounded-full",
          "bg-primary text-primary-foreground shadow-lg",
          "transition-transform hover:scale-110 active:scale-95"
        )}
        aria-label="Call Us"
      >
        <Phone className="w-6 h-6" />
      </a>
      <a
        href="https://wa.me/919816585535"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "fixed bottom-6 right-6 z-50",
          "flex items-center justify-center w-14 h-14 rounded-full",
          "bg-[#25D366] text-white shadow-lg",
          "transition-transform hover:scale-110 active:scale-95"
        )}
        aria-label="WhatsApp Us"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </>
  );
}