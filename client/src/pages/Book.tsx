import { useEffect } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSubmitBooking } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CalendarIcon, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const formSchema = z.object({
  clientName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  eventType: z.string().min(1, "Event type is required"),
  eventDate: z.date({ required_error: "Please select an event date" }),
  venue: z.string().optional(),
  guestCount: z.coerce.number().optional(),
  budget: z.string().optional(),
  notes: z.string().optional(),
});

const STEPS = [
  { n: "01", label: "You share your vision" },
  { n: "02", label: "We review & reach out within 24h" },
  { n: "03", label: "We build your dream event together" },
];

export default function Book() {
  const { toast } = useToast();
  const submitMutation = useSubmitBooking();

  useEffect(() => {
    document.title = "Book an Event — Memorable Events";
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { clientName: "", email: "", phone: "", eventType: "", venue: "", budget: "", notes: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitMutation.mutate({
      data: { ...values, eventDate: format(values.eventDate, "yyyy-MM-dd") }
    }, {
      onSuccess: () => {
        toast({ title: "Booking request submitted!", description: "Our team will contact you within 24 hours to begin planning." });
        form.reset();
      },
      onError: () => {
        toast({ title: "Submission failed", description: "Please try again or call us directly.", variant: "destructive" });
      }
    });
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end justify-center pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=90" alt="Book Event" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-secondary/20" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <span className="text-primary font-medium tracking-[0.4em] uppercase text-xs mb-6 block">Begin Your Journey</span>
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 leading-[1.05]">
              Book an <em className="text-primary not-italic">Event</em>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Tell us about your vision. We'll handle everything from there.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <div className="bg-primary py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {STEPS.map(step => (
              <div key={step.n}>
                <div className="text-secondary/30 text-3xl font-serif font-bold mb-1">{step.n}</div>
                <div className="text-secondary/90 text-sm font-medium">{step.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <section className="py-28 md:py-36 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-3 gap-16 items-start">
            {/* Sidebar info */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <span className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-6 block">What to Expect</span>
                <h2 className="text-3xl font-serif text-foreground mb-6 leading-[1.2]">We Make It Simple</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Fill out the form with as much detail as you'd like. Our creative director will review your request and reach out personally within 24 hours.
                </p>
                <div className="space-y-5">
                  {[
                    "No commitment required — it's just a conversation",
                    "Personalised proposal crafted for your vision",
                    "Transparent pricing from the first meeting",
                    "Flexible packages for every budget",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-10 p-6 bg-accent/30 border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Prefer to call?</p>
                  <a href="tel:9816585535" className="text-foreground font-serif text-xl hover:text-primary transition-colors">
                    9816585535
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">9am – 9pm · 7 days a week</p>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="bg-card border border-border p-10 md:p-12">
                <h3 className="text-2xl font-serif text-foreground mb-2">Your Event Details</h3>
                <p className="text-muted-foreground text-sm mb-8">Fields marked with * are required.</p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name & Email */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="clientName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Full Name <span className="text-primary">*</span></FormLabel>
                          <FormControl><Input placeholder="Your full name" className="rounded-none h-12" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Email <span className="text-primary">*</span></FormLabel>
                          <FormControl><Input placeholder="you@example.com" className="rounded-none h-12" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    {/* Phone & Event Type */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Phone</FormLabel>
                          <FormControl><Input placeholder="+91 9876543210" className="rounded-none h-12" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="eventType" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Event Type <span className="text-primary">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-none h-12">
                                <SelectValue placeholder="Select event type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Wedding">Wedding</SelectItem>
                              <SelectItem value="Corporate">Corporate Event</SelectItem>
                              <SelectItem value="Birthday">Birthday Celebration</SelectItem>
                              <SelectItem value="Private">Private Party</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    {/* Date & Guests */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="eventDate" render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-xs uppercase tracking-widest">Event Date <span className="text-primary">*</span></FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" className={cn("h-12 rounded-none text-left font-normal justify-start", !field.value && "text-muted-foreground")}>
                                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                  {field.value ? format(field.value, "PPP") : "Select date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={d => d < new Date()} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="guestCount" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Estimated Guests</FormLabel>
                          <FormControl><Input type="number" placeholder="e.g. 150" className="rounded-none h-12" {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    {/* Venue & Budget */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="venue" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Venue (if known)</FormLabel>
                          <FormControl><Input placeholder="e.g. The Oberoi Cecil" className="rounded-none h-12" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="budget" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Estimated Budget</FormLabel>
                          <FormControl><Input placeholder="e.g. ₹5,00,000" className="rounded-none h-12" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    {/* Notes */}
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest">Tell Us About Your Vision</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Share your ideas, themes, special requirements, or anything that matters to you…" className="rounded-none min-h-[140px] resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <Button type="submit" className="w-full h-14 text-base rounded-none uppercase tracking-widest" disabled={submitMutation.isPending}>
                      {submitMutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      Submit Booking Request
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      By submitting, you agree to be contacted by our team. No payment required at this stage.
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
