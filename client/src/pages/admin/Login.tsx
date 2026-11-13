import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPass, setShowPass] = useState(false);
  const loginMutation = useAdminLogin();

  useEffect(() => {
    document.title = "Admin Login — Memorable Events";
  }, []);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    loginMutation.mutate({ data: values }, {
      onSuccess: () => setLocation("/admin"),
      onError: () => {
        form.setError("password", { message: "Invalid username or password" });
      }
    });
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
          alt="Memorable Events"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/95 to-secondary/70" />
        <div className="absolute inset-0 flex flex-col items-start justify-end p-16">
          <span className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-4">Admin Portal</span>
          <h1 className="text-5xl font-serif text-white mb-4 leading-tight">Memorable<br />Events</h1>
          <p className="text-white/60 text-lg max-w-sm leading-relaxed">
            Shimla's premier event management platform. Manage bookings, content, and clients from one place.
          </p>
          <div className="mt-12 flex items-center gap-6">
            {[["500+", "Events"], ["15+", "Years"], ["98%", "Satisfaction"]].map(([v, l]) => (
              <div key={l}>
                <div className="text-2xl font-serif text-primary font-bold">{v}</div>
                <div className="text-white/50 text-xs uppercase tracking-widest">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-serif text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to access the admin dashboard</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Memorableadmin"
                      autoComplete="username"
                      className="rounded-none h-12 border-border focus-visible:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="rounded-none h-12 pr-12 border-border focus-visible:border-primary"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button
                type="submit"
                className="w-full h-12 rounded-none uppercase tracking-widest text-sm mt-2"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>

          <p className="text-center text-muted-foreground/50 text-xs mt-8">
            Protected area — authorised personnel only
          </p>
        </motion.div>
      </div>
    </div>
  );
}
