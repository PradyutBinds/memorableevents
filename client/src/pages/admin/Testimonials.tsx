import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAdminListTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial, getAdminListTestimonialsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  clientName: z.string().min(1, "Client Name is required"),
  clientTitle: z.string().optional(),
  eventType: z.string().min(1, "Event Type is required"),
  review: z.string().min(1, "Review is required"),
  rating: z.coerce.number().min(1).max(5),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export default function Testimonials() {
  const { data: testimonials, isLoading } = useAdminListTestimonials();
  const createItem = useCreateTestimonial();
  const updateItem = useUpdateTestimonial();
  const deleteItem = useDeleteTestimonial();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientTitle: "",
      eventType: "",
      review: "",
      rating: 5,
      avatarUrl: "",
      isActive: true,
    },
  });

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    form.reset({
      clientName: item.clientName,
      clientTitle: item.clientTitle || "",
      eventType: item.eventType,
      review: item.review,
      rating: item.rating,
      avatarUrl: item.avatarUrl || "",
      isActive: item.isActive,
    });
    setIsOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      clientName: "",
      clientTitle: "",
      eventType: "",
      review: "",
      rating: 5,
      avatarUrl: "",
      isActive: true,
    });
    setIsOpen(true);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingId) {
      updateItem.mutate({ id: editingId, data: values }, {
        onSuccess: () => {
          toast({ title: "Testimonial updated" });
          queryClient.invalidateQueries({ queryKey: getAdminListTestimonialsQueryKey() });
          setIsOpen(false);
        }
      });
    } else {
      createItem.mutate({ data: values }, {
        onSuccess: () => {
          toast({ title: "Testimonial added" });
          queryClient.invalidateQueries({ queryKey: getAdminListTestimonialsQueryKey() });
          setIsOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    deleteItem.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Testimonial deleted" });
        queryClient.invalidateQueries({ queryKey: getAdminListTestimonialsQueryKey() });
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
          <h1 className="text-3xl font-serif font-bold tracking-tight">Testimonials</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" /> Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="clientName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="eventType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="review" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review</FormLabel>
                      <FormControl><Textarea className="h-24" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="rating" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating (1-5)</FormLabel>
                        <FormControl><Input type="number" min="1" max="5" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="avatarUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar URL (Optional)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="isActive" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 mt-8">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={createItem.isPending || updateItem.isPending}>
                    {(createItem.isPending || updateItem.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Testimonial
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials?.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="font-medium text-lg">{item.clientName}</div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-2">{item.eventType} • Rating: {item.rating}/5</div>
                <p className="text-sm line-clamp-3 italic">"{item.review}"</p>
                {!item.isActive && <div className="mt-2 text-xs bg-muted inline-block px-2 py-1 rounded text-red-500">Inactive</div>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}