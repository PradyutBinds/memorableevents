import { useGetAdminStats } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Calendar, MessageSquare, Briefcase, Star, Loader2, TrendingUp, Clock, CheckCircle, AlertCircle, ArrowRight, Users } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { motion } from "framer-motion";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending:   { label: "Pending",   className: "bg-amber-100 text-amber-700 border border-amber-200" },
  confirmed: { label: "Confirmed", className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  completed: { label: "Completed", className: "bg-blue-100 text-blue-700 border border-blue-200" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 border border-red-200" },
};

export default function Dashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  if (isLoading || !stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading dashboard…</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good morning 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with Memorable Events today.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Bookings",
              value: stats.totalBookings,
              sub: `${stats.pendingBookings} pending review`,
              icon: Calendar,
              trend: stats.pendingBookings > 0 ? "action" : "ok",
              href: "/admin/bookings",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              title: "Unread Messages",
              value: stats.unreadMessages,
              sub: `${stats.totalMessages} total messages`,
              icon: MessageSquare,
              trend: stats.unreadMessages > 0 ? "action" : "ok",
              href: "/admin/messages",
              color: "text-violet-600",
              bg: "bg-violet-50",
            },
            {
              title: "Active Services",
              value: stats.totalServices,
              sub: "Listed on site",
              icon: Briefcase,
              trend: "neutral",
              href: "/admin/services",
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
            {
              title: "Testimonials",
              value: stats.totalTestimonials,
              sub: "Published reviews",
              icon: Star,
              trend: "neutral",
              href: "/admin/testimonials",
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link href={card.href}>
                <div className="group p-6 bg-card border border-border rounded-xl hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-lg ${card.bg}`}>
                      <card.icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    {card.trend === "action" && (
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Action needed
                      </span>
                    )}
                    {card.trend === "ok" && (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{card.value}</div>
                  <div className="text-sm font-medium text-foreground mb-0.5">{card.title}</div>
                  <div className="text-xs text-muted-foreground">{card.sub}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="font-semibold text-foreground">Recent Bookings</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Latest event requests</p>
              </div>
              <Link href="/admin/bookings">
                <span className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></span>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Client</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Event</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats.recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <Calendar className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">No bookings yet</p>
                      </td>
                    </tr>
                  ) : (
                    stats.recentBookings.map((booking) => {
                      const statusCfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                      return (
                        <tr key={booking.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-foreground text-sm">{booking.clientName}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{booking.eventType}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-muted-foreground/50" />
                              {format(new Date(booking.eventDate), "MMM dd, yyyy")}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusCfg.className}`}>
                              {statusCfg.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="space-y-4"
          >
            {/* Quick Stats */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { label: "Manage Bookings", href: "/admin/bookings", icon: Calendar, badge: stats.pendingBookings || null },
                  { label: "Read Messages", href: "/admin/messages", icon: MessageSquare, badge: stats.unreadMessages || null },
                  { label: "Edit Services", href: "/admin/services", icon: Briefcase, badge: null },
                  { label: "Update Gallery", href: "/admin/gallery", icon: Star, badge: null },
                  { label: "Site Settings", href: "/admin/settings", icon: Users, badge: null },
                ].map(action => (
                  <Link key={action.href} href={action.href}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <action.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium text-foreground">{action.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {action.badge ? (
                          <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                            {action.badge}
                          </span>
                        ) : null}
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Status Summary */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-4">Booking Status</h2>
              <div className="space-y-3">
                {[
                  { label: "Pending", value: stats.pendingBookings, color: "bg-amber-400" },
                  { label: "Confirmed", value: stats.totalBookings - stats.pendingBookings, color: "bg-emerald-400" },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium text-foreground">{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-700`}
                        style={{ width: stats.totalBookings > 0 ? `${(item.value / stats.totalBookings) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
