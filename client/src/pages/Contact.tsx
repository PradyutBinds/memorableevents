import { useEffect } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSubmitContact, useGetSettings } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, Phone, Mail, Clock, Facebook } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { toast } = useToast();
  const { data: settings } = useGetSettings();
  const submitMutation = useSubmitContact();

  useEffect(() => {
    document.title = "Contact Us — Memorable Events";
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitMutation.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
        form.reset();
      },
      onError: () => {
        toast({ title: "Failed to send", description: "Please try again or call us directly.", variant: "destructive" });
      }
    });
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end justify-center pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2400&q=90" alt="Contact" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-secondary/20" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <span className="text-primary font-medium tracking-[0.4em] uppercase text-xs mb-6 block">Reach Out</span>
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 leading-[1.05]">
              Get in <em className="text-primary not-italic">Touch</em>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Whether you have a question or you're ready to start planning — we'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-28 md:py-36 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-start">
            {/* Info */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-6 block">Contact Information</span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-8 leading-[1.1]">
                We're Here for You,<br />Every Step of the Way
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-12">
                Our team is available seven days a week to assist with enquiries, consultations, and event planning. Reach us through any of the channels below.
              </p>

              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 border border-primary/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-foreground mb-1">Our Office</h3>
                    <p className="text-muted-foreground leading-relaxed">{settings?.address || "Old Bus Stand Rd, Krishna Nagar, Shimla, Himachal Pradesh 171001"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 border border-primary/30 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-foreground mb-1">Phone & WhatsApp</h3>
                    <a href={`tel:${settings?.phone || "9816585535"}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {settings?.phone || "9816585535"}
                    </a>
                    <p className="text-xs text-muted-foreground/60 mt-1">Available 9am – 9pm, 7 days a week</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 border border-primary/30 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-foreground mb-1">Email</h3>
                    <a href={`mailto:${settings?.email || "info@universalagencies.in"}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {settings?.email || "info@universalagencies.in"}
                    </a>
                    <p className="text-xs text-muted-foreground/60 mt-1">We respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 border border-primary/30 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-foreground mb-1">Office Hours</h3>
                    <p className="text-muted-foreground">Monday – Saturday: 9:00am – 7:00pm</p>
                    <p className="text-muted-foreground">Sunday: 10:00am – 4:00pm</p>
                  </div>
                </div>
              </div>

              {settings?.facebook && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Follow Us</p>
                  <div className="flex gap-3">
                    <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 border border-border hover:border-primary hover:text-primary flex items-center justify-center text-muted-foreground transition-colors">
                      <Facebook className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="bg-card border border-border p-10 md:p-12">
                <h3 className="text-2xl font-serif text-foreground mb-2">Send Us a Message</h3>
                <p className="text-muted-foreground text-sm mb-8">Fill out the form and we'll be in touch shortly.</p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest">Full Name <span className="text-primary">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" className="rounded-none h-12 border-border focus-visible:border-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Email <span className="text-primary">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" className="rounded-none h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 98160 20352" className="rounded-none h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest">Message <span className="text-primary">*</span></FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us how we can help…" className="rounded-none min-h-[140px] resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full h-14 text-base rounded-none uppercase tracking-widest" disabled={submitMutation.isPending}>
                      {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Message
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      We typically respond within 24 hours on business days.
                    </p>
                  </form>
                </Form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
