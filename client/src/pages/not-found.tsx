import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-8xl md:text-9xl font-serif text-primary font-bold mb-6">404</h1>
          <h2 className="text-3xl md:text-4xl font-serif mb-4 text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Button asChild size="lg" className="px-8 h-14 text-base rounded-none bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/">Return to Home</Link>
          </Button>
        </motion.div>
      </div>
    </PublicLayout>
  );
}