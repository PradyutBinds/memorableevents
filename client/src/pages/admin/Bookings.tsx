import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAdminListBookings, useUpdateBooking, useDeleteBooking, getAdminListBookingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Bookings() {
  const { data: bookings, isLoading } = useAdminListBookings();
  const updateBooking = useUpdateBooking();
  const deleteBooking = useDeleteBooking();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");

  const filteredBookings = bookings?.filter(b => filter === "all" || b.status === filter) || [];

  const handleStatusChange = (id: number, status: string) => {
    updateBooking.mutate({ id, data: { status } }, {
      onSuccess: () => {
        toast({ title: "Status updated" });
        queryClient.invalidateQueries({ queryKey: getAdminListBookingsQueryKey() });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    deleteBooking.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Booking deleted" });
        queryClient.invalidateQueries({ queryKey: getAdminListBookingsQueryKey() });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to delete booking", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold tracking-tight">Bookings</h1>
          <div className="w-48">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Booking Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Event Details</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No bookings found.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3 align-top">
                          <div className="font-medium">{format(new Date(booking.createdAt), "MMM dd, yyyy")}</div>
                          <div className="text-xs text-muted-foreground">Req Date</div>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="font-medium">{booking.clientName}</div>
                          <div className="text-xs text-muted-foreground">{booking.email}</div>
                          <div className="text-xs text-muted-foreground">{booking.phone}</div>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="font-medium">{booking.eventType}</div>
                          <div className="text-xs text-muted-foreground">Event: {format(new Date(booking.eventDate), "MMM dd, yyyy")}</div>
                          {booking.venue && <div className="text-xs text-muted-foreground">Venue: {booking.venue}</div>}
                          {booking.guestCount && <div className="text-xs text-muted-foreground">Guests: {booking.guestCount}</div>}
                        </td>
                        <td className="px-4 py-3 align-top">
                          <Select 
                            value={booking.status} 
                            onValueChange={(val) => handleStatusChange(booking.id, val)}
                          >
                            <SelectTrigger className="w-[130px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3 align-top text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(booking.id)} className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}