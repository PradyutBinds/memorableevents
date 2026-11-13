import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/ScrollToTop";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Gallery from "@/pages/Gallery";
import Testimonials from "@/pages/Testimonials";
import Faq from "@/pages/Faq";
import Contact from "@/pages/Contact";
import Book from "@/pages/Book";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminBookings from "@/pages/admin/Bookings";
import AdminMessages from "@/pages/admin/Messages";
import AdminServices from "@/pages/admin/Services";
import AdminGallery from "@/pages/admin/Gallery";
import AdminTestimonials from "@/pages/admin/Testimonials";
import AdminFaqs from "@/pages/admin/Faqs";
import AdminSettings from "@/pages/admin/Settings";

import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        {/* Public Routes */}
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/services/:id" component={ServiceDetail} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/testimonials" component={Testimonials} />
        <Route path="/faq" component={Faq} />
        <Route path="/contact" component={Contact} />
        <Route path="/book" component={Book} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />

        {/* Admin Routes */}
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/bookings" component={AdminBookings} />
        <Route path="/admin/messages" component={AdminMessages} />
        <Route path="/admin/services" component={AdminServices} />
        <Route path="/admin/gallery" component={AdminGallery} />
        <Route path="/admin/testimonials" component={AdminTestimonials} />
        <Route path="/admin/faqs" component={AdminFaqs} />
        <Route path="/admin/settings" component={AdminSettings} />

        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;