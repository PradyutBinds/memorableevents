import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useGetAdminMe, useAdminLogout } from "@workspace/api-client-react";
import {
  Loader2, LayoutDashboard, Calendar, MessageSquare, Briefcase,
  Image as ImageIcon, Star, HelpCircle, Settings, LogOut,
  ChevronLeft, Menu, Bell, Search, ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
    ]
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/bookings", icon: Calendar, label: "Bookings" },
      { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
    ]
  },
  {
    label: "Content",
    items: [
      { href: "/admin/services", icon: Briefcase, label: "Services" },
      { href: "/admin/gallery", icon: ImageIcon, label: "Gallery" },
      { href: "/admin/testimonials", icon: Star, label: "Testimonials" },
      { href: "/admin/faqs", icon: HelpCircle, label: "FAQs" },
    ]
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", icon: Settings, label: "Settings" },
    ]
  }
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: user, isLoading, error } = useGetAdminMe({ query: { retry: false } });
  const logout = useAdminLogout();

  useEffect(() => {
    if (!isLoading && (error || !user)) {
      setLocation("/admin/login");
    }
  }, [user, isLoading, error, setLocation]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => setLocation("/admin/login"),
    });
  };

  const getPageTitle = () => {
    for (const section of NAV_SECTIONS) {
      for (const item of section.items) {
        if (item.exact ? location === item.href : location.startsWith(item.href)) {
          return item.label;
        }
      }
    }
    return "Dashboard";
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.aside
          animate={{ width: collapsed ? 72 : 260 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className={cn(
            "hidden md:flex flex-col bg-sidebar border-r border-sidebar-border fixed left-0 top-0 bottom-0 z-20 overflow-hidden",
          )}
        >
          {/* Logo */}
          <div className={cn(
            "h-16 flex items-center border-b border-sidebar-border shrink-0 transition-all duration-300",
            collapsed ? "justify-center px-4" : "px-6 justify-between"
          )}>
            {!collapsed && (
              <Link href="/admin">
                <div>
                  <div className="font-serif font-bold text-lg text-sidebar-foreground leading-tight">Universal</div>
                  <div className="text-xs text-primary font-medium tracking-widest uppercase">Admin Portal</div>
                </div>
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronLeft className="w-4 h-4" />
              </motion.div>
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
            {NAV_SECTIONS.map(section => (
              <div key={section.label} className="mb-1">
                {!collapsed && (
                  <div className="px-4 py-2 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-widest">
                    {section.label}
                  </div>
                )}
                {section.items.map(item => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    exact={item.exact}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className={cn(
            "border-t border-sidebar-border p-3 shrink-0",
            collapsed ? "flex justify-center" : ""
          )}>
            {!collapsed ? (
              <div className="flex items-center gap-3 px-3 py-2 rounded-md">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-sidebar-foreground truncate">Administrator</div>
                  <div className="text-xs text-sidebar-foreground/50 truncate">admin@universalagencies.in</div>
                </div>
                <button onClick={handleLogout} className="p-1 text-sidebar-foreground/50 hover:text-destructive transition-colors" title="Sign out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={handleLogout} className="p-2 text-sidebar-foreground/50 hover:text-destructive transition-colors rounded-md hover:bg-sidebar-accent" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-40 flex flex-col md:hidden"
          >
            <div className="h-16 flex items-center justify-between px-5 border-b border-sidebar-border">
              <div>
                <div className="font-serif font-bold text-lg text-sidebar-foreground">Universal</div>
                <div className="text-xs text-primary font-medium tracking-widest uppercase">Admin Portal</div>
              </div>
            </div>
            <nav className="flex-1 py-4 overflow-y-auto">
              {NAV_SECTIONS.map(section => (
                <div key={section.label} className="mb-1">
                  <div className="px-4 py-2 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-widest">{section.label}</div>
                  {section.items.map(item => (
                    <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} exact={item.exact} />
                  ))}
                </div>
              ))}
            </nav>
            <div className="border-t border-sidebar-border p-3">
              <Button variant="ghost" className="w-full justify-start text-sidebar-foreground" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <motion.main
        animate={{ marginLeft: collapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="flex-1 flex flex-col min-w-0 md:ml-[260px]"
        style={{ marginLeft: undefined }}
      >
        {/* Topbar */}
        <header className="h-16 bg-background border-b border-border flex items-center px-4 md:px-8 gap-4 sticky top-0 z-10 shrink-0">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h1 className="text-base font-semibold text-foreground">{getPageTitle()}</h1>
            <div className="text-xs text-muted-foreground">Memorable Events CMS</div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex gap-2 text-muted-foreground hover:text-foreground">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                <span className="text-xs">View Site</span>
              </a>
            </Button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
}

function NavItem({
  href, icon: Icon, label, exact, collapsed
}: {
  href: string; icon: any; label: string; exact?: boolean; collapsed?: boolean;
}) {
  const [location] = useLocation();
  const isActive = exact ? location === href : (href !== "/admin" && location.startsWith(href)) || (exact && location === href);

  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer group",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
          collapsed ? "justify-center" : ""
        )}
        title={collapsed ? label : undefined}
      >
        <Icon className={cn("shrink-0 transition-none", isActive ? "w-4 h-4" : "w-4 h-4")} />
        {!collapsed && <span className="truncate">{label}</span>}
      </div>
    </Link>
  );
}
